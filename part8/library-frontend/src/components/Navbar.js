import React from "react";
const Navbar = ({ setPage, token, logout }) => {
  return (
    <div>
      <button onClick={() => setPage("authors")}>authors</button>
      <button onClick={() => setPage("books")}>books</button>
      {!token ? (
        <button onClick={() => setPage("login")}>login</button>
      ) : (
        <>
          <button onClick={() => setPage("recommend")}>recommend</button>
          <button onClick={() => setPage("addBook")}>add book</button>
          <button onClick={logout}>logout</button>
        </>
      )}
    </div>
  );
}
export default Navbar