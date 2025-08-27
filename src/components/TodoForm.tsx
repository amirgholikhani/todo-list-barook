'use client';

import { FormEvent, useState } from "react";
import { useTodoStore } from "@/store/todoStore";

export default function TodoForm() {
  const add = useTodoStore((state) => state.add);
  const [title, setTitle] = useState<string>("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const todoTitle = title.trim();
    if (!todoTitle) return;
    add(todoTitle);
    setTitle("");
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        className="min-w-0 flex-1 rounded-xl border px-3 py-2 outline-none focus:ring"
        placeholder="Add a task…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="New todo title"
      />
      <button
        type="submit"
        className="rounded-xl border bg-black px-4 py-2 text-white hover:opacity-90 cursor-pointer"
        aria-label="Add todo"
      >
        Add
      </button>
    </form>
  );
}
