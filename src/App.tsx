import { nanoid } from 'nanoid';
import { useState, useEffect, useRef } from 'react';
import { Todo } from './components/Todo';
import { FilterButton } from './components/FilterButton';
import { Form } from './components/Form';



type Task = {
  id: string;
  name: string;
  completed: boolean;
}

const FILTER_MAP = {
  Todas: () => true,
  Ativas: (task: Task) => !task.completed,
  Completadas: (task: Task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP) as Array<keyof typeof FILTER_MAP>;

export function App() {
  
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const savedTasks = localStorage.getItem('todo-react-ts-tasks');
      if (savedTasks) {
        return JSON.parse(savedTasks);
      }
    } catch (error) {
      console.error("Erro ao carregar tarefas do localStorage:", error);
    }
    return [
      { id: nanoid(), name: 'Compreender a estrutura de pastas', completed: true },
      { id: nanoid(), name: 'Instalar dependências em falta', completed: true },
      { id: nanoid(), name: 'Implementar a edição de tarefas', completed: false },
      { id: nanoid(), name: 'Configurar a filtragem de itens', completed: false }
    ];
  });

  const [filter, setFilter] = useState<keyof typeof FILTER_MAP>('Todas');

  const listHeadingRef = useRef<HTMLHeadingElement>(null);
  const prevTaskLength = useRef(tasks.length);

  useEffect(() => {
    localStorage.setItem('todo-react-ts-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (tasks.length - prevTaskLength.current === -1) {
      listHeadingRef.current?.focus();
    }
    prevTaskLength.current = tasks.length;
  }, [tasks.length]);

  function toggleTaskCompleted(id: string) {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (id === task.id) {
          return { ...task, completed: !task.completed };
        }
        return task;
      })
    );
  }

  function deleteTask(id: string) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }

  function editTask(id: string, newName: string) {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (id === task.id) {
          return { ...task, name: newName };
        }
        return task;
      })
    );
  }

  const taskList = tasks.filter(FILTER_MAP[filter]).map((task) => (
    <Todo
      key={task.id}
      name={task.name}
      id={task.id}
      completed={task.completed}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  function addTask(name: string) {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }
    const newTask = { id: nanoid(), name: trimmedName, completed: false };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  }

  const tasksNoun = taskList.length !== 1 ? 'tarefas' : 'tarefa';
  const headingText = `${taskList.length} ${tasksNoun} ${
    filter === 'Completadas' ? 'completadas' : 'restantes'
  }`;

  return (
    <div className="bg-white shadow-[0_2px_4px_0_rgb(0,0,0,0.2),0_2.5rem_5rem_0_rgb(0,0,0,0.1)] my-8 mx-0 p-4 sm:p-16 relative space-y-10">
      <h1 className="block m-0 mb-4 max-w-full text-center mx-auto">Lista de Tarefas</h1>
      <Form addTask={addTask} />
      <div className="flex justify-between gap-x-2 mt-5">
        {filterList}
      </div>
      <h2 id="list-heading" tabIndex={-1} ref={listHeadingRef}>
        {headingText}
      </h2>
      <ul
        role="list"
        className="space-y-10 mt-5"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}


