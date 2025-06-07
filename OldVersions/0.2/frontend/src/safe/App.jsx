//Para crear la app de React: ejecutar:
//    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
//    npm start

//Tareas Semana
//1. Que al hacer Reset, se resetee tb el formulario, no solo los pedidos
//2. Saltan errores al filtrar por Status cuando no debería. Además el mensaje de error no se va. 
//3. Meter que si se pulsa en el nombre de una columna, se ordenen los datos por esa columna
//4. El botón de Filtrar funcionaba para todo menos para Productos. 
//5. Que al filtrar por un campo, si un pedido tiene ese campo como nulo, que no aparezca

//Siguientes Tareas:
//1. Ordenar estructura de carpetas
//2. Revisar todos los códigos para borrar partes innecesarias. Esto va a ser tocho, pq va a incluir que no se escriban todos los jsx como una función grande, sino como componentes pequeños,
//para así poder exportar las partes necesarias entre scripts y que esté todo más ordenado
//OBJETIVO ESTA SEMANA
//4. Cambiar el estilo del form de filtros. Los filtros tienen que salir en los propios nombre de columnas, no en un panel aparte.
//5. Crear página de productos
//...
//16. En la pantalla de productos, hacer que cuando se tiene menos de x cantidad salga en rojo
//...
//24.Hacer que se puedan actualizar las variables sin necesidad de un form auxiliar, directamente desde la pantalla de OrdersList
//..
//35.Meter que si se crea un nuevo pedido(cliente) de un producto del que no hay stock, se haga un pedido de reposición de stock
//...
//998.Meter un Chatbot que le pidas extraer un dato y haga el text-to-sql, ejecute la query y analize el output
//999. Meter un botón que te permita mandar un correo generado por IA a un cliente
///1000.Meter un Chatbot que sepa responder preguntas sobre el funcionamiento del propio CRM
//BACKLOG:
//1. Programar bien los filtros, que está feo de cojones y me da TOC(Tú eres gay, hasta que no de un error no lo arreglo)
//2. En la petición de filtros a la API, cuando se quiere más de una opción para una variable, se pasa como p.ej ['In progress,Planned'], así que hay que parsearlo



import CreateButton  from './OrdersUtils/CreateButton';
import Filters from './OrdersUtils/Filters';
import './App.css';



import React, { useState, useEffect } from 'react';


function App() {
  
  const [showOrdersForm, setShowOrdersForm] = useState(false);
 
  const FormButton = () => {
    setShowOrdersForm(!showOrdersForm);
  };

  return (
    <div className="App">
      <button onClick={FormButton}>
        Create Order
      </button>
      {showOrdersForm && <CreateButton />} {/* Render CreateButton if showOrdersForm is true */}
      <Filters  /> 
      {/*<OrdersList />*/}  
    </div>
  );
}

export default App;
