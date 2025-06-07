//Para crear la app de React: ejecutar:   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

//Siguientes Tareas:

//1. Que los formularios de actualización y creación salgan en otra ventana
//2. Meter botones de filtro de pedidos
//3. En el formulario de Update, meter un botón de Cancelar.
//...
//35.Meter que si se crea un nuevo pedido(cliente) de un producto del que no hay stock, se haga un pedido de reposición de stock
//...
//998.Meter un Chatbot que le pidas extraer un dato y haga el text-to-sql, ejecute la query y analize el output
//999. Meter un botón que te permita mandar un correo generado por IA a un cliente
///1000.Meter un chatbot que sepa responder preguntas sobre el funcionamiento del propio CRM




import React, { useState } from 'react';
import OrdersList from './OrdersList';
import CreateButton from './CreateButton';
import './App.css';

function App() {
  const [showOrdersForm, setShowOrdersForm] = useState(false);

  const FormButton = () => {
    setShowOrdersForm(!showOrdersForm);
  };

  return (
    <div className="App">
      <button onClick={FormButton}>
        {showOrdersForm ? "Close Create Form" : "Create Order"}
      </button>
      {showOrdersForm && <CreateButton />}
      <OrdersList />
    </div>
  );
}

export default App;