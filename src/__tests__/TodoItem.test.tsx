import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, beforeEach, expect } from "vitest";
import { act } from "react";
import { useTodoStore } from "@/store/todoStore";
import TodoItem from "@/components/TodoItem";

beforeEach(() => {
  act(() => {
    useTodoStore.setState({ todos: [] });
    useTodoStore.getState().add("Sample Task");
  });
});

describe("TodoItem", () => {
  it("renders todo title and checkbox correctly", () => {
    const todo = useTodoStore.getState().todos[0];
    render(<TodoItem todo={todo} />);

    expect(screen.getByText("Sample Task")).toBeInTheDocument();
    const checkbox = screen.getByRole("checkbox", { name: /toggle sample task/i });
    expect(checkbox).not.toBeChecked();
  });

  it("toggles todo done state", () => {
    const todo = useTodoStore.getState().todos[0];
    render(<TodoItem todo={todo} />);

    const checkbox = screen.getByRole("checkbox", { name: /toggle sample task/i });
    act(() => fireEvent.click(checkbox));

    const updatedTodo = useTodoStore.getState().todos.find(t => t.id === todo.id);
    expect(updatedTodo?.done).toBe(true);
  });

  it("edits the todo title (store test)", () => {
    const todo = useTodoStore.getState().todos[0];
    render(<TodoItem todo={todo} />);

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Updated Task" } });
    fireEvent.keyDown(input, { key: "Enter" });

    // ✅ Assert store updated
    const updatedTodo = useTodoStore.getState().todos.find(t => t.id === todo.id);
    expect(updatedTodo?.title).toBe("Updated Task");
  });

  it("deletes the todo (store test)", () => {
    const todo = useTodoStore.getState().todos[0];
    render(<TodoItem todo={todo} />);

    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteBtn);

    // ✅ Assert store updated
    const deletedTodo = useTodoStore.getState().todos.find(t => t.id === todo.id);
    expect(deletedTodo).toBeUndefined();
  });
});
