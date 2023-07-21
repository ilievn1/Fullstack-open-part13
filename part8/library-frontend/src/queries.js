import { gql } from "@apollo/client";

const AUTHOR_DETAILS = gql`
  fragment AuthorDetails on Author {
    id
    name
    born
    bookCount
  }
`;

const BOOK_DETAILS = gql`
  ${AUTHOR_DETAILS}
  fragment BookDetails on Book {
    id
    title
    published
    author {
      ...AuthorDetails
    }
    genres
  }
`;

export const ALL_AUTHORS = gql`
  ${AUTHOR_DETAILS}
  query {
    allAuthors {
      ...AuthorDetails
    }
  }
`;

export const ALL_BOOKS = gql`
  ${BOOK_DETAILS}
  query {
    allBooks {
      ...BookDetails
    }
  }
`;

export const BOOKS_BY_GENRE = gql`
  ${BOOK_DETAILS}
  query findBooksByGenre($genre: String!) {
    allBooks(genre: $genre) {
      ...BookDetails
    }
  }
`;
export const CURRENT_USER = gql`
  query {
    me {
      username
      id
      favoriteGenre
    }
  }
`;
export const ADD_BOOK = gql`
  ${BOOK_DETAILS}
  mutation addBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      ...BookDetails
    }
  }
`;
export const EDIT_AUTHOR = gql`
  ${AUTHOR_DETAILS}
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      ...AuthorDetails
    }
  }
`;
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const BOOK_ADDED = gql`
  ${BOOK_DETAILS}
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
`;
