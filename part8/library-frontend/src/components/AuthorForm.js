import { useState } from "react";
import { useMutation } from "@apollo/client";

import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

const AuthorForm = ({authors}) => {
  const [birthYear, setBirthYear] = useState("");

  const [changeYOB] = useMutation(EDIT_AUTHOR, {refetchQueries: [ { query: ALL_AUTHORS } ]});
  
  console.log("checking if authorsArr has id", authors);
  const submit = (event) => {
    event.preventDefault();

    const selectElement = document.getElementsByName("selectedName")[0];
    const name = selectElement.value
    const setBornTo = Number(birthYear);

    changeYOB({ variables: { name, setBornTo } });
    setBirthYear("");
  };

  return (
    <div>
      <h2>Set birthyear</h2>

      <form onSubmit={submit}>
        <select name="selectedName">
          {authors.map(a => (<option key={a.id} value={a.name}> {a.name} </option>))}
        </select>
        <div>
          born{" "}
          <input
            value={birthYear}
            onChange={({ target }) => setBirthYear(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default AuthorForm;
