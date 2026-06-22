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
      <h2 className="flex-[0_0_100%] m-0 text-center">
        <label
          htmlFor="new-todo-input"
          className="leading-[1.01567] font-light mb-4 p-3 text-center text-[1.9rem] sm:text-[2.4rem] inline-block w-full"
        >
          Quais as tarefas atuais?
        </label>
      </h2>
      <input
        type="text"
        id="new-todo-input"
        className="border-2 border-black p-8 text-[1.9rem] sm:text-[2.4rem] inline-block w-full mb-4 focus-visible:border-[#4d4d4d] focus-visible:shadow-[inset_0_0_0_2px]"
        name="text"
        autoComplete="off"
        value={name}
        onChange={handleChange}
      />
      {error && (
        <div className="text-[#ca3c3c] text-[1.4rem] mt-2 mb-5 text-center font-bold">
          {error}
        </div>
      )}
      <button
        type="submit"
        className="border-2 border-[#4d4d4d] cursor-pointer px-4 py-3 capitalize bg-black text-white text-[1.9rem] sm:text-[2.4rem] inline-block w-full"
      >
        Adicionar
      </button>
    </form>
  );
}


