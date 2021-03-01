import React, { useContext, useEffect } from 'react';
import { Store, HOST_API } from './App';

export const List = () => {
  const { dispatch, state: { todo } } = useContext(Store);
  const currentList = todo.list;

  useEffect(() => {
    fetch(HOST_API + "/todos")
      .then(response => response.json())
      .then((list) => {
        dispatch({ type: "update-list", list });
      });
  }, [dispatch]);


  const onDelete = (id) => {
    fetch(HOST_API + "/" + id + "/todo", {
      method: "DELETE"
    }).then((list) => {
      dispatch({ type: "delete-item", id });
    });
  };

  const onEdit = (todo) => {
    dispatch({ type: "edit-item", item: todo });
  };

  const onChange = (event, todo) => {
    const request = {
      name: todo.name,
      id: todo.id,
      completed: event.target.checked
    };
    fetch(HOST_API + "/todo", {
      method: "PUT",
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((todo) => {
        dispatch({ type: "update-item", item: todo });
      });
  };

  const decorationDone = {
    textDecoration: 'line-through'
  };
  return <div>
    <table className="table">
      <thead>
        <tr>
          <th scope="col" className="text-center">ID</th>
          <th scope="col" className="text-center">Tarea</th>
          <th scope="col" className="text-center">¿Completado?</th>
          <th scope="col" className="text-center">Acción</th>
        </tr>
      </thead>
      <tbody className="table-info">
        {currentList.map((todo) => {
          return <tr key={todo.id} style={todo.completed ? decorationDone : {}}>
            <td className="text-center">{todo.id}</td>
            <td className="text-center">{todo.name}</td>

            <td className="text-center"><input type="checkbox" defaultChecked={todo.completed} onChange={(event) => onChange(event, todo)}></input></td>

            <td className="text-center"><button onClick={() => onDelete(todo.id)} type="button" className="btn btn-primary col-4 mx-auto">Eliminar</button>
              <button onClick={() => onEdit(todo)} type="button" className="btn btn-danger col-4 mx-auto">Editar</button></td>
          </tr>;
        })}
      </tbody>
    </table>
  </div>;
};
