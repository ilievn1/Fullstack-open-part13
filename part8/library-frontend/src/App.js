import { useState } from "react";
import { useApolloClient } from "@apollo/client";

import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Navbar from "./components/Navbar";
import Recommend from "./components/Recommend";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  const logout = () => {
    setToken(null);
    localStorage.removeItem("loggedLibraryUser");
    client.resetStore();
    setPage("login");
  };
  return (
    <div>
      <Navbar setPage={setPage} token={token} logout={logout} />

      <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook show={page === "addBook"} />

      <LoginForm show={page === "login"} setToken={setToken} />

      <Recommend show={page === "recommend"} />
    </div>
  );
};

export default App;
