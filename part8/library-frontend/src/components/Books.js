import { useQuery, useLazyQuery } from "@apollo/client";
import { ALL_BOOKS, BOOKS_BY_GENRE } from "../queries";
import { useState } from "react";

const Books = (props) => {
  const result = useQuery(ALL_BOOKS, { skip: !props.show });
  const [selectedGenre, setSelectedGenre] = useState(undefined);
  const [booksByGenre, filteredBooks] = useLazyQuery(BOOKS_BY_GENRE);

  if (!props.show) {
    return null;
  }
  if (result.loading || filteredBooks.loading) {
    return <div>loading...</div>;
  }
  const allBooks = result.data.allBooks;
  const distinctGenres = [...new Set(allBooks.flatMap((b) => b.genres))];

  let shownBooks = !selectedGenre ? allBooks : filteredBooks.data.allBooks;

  const handleGenreSelect = (event) => {
    setSelectedGenre(event.target.value);
    booksByGenre({ variables: { genre: event.target.value } });
  };

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {shownBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Filter by genre</h2>
      <select value={selectedGenre} onChange={handleGenreSelect}>
        {distinctGenres.map((genre) => (
          <option key={genre} value={genre}>
            {" "}
            {genre}{" "}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Books;
