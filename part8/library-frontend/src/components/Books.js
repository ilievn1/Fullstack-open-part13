import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";
import { useState } from "react";

const Books = (props) => {
  const result = useQuery(ALL_BOOKS, { skip: !props.show });
  const [selectedGenre, setSelectedGenre] = useState(undefined);

  if (!props.show) {
    return null;
  }
  if (result.loading) {
    return <div>loading...</div>;
  }
  const allBooks = result.data.allBooks;
  const filteredBooks = allBooks.filter(b => b.genres.includes(selectedGenre))

  const shownBooks = !selectedGenre ? allBooks : filteredBooks;
  const distinctGenres = [...new Set(allBooks.flatMap( b => b.genres))]
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
      <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} >
        {distinctGenres.map((genre) => (
          <option key={genre} value={genre}> {genre} </option>
        ))}
      </select>
    </div>
  );
}

export default Books
