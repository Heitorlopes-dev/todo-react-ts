type FilterButtonProps = {
    name: string;
};

export function FilterButton(props: FilterButtonProps) {
    return (
        <div className="filters btn-group stack-exception">
        <button type="button" className="btn toggle-btn" aria-pressed="false">
          <span className="visually-hidden">Mostrar </span>
          <span>{props.name}</span>
          <span className="visually-hidden"> tarefas</span>
        </button>
      </div>
    );
}
