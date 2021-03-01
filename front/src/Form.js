import React, { useContext, useRef, useState } from 'react';
import { Store, HOST_API } from './App';

export const Form = () => {
  const formRef = useRef(null);
  const { dispatch, state: { todo } } = useContext(Store);
  const item = todo.item;
  const [state, setState] = useState(item);
  const [error, setError] = useState(null);

  const validForm = () => {
    let isValid = true;
    setError(null);
    if (state.name.length < 3 || state.name.length > 40 || state.name === null) {
      setError("Debes ingresar tareas con mas de dos caracteres");
      isValid = false;
    }
    return isValid;
  };

  const onAdd = (event) => {
    event.preventDefault();

    if (!validForm()) {
      return;
    };

    const request = {
      name: state.name,
      id: null,
      completed: false
    };

    fetch(HOST_API + "/todo", {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((todo) => {
        dispatch({ type: "add-item", item: todo });
        setState({ name: "" });
        formRef.current.reset();
      });
  };

  const onEdit = (event) => {
    event.preventDefault();

    if (!validForm()) {
      return;
    };

    const request = {
      name: state.name,
      id: item.id,
      isCompleted: item.isCompleted
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
        setState({ name: "" });
        formRef.current.reset();
      });
  };

  return <form ref={formRef}>
    <div className=" alert-warning" role="alert">
      {error && <span>{error}</span>}
    </div>
    <div className="input-group mb-3">
      <input
        type="text"
        name="name"
        placeholder="¿Qué piensas hacer hoy?"
        className="form-control" aria-describedby="button-addon1"
        defaultValue={item.name}
        onChange={(event) => {
          setState({ ...state, name: event.target.value });
        }}></input>
      {item.id && <button onClick={onEdit} className="btn btn-outline-secondary" type="button" id="button-addon1">Actualizar</button>}
      {!item.id && <button onClick={onAdd} className="btn btn-outline-secondary" type="button" id="button-addon1">Crear</button>}
    </div>
  </form>;
};
