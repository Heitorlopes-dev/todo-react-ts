import { nanoid } from 'nanoid'
import { useState } from 'react'
import { Todo } from './components/Todo'
import { FilterButton } from './components/FilterButton'
import { Form } from './components/Form'

type Task = {
  id: string;
  name: string;
  completed: boolean;
}

type AppProps = {
  tasks: Task[];
}

export function App(props: AppProps) {
  const [tasks, setTasks] = useState(props.tasks);

  function toggleTaskCompleted(id: string) {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function deleteTask(id: string) {
    const remainingTasks = tasks.filter((task) => task.id !== id);
    setTasks(remainingTasks);
  }

  const taskList = tasks.map((task) => (
    <Todo
      key={task.id}
      name={task.name}
      id={task.id}
      completed={task.completed}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
    />
  ));

  function addTask(name: string) {
    const newTask = { id: `todo-${nanoid()}`, name, completed: false };
    setTasks([...tasks, newTask]);
  }

  const tasksNoun = taskList.length !== 1 ? 'tarefas' : 'tarefa';
  const headingText = `${taskList.length} ${tasksNoun} faltando`;

  return (
    <div className="todoapp stack-large">
      <h1>Lista de Tarefas</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
        <FilterButton name="Todas" />
        <FilterButton name="Ativas" />
        <FilterButton name="Completadas" />
      </div>
      <h2 id="list-heading">{headingText}</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}
