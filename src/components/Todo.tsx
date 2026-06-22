import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TodoProps = {
  id: string;
  name: string;
  completed: boolean;
  toggleTaskCompleted: (id: string) => void;
  deleteTask: (id: string) => void;
  editTask: (id: string, newName: string) => void;
};

export function Todo(props: TodoProps) {
  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState(props.name);

  const editButtonRef = useRef<HTMLButtonElement>(null);
  const editFieldRef = useRef<HTMLInputElement>(null);
  const wasEditing = useRef(isEditing);

  useEffect(() => {
    if (!wasEditing.current && isEditing) {
      editFieldRef.current?.focus();
    } else if (wasEditing.current && !isEditing) {
      editButtonRef.current?.focus();
    }
    wasEditing.current = isEditing;
  }, [isEditing]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewName(event.target.value);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newName.trim()) {
      return;
    }
    props.editTask(props.id, newName);
    setEditing(false);
  }

  const editingTemplate = (
    <form className="space-y-4 w-full" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-[1.4rem] font-semibold text-slate-700 dark:text-slate-300" htmlFor={props.id}>
          Novo nome para <span className="italic font-normal">"{props.name}"</span>
        </label>
        <Input
          id={props.id}
          className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 h-11 text-[1.4rem] w-full focus-visible:ring-indigo-500"
          type="text"
          value={newName}
          onChange={handleChange}
          ref={editFieldRef}
        />
      </div>
      <div className="flex justify-between gap-x-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1 h-10 text-[1.3rem] cursor-pointer"
          onClick={() => {
            setNewName(props.name);
            setEditing(false);
          }}
        >
          Cancelar
          <span className="visually-hidden">renomear {props.name}</span>
        </Button>
        <Button
          type="submit"
          className="flex-1 h-10 text-[1.3rem] bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
        >
          Salvar
          <span className="visually-hidden">novo nome para {props.name}</span>
        </Button>
      </div>
    </form>
  );

  const viewTemplate = (
    <div className="space-y-4 w-full">
      <div className="c-cb flex items-center">
        <input
          id={props.id}
          type="checkbox"
          defaultChecked={props.completed}
          onChange={() => props.toggleTaskCompleted(props.id)}
        />
        <label
          className={`todo-label text-[1.6rem] font-medium transition-all ${
            props.completed ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-800 dark:text-slate-200"
          }`}
          htmlFor={props.id}
        >
          {props.name}
        </label>
      </div>
      <div className="flex justify-between gap-x-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1 h-10 text-[1.3rem] border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
          onClick={() => {
            setNewName(props.name);
            setEditing(true);
          }}
          ref={editButtonRef}
        >
          Editar <span className="visually-hidden">{props.name}</span>
        </Button>
        <Button
          type="button"
          variant="destructive"
          className="flex-1 h-10 text-[1.3rem] bg-[#ca3c3c] hover:bg-[#b03030] text-white cursor-pointer"
          onClick={() => props.deleteTask(props.id)}
        >
          Excluir <span className="visually-hidden">{props.name}</span>
        </Button>
      </div>
    </div>
  );

  return (
    <li className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-4 w-full animate-in fade-in duration-300">
      {isEditing ? editingTemplate : viewTemplate}
    </li>
  );
}
