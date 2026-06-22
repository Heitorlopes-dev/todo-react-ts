import { useState } from "react";

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
    <form onSubmit={handleSubmit}>
      <h2 className="label-wrapper">
        <label htmlFor="new-todo-input" className="label__lg">
          Quais as tarefas atuais?
        </label>
      </h2>
      <input
        type="text"
        id="new-todo-input"
        className="input input__lg"
        name="text"
        autoComplete="off"
        value={name}
        onChange={handleChange}
      />
      {error && (
        <div
          className="error-message"
          
        >
          {error}
        </div>
      )}
      <button type="submit" className="btn btn__primary btn__lg">
        Adicionar
      </button>
    </form>
  );
}



