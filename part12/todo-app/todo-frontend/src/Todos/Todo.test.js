import React from "react";
import "@testing-library/jest-dom/extend-expect";
import Todo from "./Todo";
import { render } from "@testing-library/react";

test("New Todo task is rendered", () => {
  const todo = {
    text: "sample",
    done: true,
  };

  const view = render(
    <Todo todo={todo} onClickComplete={()=> console.log('completed')} onClickDelete={() => console.log('deleted')} />
  );
  expect(view.container).toHaveTextContent(todo.text);
});
