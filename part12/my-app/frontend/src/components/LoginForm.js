import { useRef, useContext } from "react";
import NotificationContext, {
  notificationChange,
  notificationClear,
} from "../NotificationContext";
import { login, useUserDispatch } from "../UserContext.js";
import loginService from "../services/login";
import blogService from "../services/blogs";
import { Button, TextField } from "@mui/material";

const LoginForm = () => {
  const [notification, dispatchNotification] = useContext(NotificationContext);
  const userDispatch = useUserDispatch();
  const userInput = useRef();
  const passwordInput = useRef();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username: userInput.current.value,
        password: passwordInput.current.value,
      });
      window.localStorage.setItem("loggedBlogUser", JSON.stringify(user));
      userDispatch(login(user));
      blogService.setToken(user.token);
      userInput.current.value = "";
      passwordInput.current.value = "";
    } catch (exception) {
      dispatchNotification(notificationChange("Wrong credentials"));
      setTimeout(() => {
        dispatchNotification(notificationClear());
      }, 5000);
    }
  };
  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id="usernameInputField"
            type="text"
            name="Username"
            ref={userInput}
          />
        </div>
        <div>
          password
          <input
            label="password"
            type="password"
            id="passwordInputField"
            name="Password"
            ref={passwordInput}
          />
        </div>
        <Button
          id="login-btn"
          variant="contained"
          color="primary"
          type="submit"
        >
          login
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
