import React from 'react'
import { api } from '~/utils/api'

import Todo from '../components/Todo'
const Todos = () => {
  const {data:todos, isLoading,isError} = api.todo.all.useQuery();

  if (isLoading) {
    return <p>Loading...</p>
  }
  if (isError) {
    return <p>Error</p>
  }
  return (
    <>
    {todos.length ? todos.map(todo=>{
      return <Todo key={todo.id} todo={todo}/>
    }):<p className='text-red-500 font-bold'>Please add the todos</p>}   
    </>
  )
}

export default Todos
