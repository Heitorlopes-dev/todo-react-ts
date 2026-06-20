import { useState } from "react";
type FormProps = {
    addTask: (name: string) => void;
}

export function Form(props: FormProps) {
    const [name, setName] = useState("");

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  setName(event.target.value);
}
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  props.addTask(name);
  setName("");
}


    return (<form onSubmit={handleSubmit}>
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
        onChange = {handleChange}
        />
        <button type="submit" className="btn btn__primary btn__lg">
        Adicionar
        </button>
</form>);
}


