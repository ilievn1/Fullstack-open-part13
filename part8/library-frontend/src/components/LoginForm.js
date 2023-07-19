import { useRef } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../queries";

const LoginForm = ({ show, setToken }) => {
  const userInput = useRef();
  const passwordInput = useRef();

  const [login] = useMutation(LOGIN, {
    onCompleted: ({login}) => {
      const token = login.value;
      setToken(token);
      localStorage.setItem("loggedLibraryUser", token);
    },
  });

  if (!show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();
    const username = userInput.current.value  
    const password = passwordInput.current.value;  
    login({ variables: { username, password } });
    event.target.reset();
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username:{" "}
          <input
            ref={userInput}
          />
        </div>
        <div>
          password:{" "}
          <input
            type="password"
            ref={passwordInput}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
