import React, { useContext, useReducer, useEffect, useRef, useState, createContext } from 'react';
import reducer from "./reducers/reducer"

const HOST_API = "http://localhost:8080/api";
const initialState = {
  todo: { list: [], item: {} }
};
const Store = createContext(initialState)


const Form = () => {
  const formRef = useRef(null);
  const { dispatch, state: { todo } } = useContext(Store);
  const item = todo.item;
  const [state, setState] = useState(item);
  const [error, setError] = useState(null)

  const validForm = () =>{
    let isValid =true;
    setError(null)
    if(state.name.length<3 || state.name.length>40 || state.name===null) {
      setError("Debes ingresar tareas con mas de dos caracteres")
      isValid = false
    }
    return isValid
  }

  const onAdd = (event) => {
    event.preventDefault();

    if (!validForm()){
      return
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
  }

  const onEdit = (event) => {
    event.preventDefault();

    if (!validForm()){
      return
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
  }

  return <form ref={formRef}>
    <div className=" alert-warning" role="alert">
      {
        error && <span>{error}</span>
      }
    </div>
    <div className="input-group mb-3">
    <input
      type="text"
      name="name"
      placeholder="¿Qué piensas hacer hoy?"
      className="form-control" aria-describedby="button-addon1"
      defaultValue={item.name}
      onChange={(event) => {
        setState({ ...state, name: event.target.value })
      }} ></input>
    {item.id && <button onClick={onEdit} className="btn btn-outline-secondary" type="button" id="button-addon1">Actualizar</button>}
    {!item.id && <button onClick={onAdd} className="btn btn-outline-secondary" type="button" id="button-addon1">Crear</button>}
    </div>
    </form>
}


const List = () => {
  const { dispatch, state: { todo } } = useContext(Store);
  const currentList = todo.list;

  useEffect(() => {
    fetch(HOST_API + "/todos")
      .then(response => response.json())
      .then((list) => {
        dispatch({ type: "update-list", list })
      })
  }, [dispatch]);


  const onDelete = (id) => {
    fetch(HOST_API + "/" + id + "/todo", {
      method: "DELETE"
    }).then((list) => {
      dispatch({ type: "delete-item", id })
    })
  };

  const onEdit = (todo) => {
    dispatch({ type: "edit-item", item: todo })
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
          </tr>
        })}
      </tbody>
    </table>
  </div>
}

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <Store.Provider value={{ state, dispatch }}>
    {children}
  </Store.Provider>
}

function App() {
  return <StoreProvider>
  <div className="container">
    <div className="jumbotron bg-success">
      <h1 className="display-3 text-center">Lista de tareas</h1>
    </div>
    <div className="row"> 
      <div className="col">
        <Form />
        <List />
      </div>
    </div>
  </div>  
  </StoreProvider>
}
export default App;
