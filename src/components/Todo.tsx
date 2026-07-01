import { useState, useRef, useEffect, useCallback, memo } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

declare global {
  interface Document {
    startViewTransition?: (callback: () => void) => { finished: Promise<void> };
  }
}

type TodoProps = {
  id: string;
  name: string;
  completed: boolean;
  toggleTaskCompleted: (id: string) => void;
  deleteTask: (id: string) => void;
  editTask: (id: string, newName: string) => void;
};

export const Todo = memo(function Todo(props: TodoProps) {
  const { id, name, completed, toggleTaskCompleted, deleteTask, editTask } = props;
  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');

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

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!newName.trim()) return;
      editTask(id, newName);
      setEditing(false);
    },
    [newName, editTask, id],
  );

  const handleStartEdit = useCallback(() => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setNewName(name);
        setEditing(true);
      });
    } else {
      setNewName(name);
      setEditing(true);
    }
  }, [name]);

  const handleCancelEdit = useCallback(() => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setNewName(name);
        setEditing(false);
      });
    } else {
      setNewName(name);
      setEditing(false);
    }
  }, [name]);

  const handleToggle = useCallback(() => {
    toggleTaskCompleted(id);
  }, [toggleTaskCompleted, id]);

  const handleDelete = useCallback(() => {
    deleteTask(id);
  }, [deleteTask, id]);

  const editingTemplate = (
    <form className="space-y-4 w-full" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-[1.4rem] font-bold text-white/80" htmlFor={id}>
          Novo nome para <span className="italic font-normal text-white/60">"{name}"</span>
        </label>
        <Input
          id={id}
          className="bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-emerald-500 focus:ring-emerald-500/20 focus-visible:ring-emerald-500/20 h-12 text-[1.4rem] w-full rounded-xl"
          type="text"
          value={newName}
          onChange={handleChange}
          ref={editFieldRef}
          maxLength={500}
        />
      </div>
      <div className="flex justify-between gap-x-3">
        <Button
          type="button"
          className="flex-1 h-12 text-[1.3rem] bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white rounded-xl transition-all cursor-pointer"
          onClick={handleCancelEdit}
        >
          Cancelar
          <span className="sr-only">renomear {name}</span>
        </Button>
        <Button
          type="submit"
          className="flex-1 h-12 text-[1.3rem] bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-900/30 cursor-pointer"
        >
          Salvar
          <span className="sr-only">novo nome para {name}</span>
        </Button>
      </div>
    </form>
  );

  const viewTemplate = (
    <div className="space-y-4 w-full">
      <div className="c-cb flex items-center">
        <input
          id={id}
          type="checkbox"
          checked={completed}
          onChange={handleToggle}
        />
        <label
          className={`todo-label text-[1.6rem] font-medium transition-all ${
            completed ? 'line-through text-white/30' : 'text-white/90'
          }`}
          htmlFor={id}
        >
          {name}
        </label>
      </div>
      <div className="flex justify-between gap-x-3">
        <Button
          type="button"
          className="flex-1 h-12 text-[1.3rem] bg-white/5 border border-white/10 text-emerald-400 hover:bg-white/10 hover:text-emerald-300 rounded-xl transition-all cursor-pointer"
          onClick={handleStartEdit}
          ref={editButtonRef}
        >
          Editar <span className="sr-only">{name}</span>
        </Button>
        <Button
          type="button"
          className="flex-1 h-12 text-[1.3rem] bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/20 rounded-xl transition-all cursor-pointer"
          onClick={handleDelete}
        >
          Excluir <span className="sr-only">{name}</span>
        </Button>
      </div>
    </div>
  );

  return (
    <li className="p-6 bg-white/2 hover:bg-white/4 border border-white/5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col gap-4 w-full animate-in fade-in">
      {isEditing ? editingTemplate : viewTemplate}
    </li>
  );
});
