'use client';

import { useState } from "react";
import { Todo, useTodoStore } from "@/store/todoStore";

export default function TodoItem({ todo }: { todo: Todo }) {
  const toggle = useTodoStore((state) => state.toggle);
  const remove = useTodoStore((state) => state.remove);
  const edit = useTodoStore((state) => state.edit);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [draft, setDraft] = useState<string>(todo.title);

  const onSave = () => {
    const newTitle = draft.trim();
    if (newTitle && newTitle !== todo.title) edit(todo.id, newTitle);
    setIsEditing(false);
  };

  return (
    <li className="group flex items-center gap-3 rounded-xl border px-3 py-2">
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => toggle(todo.id)}
        aria-label={`Toggle ${todo.title}`}
      />
      {isEditing ? (
        <input
          className="min-w-0 flex-1 rounded-lg border px-2 py-1 outline-none focus:ring"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSave()}
          autoFocus
        />
      ) : (
        <span className={"flex-1 break-words " + (todo.done ? "line-through opacity-60" : "")}>
          {todo.title}
        </span>
      )}
      {isEditing ? (
        <button className="text-sm underline cursor-pointer" onClick={onSave} aria-label="Save">
          Save
        </button>
      ) : (
        <button className="text-sm underline cursor-pointer" onClick={() => setIsEditing(true)} aria-label="Edit">
          Edit
        </button>
      )}
      <button className="text-sm text-rose-600 underline cursor-pointer" onClick={() => remove(todo.id)} aria-label="Delete">
        Delete
      </button>
    </li>
  );
}
