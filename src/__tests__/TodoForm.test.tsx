import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, beforeEach, expect } from "vitest";
import { act } from "react";
import { useTodoStore } from "@/store/todoStore";
import TodoForm from "@/components/TodoForm";

// helper to reset store before each test
beforeEach(() => {
  act(() => {
    useTodoStore.setState({ todos: [] });
  });
});

describe("TodoForm", () => {
  it("renders input and button", () => {
    render(<TodoForm />);
    expect(screen.getByRole("textbox", { name: /new todo title/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add todo/i })).toBeInTheDocument();
  });

  it("updates input value when typing", () => {
    render(<TodoForm />);
    const input = screen.getByRole("textbox", { name: /new todo title/i }) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "Test Task" } });
    expect(input.value).toBe("Test Task");
  });

  it("adds a new todo and clears input on submit", () => {
    render(<TodoForm />);
    const input = screen.getByRole("textbox", { name: /new todo title/i }) as HTMLInputElement;
    const button = screen.getByRole("button", { name: /add todo/i });

    fireEvent.change(input, { target: { value: "New Task" } });
    fireEvent.click(button);

    // check store
    const todos = useTodoStore.getState().todos;
    expect(todos.length).toBe(1);
    expect(todos[0].title).toBe("New Task");

    // input cleared
    expect(input.value).toBe("");
  });

  it("does not add empty todo", () => {
    render(<TodoForm />);
    const input = screen.getByRole("textbox", { name: /new todo title/i }) as HTMLInputElement;
    const button = screen.getByRole("button", { name: /add todo/i });

    fireEvent.change(input, { target: { value: " " } });
    fireEvent.click(button);

    const todos = useTodoStore.getState().todos;
    expect(todos.length).toBe(0);
  });
});
