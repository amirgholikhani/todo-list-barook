import { describe, it, beforeEach, expect, vi } from "vitest";
import { useTodoStore } from "@/store/todoStore";

beforeEach(() => {
  // clear localStorage to reset persisted state
  localStorage.clear();
  // reset the store state
  useTodoStore.setState({ todos: [] });
});

describe("Todo Store", () => {
  it("adds a new todo", () => {
    const { add, todos } = useTodoStore.getState();
    add("Test Task");

    const state = useTodoStore.getState();
    expect(state.todos.length).toBe(1);
    expect(state.todos[0].title).toBe("Test Task");
    expect(state.todos[0].done).toBe(false);
  });

  it("toggles a todo done state", () => {
    const { add, toggle } = useTodoStore.getState();
    add("Task 1");

    const todo = useTodoStore.getState().todos[0];
    toggle(todo.id);

    const updated = useTodoStore.getState().todos[0];
    expect(updated.done).toBe(true);

    toggle(todo.id);
    expect(useTodoStore.getState().todos[0].done).toBe(false);
  });

  it("edits a todo title", () => {
    const { add, edit } = useTodoStore.getState();
    add("Old Title");

    const todo = useTodoStore.getState().todos[0];
    edit(todo.id, "New Title");

    expect(useTodoStore.getState().todos[0].title).toBe("New Title");
  });

  it("removes a todo", () => {
    const { add, remove } = useTodoStore.getState();
    add("Task to remove");

    const todo = useTodoStore.getState().todos[0];
    remove(todo.id);

    expect(useTodoStore.getState().todos.length).toBe(0);
  });

  it("clears completed todos", () => {
    const { add, toggle, clearCompleted } = useTodoStore.getState();
    add("Task 1");
    add("Task 2");

    const todos = useTodoStore.getState().todos;

    // toggle the first added todo (Task 1 is now at index 1 because of prepending)
    toggle(todos[1].id); // mark Task 1 done

    clearCompleted();

    const state = useTodoStore.getState().todos;
    expect(state.length).toBe(1);
    expect(state[0].title).toBe("Task 2"); // Task 2 should remain
  });
});
