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
      className={`border cursor-pointer px-4 py-3 capitalize flex-1 transition-colors ${
        props.isPressed
          ? "border-[#4d4d4d] underline"
          : "border-gray-300"
      }`}
      aria-pressed={props.isPressed}
      onClick={() => props.setFilter(props.name)}
    >
      <span className="visually-hidden">Mostrar </span>
      <span>{props.name}</span>
      <span className="visually-hidden"> tarefas</span>
    </button>
  );
}

