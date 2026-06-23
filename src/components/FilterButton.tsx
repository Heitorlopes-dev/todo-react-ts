import { Button } from '@/components/ui/button';
import type { FilterName } from '@/constants/filters';

type FilterButtonProps = {
  name: FilterName;
  isPressed: boolean;
  setFilter: (name: FilterName) => void;
};

export function FilterButton(props: FilterButtonProps) {
  return (
    <Button
      type="button"
      className={`capitalize flex-1 h-12 text-[1.4rem] transition-all rounded-xl cursor-pointer border ${
        props.isPressed
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-900/20 border-transparent'
          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
      }`}
      aria-pressed={props.isPressed}
      onClick={() => props.setFilter(props.name)}
    >
      <span className="sr-only">Mostrar </span>
      <span>{props.name}</span>
      <span className="sr-only"> tarefas</span>
    </Button>
  );
}
