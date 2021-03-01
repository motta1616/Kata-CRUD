import React, { createContext } from 'react';
import { Form } from './Form';
import { List } from './List';
import { StoreProvider } from './StoreProvider';

export const HOST_API = "http://localhost:8080/api";
export const initialState = {
  todo: { list: [], item: {} }
};
export const Store = createContext(initialState)

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
