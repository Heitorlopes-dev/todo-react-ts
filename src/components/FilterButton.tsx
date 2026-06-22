type Filter = "Todas" | "Ativas" | "Completadas";

type FilterButtonProps = {
  name: Filter;
  isPressed: boolean;
  setFilter: (name: Filter) => void;
};

export function FilterButton(props: FilterButtonProps) {
  return (
    <button
      type="button"
      className="btn toggle-btn"
      aria-pressed={props.isPressed}
      onClick={() => props.setFilter(props.name)}
    >
      <span className="visually-hidden">Mostrar </span>
      <span>{props.name}</span>
      <span className="visually-hidden"> tarefas</span>
    </button>
  );
}

