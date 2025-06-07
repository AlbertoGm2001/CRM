
//Tareas Acabadas Semana 7(24-02/02-03):
//1. Revisar todos los códigos para borrar partes innecesarias. Esto va a ser tocho, pq va a incluir que no se escriban todos los jsx como una función grande, sino como componentes pequeños,
//para así poder exportar las partes necesarias entre scripts y que esté todo más ordenado.DIRÍA QUE SOLO FALTA UNIFICAR LOS SCRIPTS DE UPDATE Y CREATE. 
//2. Estudiar sobre hardware disponible para decidir qué portátil comprar



//Siguientes Tareas:

//OBJETIVO ESTA SEMANA 
//1. Cambiar el estilo del form de filtros. Los filtros tienen que salir en los propios nombre de columnas, no en un panel aparte.
//2. Cambiar todo el estilo de la página para que parezca más pro, y ya poder enseñarlo a la gente.
//3. Crear página de productos.
//...
//16. En la pantalla de productos, hacer que cuando se tiene menos de x cantidad salga en rojo
//17. En la pantalla de pedidos, hacer que cuando se pasa la fecha de entrega de un pedido, salga en rojo
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



import {FullCreateOrder} from './OrdersUtils/UpsertOrder';
import Filtering from './OrdersUtils/FiltersForm';
import './App.css';
import React from 'react';


function App() {
  
  return (
     <div className="App">
      <FullCreateOrder />
      <Filtering  /> 
    </div>
  );
}

export default App;
