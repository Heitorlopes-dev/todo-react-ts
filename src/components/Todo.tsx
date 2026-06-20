type TodoProps = {
    id: string;
    name: string;
    completed: boolean;
    toggleTaskCompleted: (id: string) => void;
    deleteTask: (id: string) => void;
}

export function Todo (props: TodoProps) {
    return (
      // checkbox e label para o nome da tarefa
    <li className="todo stack-small">
          <div className="c-cb">
            <input id={props.id} 
            type="checkbox" 
            defaultChecked={props.completed} 
            onChange={() => props.toggleTaskCompleted(props.id)}/>
            {/* label para o nome da tarefa */}
            <label className="todo-label" htmlFor={props.id}>
              {props.name}
            </label>
          </div>
{/* botões de edição e exclusão */}
          <div className="btn-group">
            <button type="button" className="btn">
              Editar <span className="visually-hidden">{props.name}</span>
            </button>
            {/* botão de exclusão */}
            <button type="button" 
            className="btn btn__danger" 
            onClick={() => props.deleteTask(props.id)}>
            Excluir <span className="visually-hidden">{props.name}</span>
            </button>
          </div>
        </li>
    );
}

