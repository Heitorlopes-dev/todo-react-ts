import { Button } from "@/components/ui/button";

type Filter = "Todas" | "Ativas" | "Completadas";

type FilterButtonProps = {
  name: Filter;
  isPressed: boolean;
  setFilter: (name: Filter) => void;
};

export function FilterButton(props: FilterButtonProps) {
  return (
    <Button
      type="button"
      variant={props.isPressed ? "default" : "outline"}
      className={`capitalize flex-1 h-10 text-[1.3rem] transition-all cursor-pointer ${
        props.isPressed
          ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
          : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
      aria-pressed={props.isPressed}
      onClick={() => props.setFilter(props.name)}
    >
      <span className="visually-hidden">Mostrar </span>
      <span>{props.name}</span>
      <span className="visually-hidden"> tarefas</span>
    </Button>
  );
}
