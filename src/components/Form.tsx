import * as React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FormProps = {
  addTask: (name: string) => void;
}

export function Form(props: FormProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
    if (error && event.target.value.trim()) {
      setError(null);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("O nome da tarefa não pode estar vazio.");
      return;
    }
    props.addTask(trimmedName);
    setName("");
    setError(null);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="new-todo-input"
          className="text-[1.6rem] font-semibold text-slate-700 dark:text-slate-300"
        >
          O que precisa ser feito?
        </label>
        <div className="flex gap-2">
          <Input
            type="text"
            id="new-todo-input"
            className="flex-1 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 h-12 text-[1.4rem] focus-visible:ring-indigo-500"
            name="text"
            autoComplete="off"
            value={name}
            onChange={handleChange}
            placeholder="Adicione uma nova tarefa..."
          />
          <Button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 h-12 text-[1.4rem] transition-colors shadow-sm cursor-pointer"
          >
            Adicionar
          </Button>
        </div>
      </div>
      {error && (
        <div className="text-red-500 text-[1.2rem] font-semibold animate-in fade-in duration-200">
          {error}
        </div>
      )}
    </form>
  );
}
