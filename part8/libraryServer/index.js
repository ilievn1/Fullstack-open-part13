const { GraphQLError } = require("graphql");
const { ApolloServer } = require("@apollo/server");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { startStandaloneServer } = require("@apollo/server/standalone");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

const MONGODB_URI = process.env.MONGODB_URI;

console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });
function isInputErroneous(args) {
  if (args.author.length < 4) {
    throw new GraphQLError("Author name is too short", {
      extensions: {
        code: "BAD_USER_INPUT",
        invalidArgs: args.author,
      },
    });
  } else if (args.title.length < 5) {
    throw new GraphQLError("Title is too short", {
      extensions: {
        code: "BAD_USER_INPUT",
        invalidArgs: args.title,
      },
    });
  } else if (args.published < 0 || args.published > new Date().getFullYear()) {
    throw new GraphQLError("Year cannot be negative or exceed current year", {
      extensions: {
        code: "BAD_USER_INPUT",
        invalidArgs: args.published,
      },
    });
  }
}

const typeDefs = `
  type Author {
    name: String!
    id: ID! 
    born: Int
    bookCount: Int!
  }
  
  type Book {
    title: String!,
    published: Int!,
    author: Author!,
    id: ID!,
    genres: [String!]!,
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }


  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User

  }
  type Mutation {
    addBook(
        title: String!
        author: String!
        published: Int!
        genres: [String!]!
    ): Book
    
    editAuthor( name: String! setBornTo: Int!): Author
    
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    
    login(
      username: String!
      password: String!
    ): Token
    }
`;
const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author && args.genre) {
        const bookAuthor = await Author.findOne({ name: args.author });
        return await Book.find({
          genres: args.genre,
          author: bookAuthor._id,
        }).populate("author");
      } else if (args.author) {
        const bookAuthor = await Author.findOne({ name: args.author });
        return await Book.find({ author: bookAuthor._id }).populate("author");
      } else if (args.genre) {
        return await Book.find({ genres: args.genre }).populate("author");
      } else {
        return await Book.find({}).populate("author");
      }
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      if (isInputErroneous(args)) {
        return null;
      }

      const bookAuthor = await Author.findOne({ name: args.author });
      let newBook = null;
      if (!bookAuthor) {
        const newAuthor = new Author({ name: args.author, born: null });
        await newAuthor.save();
        newBook = new Book({ ...args, author: newAuthor._id });
      } else {
        newBook = new Book({ ...args, author: bookAuthor._id });
      }
      return newBook.save().then((nB) => nB.populate("author"));
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      return await Author.findOneAndUpdate(
        { name: args.name },
        { born: args.setBornTo },
        { new: true, runValidators: true, context: "query" }
      );
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre });

      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "spaghetti") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.SECRET) };
    },
  },
  Author: {
    bookCount: async (root) => {
      return await Book.count({ author: root._id });
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.SECRET
      );
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
