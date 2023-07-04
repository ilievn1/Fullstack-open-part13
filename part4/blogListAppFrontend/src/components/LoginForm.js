
const LoginForm = (props) => (
  <div>
    <h1>log in to application</h1>
    <form onSubmit={props.handleLogin}>
      <div>
        username
          <input
          type="text"
          value={props.username}
          name="Username"
          onChange={props.handleUsernameChange}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={props.password}
          name="Password"
          onChange={props.handlePasswordChange}
        />
      </div>
      <button type="submit">login</button>
    </form>
  </div>
)

export default LoginForm
