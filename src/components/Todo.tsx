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
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="todo-label" htmlFor={props.id}>
          Novo nome para {props.name}
        </label>
        <input
          id={props.id}
          className="todo-text"
          type="text"
          value={newName}
          onChange={handleChange}
          ref={editFieldRef}
        />
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn todo-cancel"
          onClick={() => {
            setNewName(props.name);
            setEditing(false);
          }}
        >
          Cancelar
          <span className="visually-hidden">renomear {props.name}</span>
        </button>
        <button type="submit" className="btn btn__primary todo-edit">
          Salvar
          <span className="visually-hidden">novo nome para {props.name}</span>
        </button>
      </div>
    </form>
  );

  const viewTemplate = (
    <div className="stack-small">
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
      <div className="btn-group">
        <button
          type="button"
          className="btn"
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
          className="btn btn__danger"
          onClick={() => props.deleteTask(props.id)}
        >
          Excluir <span className="visually-hidden">{props.name}</span>
        </button>
      </div>
    </div>
  );

  return <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>;
}


