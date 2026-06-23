import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type FormProps = {
  addTask: (name: string) => void;
};

export function Form(props: FormProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
    if (error && event.target.value.trim()) {
      setError(null);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('O nome da tarefa não pode estar vazio.');
      return;
    }
    props.addTask(trimmedName);
    setName('');
    setError(null);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="new-todo-input"
          className="text-[1.6rem] font-bold text-white/80"
        >
          O que precisa ser feito?
        </label>
        <div className="flex gap-2">
          <Input
            type="text"
            id="new-todo-input"
            className="flex-1 bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-emerald-500 focus:ring-emerald-500/20 focus-visible:ring-emerald-500/20 h-12 text-[1.5rem] rounded-xl"
            name="text"
            autoComplete="off"
            value={name}
            onChange={handleChange}
            placeholder="Adicione uma nova tarefa..."
            maxLength={500}
          />
          <Button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold px-6 h-12 text-[1.4rem] rounded-xl transition-all duration-200 shadow-md shadow-emerald-900/30 cursor-pointer"
          >
            Adicionar
          </Button>
        </div>
      </div>
      {error && (
        <div className="text-red-400 text-[1.2rem] font-semibold animate-in fade-in duration-200">
          {error}
        </div>
      )}
    </form>
  );
}
