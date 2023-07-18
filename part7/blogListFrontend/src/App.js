import { useRef } from "react";
import Notification from "./components/Notification.js";
import LoginForm from "./components/LoginForm.js";
import BlogCreationForm from "./components/BlogCreationForm.js";
import Togglable from "./components/Togglable.js";
import BlogsList from "./components/BlogsList.js";
import { useUserValue } from "./UserContext.js";
import { useLocalStorageAuth } from "./hooks/useLocalStorageAuth.js";
import { Container, Paper, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { Routes, Route, useMatch } from "react-router-dom";

import Blog from "./components/Blog.js";
import { useQuery } from "react-query";
import blogService from "./services/blogs.js";
import userService from "./services/users.js";
import UsersList from "./components/UsersList.js";
import User from "./components/User.js";
import {
  grey,
  purple,
} from "@mui/material/colors";
import Navbar from "./components/NavBar.js";

const App = () => {
  const user = useUserValue();
  const localStorageService = useLocalStorageAuth();
  const togglableFormRef = useRef();
  const blogsResults = useQuery("blogs", blogService.getAll, {
    enabled: !!user,
  });
  const usersResults = useQuery("users", userService.getAll, {
    enabled: !!user,
  });
  const blogMatch = useMatch("/blogs/:id");
  const userMatch = useMatch("/users/:id");

  if (blogsResults.isLoading || usersResults.isLoading) {
    console.log("Loading...");
    return <div>Loading...</div>;
  }
  if (blogsResults.isError || usersResults.isError) {
    console.error(blogsResults.error);
    return <div>Error... {blogsResults.error}</div>;
  }
  /*
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const userParsedJSON = JSON.parse(loggedUserJSON)
      dispatchUser(login(userParsedJSON))
      blogService.setToken(userParsedJSON.token)
    }
  }, [])
  */
  const linkStyling = {
    padding: 5,
  };

  const handleLogout = () => {
    localStorageService.logout();
  };

  if (!user) {
    return (
      <>
        <Notification />
        <LoginForm />
      </>
    );
  }

  const blog = blogMatch
    ? blogsResults.data.find((b) => b.id === blogMatch.params.id)
    : null;
  const individualUser = userMatch
    ? usersResults.data.find((u) => u.id === userMatch.params.id)
    : null;

  const darkTheme = createTheme({
    palette: {
      primary: purple,
      background: {
        default: purple[900],
        paper: purple[300],
      },
      text: {
        primary: "#fff",
        secondary: grey[300],
      },
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Paper>
        <Container>
          <Navbar handleLogout={handleLogout} />

          <Notification />
          <Togglable buttonLabel={"new blog"} ref={togglableFormRef}>
            <BlogCreationForm togglable={togglableFormRef} />
          </Togglable>

          <Routes>
            <Route path="/" element={<BlogsList />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/users/:id" element={<User user={individualUser} />} />
            <Route path="/blogs/:id" element={<Blog blog={blog} />} />
          </Routes>
        </Container>
      </Paper>
    </ThemeProvider>
  );
};

export default App;
