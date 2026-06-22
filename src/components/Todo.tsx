import { useState, useRef, useEffect } from "react";

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
    <form className="space-y-5 sm:space-y-[1.4rem] w-full" onSubmit={handleSubmit}>
      <div>
        <label className="visually-hidden" htmlFor={props.id}>
          Novo nome para {props.name}
        </label>
        <input
          id={props.id}
          className="border-2 border-[#565656] min-h-[4.4rem] px-3 py-1 w-full focus-visible:shadow-[inset_0_0_0_2px]"
          type="text"
          value={newName}
          onChange={handleChange}
          ref={editFieldRef}
        />
      </div>
      <div className="flex justify-between gap-x-3">
        <button
          type="button"
          className="border-2 border-[#4d4d4d] cursor-pointer px-4 py-3 capitalize flex-1"
          onClick={() => {
            setNewName(props.name);
            setEditing(false);
          }}
        >
          Cancelar
          <span className="visually-hidden">renomear {props.name}</span>
        </button>
        <button
          type="submit"
          className="border-2 border-[#4d4d4d] cursor-pointer px-4 py-3 capitalize flex-1 bg-black text-white"
        >
          Salvar
          <span className="visually-hidden">novo nome para {props.name}</span>
        </button>
      </div>
    </form>
  );

  const viewTemplate = (
    <div className="space-y-5 sm:space-y-[1.4rem] w-full">
      <div className="c-cb">
        <input
          id={props.id}
          type="checkbox"
          defaultChecked={props.completed}
          onChange={() => props.toggleTaskCompleted(props.id)}
        />
        <label className="todo-label" htmlFor={props.id}>
          {props.name}
        </label>
      </div>
      <div className="flex justify-between gap-x-3">
        <button
          type="button"
          className="border-2 border-[#4d4d4d] cursor-pointer px-4 py-3 capitalize flex-1"
          onClick={() => {
            setNewName(props.name);
            setEditing(true);
          }}
          ref={editButtonRef}
        >
          Editar <span className="visually-hidden">{props.name}</span>
        </button>
        <button
          type="button"
          className="border-2 border-[#bd2130] cursor-pointer px-4 py-3 capitalize flex-1 bg-[#ca3c3c] text-white"
          onClick={() => props.deleteTask(props.id)}
        >
          Excluir <span className="visually-hidden">{props.name}</span>
        </button>
      </div>
    </div>
  );

  return <li className="flex flex-row flex-wrap">{isEditing ? editingTemplate : viewTemplate}</li>;
}


