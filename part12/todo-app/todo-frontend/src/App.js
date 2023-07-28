import './App.css';
import TodoView from './Todos/TodoView'

function App() {
  return (
    <div className="App">
      <TodoView />
      <p>Hello World!</p>
      <p>
        {process.env.REACT_APP_AMG
          ? `REACT_APP_AMG is set before build ${process.env.REACT_APP_AMG}`
          : "undefined"}
      </p>
    </div>
  );
}

export default App;
