import { useState } from "react";
import React from "react";
import { api } from "../../utils/api";

import { todoInput } from "../../types";
import toast from "react-hot-toast";

const CreateTodo = () => {
  const trpc = api.useContext();
  const createTodoMutation = api.todo.create.useMutation({
    onSuccess:async()=>{
      toast.success("The todo is added!")
    },
    onSettled: async () => {
      await trpc.todo.all.invalidate();
    },
  });
  const [todo, setTodo] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setTodo(e.target.value);
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const result = todoInput.safeParse(todo);
          if (!result.success) {
            toast.error(result.error.format()._errors.join("\n"));
            return;
          } else {
            createTodoMutation.mutate(todo);
            setTodo("");
          }
        }}
        className="flex flex-row gap-1"
      >
        <input
          value={todo}
          type="text"
          onChange={handleChange}
          placeholder="Enter todo"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
        />
        <button
          type="submit"
          className="rounded-lg bg-red-500 px-4 font-bold text-white hover:bg-red-700"
        >
          Add
        </button>
      </form>
    </>
  );
};

export default CreateTodo;
