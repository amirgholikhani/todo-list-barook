import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Todo = {
  id: string;
  title: string;
  done: boolean;
};

type State = {
  todos: Todo[];
  add: (title: string) => void;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  edit: (id: string, title: string) => void;
  clearCompleted: () => void;
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export const useTodoStore = create<State>()(
  persist(
    (set) => ({
      todos: [],
      add: (title) =>
        set((s) => ({
          todos: [{ id: uid(), title: title.trim(), done: false }, ...s.todos],
        })),

      toggle: (id) =>
        set((s) => ({
          todos: s.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        })),

      remove: (id) =>
        set((s) => ({ todos: s.todos.filter((t) => t.id !== id) })),

      edit: (id, title) =>
        set((s) => ({
          todos: s.todos.map((t) => (t.id === id ? { ...t, title: title.trim() } : t)),
        })),

      clearCompleted: () =>
        set((s) => ({ todos: s.todos.filter((t) => !t.done) })),
    }),
    { name: "todo-store" }
  )
);
