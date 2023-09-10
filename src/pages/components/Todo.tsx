import toast from "react-hot-toast";
import type { Todo } from "../../types";
import {api} from '../../utils/api'

type TodoProps = {
  todo: Todo;
};

const Todo = ({ todo }: TodoProps) => {
  const { id, text, done } = todo;
  const trpc=api.useContext();
  const checkBox = api.todo.toggle.useMutation({

    onSettled: async()=>{
      trpc.todo.all.invalidate();
    }
  });

  const deleteTodo = api.todo.delete.useMutation({
    onSettled: async()=>{
      await trpc.todo.all.invalidate();
    }
  });

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="done"
            id="done"
            checked={done}
            onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
              checkBox.mutate({id,done : e.target.checked});
              console.log(todo.done);
            }}

            className="h-4 w-4 cursor-pointer rounded border border-gray-300 bg-gray-50"
          />
          <label htmlFor="done" className={`${done ? "line-through red text-white" : "text-white"}`}>
            {text}
          </label>
          <button onClick={()=>{
            deleteTodo.mutate(id);
          }} className="rounded bg-red-500 px-4 font-bold text-white hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default Todo;
