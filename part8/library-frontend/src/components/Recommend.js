import { useQuery } from "@apollo/client";
import { ALL_BOOKS, CURRENT_USER } from "../queries";

const Recommend = (props) => {
  const books = useQuery(ALL_BOOKS, { skip: !props.show });
  const currentUser = useQuery(CURRENT_USER, { skip: !props.show });

  if (!props.show) {
    return null;
  }
  if (books.loading || currentUser.loading) {
    return <div>loading...</div>;
  }
  const favoriteGenre = currentUser.data.me.favoriteGenre;

  const allBooks = books.data.allBooks;
  const recommendedBooks = allBooks.filter((b) =>
    b.genres.includes(favoriteGenre)
  );

  return (
    <div>
      <h2>showing books for your favorite genre <em>{favoriteGenre}</em></h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendedBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommend;
