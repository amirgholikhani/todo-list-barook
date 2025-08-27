import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, beforeEach, expect } from "vitest";
import { act } from "react";
import { useTodoStore } from "@/store/todoStore";
import TodoList from "@/components/TodoList";

// helper to reset store before each test
beforeEach(() => {
  act(() => {
    useTodoStore.setState({ todos: [] });
  });
});

describe("TodoList", () => {
  it("renders empty state when no todos", () => {
    render(<TodoList />);
    expect(
      screen.getByText(/No todos yet\. Add your first task above\./i)
    ).toBeInTheDocument();
  });

  it("renders todos and stats correctly", () => {
    act(() => {
      useTodoStore.getState().add("Learn Vitest");
      useTodoStore.getState().add("Learn RTL");
    });

    render(<TodoList />);
    // two items rendered
    expect(screen.getByText("Learn Vitest")).toBeInTheDocument();
    expect(screen.getByText("Learn RTL")).toBeInTheDocument();

    // stats show 0 done / 2 total
    expect(screen.getByText("0/2 done — 2 left")).toBeInTheDocument();
  });

  it("clears completed todos", () => {
    act(() => {
      const { add, toggle } = useTodoStore.getState();
      add("Task A");
      add("Task B");
      const todos = useTodoStore.getState().todos;
      const taskA = todos.find((t) => t.title === "Task A")!;
      toggle(taskA.id); // mark Task A done
    });

    render(<TodoList />);
    // stats before
    expect(screen.getByText("1/2 done — 1 left")).toBeInTheDocument();

    // clear completed
    const btn = screen.getByRole("button", { name: /clear completed/i });
    expect(btn).not.toBeDisabled();
    fireEvent.click(btn);

    // after clearing, only one todo left
    expect(screen.getByText("0/1 done — 1 left")).toBeInTheDocument();
    expect(screen.queryByText("Task A")).not.toBeInTheDocument();
  });
});
