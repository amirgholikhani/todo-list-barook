'use client';

import { useMemo } from "react";
import { useTodoStore } from "@/store/todoStore";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const todos = useTodoStore((state) => state.todos);
  const clearCompleted = useTodoStore((state) => state.clearCompleted);

  const stats = useMemo(() => {
    const total = todos.length;
    const done = todos.filter((todo) => todo.done).length;
    return { total, done, remaining: total - done };
  }, [todos]);

  if (todos.length === 0) {
    return <p className="text-sm text-slate-500">No todos yet. Add your first task above.</p>;
  }

  return (
    <section className="space-y-3">
      <ul className="space-y-2">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          {stats.done}/{stats.total} done — {stats.remaining} left
        </span>
        <button disabled={stats.done === 0} className="underline hover:no-underline cursor-pointer" onClick={clearCompleted}>
          Clear completed
        </button>
      </div>
    </section>
  );
}
