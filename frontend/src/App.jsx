//Tareas Acabadas Semana 8(03-03-04):
//La 1ª parte de la semana va a ir dedicada a que los filtros sean más visibles, y que se puedan aplicar sobre la propia columna.
//1. Hacer que las opciones de los desplegables salgan más visibles
//2. Arreglar el modal de cantidad que salía mal y arreglado filtro de order_number que no funcionaba
//3. Arreglados filtros de fecha


//Siguientes Tareas:
//0. Setup Nuevo Portátil
//1. Al abrir un modal, y antes de cerrarlo, meterme en CreateOrder, el modal no se cierra
//2. Hacer que un click en cualquier sitio de la página cierre el popup de filtros
//3. En los modales de filtros, hacer que los filtros no se apliquen hasta que se pulse el botón de aplicar, y quitar el botón de clear(para eso está Reset Filters)
//4. Hacer que un cancel en update o create no actualice la página, solo que cierre el modal
//5. Organizar todo el script de ShowOrders en distintos scripts
//6. Cambiar todo el estilo de la página para que parezca más pro, y ya poder enseñarlo a la gente.
//7. Crear página de productos.
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
//1. Repasarme todo el código de App.css y borrar lo que no sea necesario
//2. En la petición de filtros a la API, cuando se quiere más de una opción para una variable, se pasa como p.ej ['In progress,Planned'], así que hay que parsearlo
// 


import { CreateButton } from './OrdersUtils/UpsertOrder';
import ShowOrders from './OrdersUtils/ShowOrders';
import './App.css';
import React, { useState, useEffect } from 'react';
import { fetchOrders } from './OrdersUtils/Params';



//A LO MEJOR NO HACÍA FALTA NI HACER EL FETCHORDERS, Y SE PODÍA PASAR SIEMPRE COMO ORDERS LA RESPUESTA DE LA API
function App() {
  const [error, setError] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [resetFilters, setResetFilters] = useState(false);


  
    useEffect(() => {
      fetchOrders(setFilteredOrders, setError);
    }, [resetFilters]);  

  return (
    <div className="App">
      {error && <div className="error-message">{error}</div>}
      
      <div className="main-layout">
        <div className="button-container">
          <CreateButton />
          <button 
            className="reset-filters-button"
            onClick={() => setResetFilters(!resetFilters)}
          >
            Reset Filters
          </button>
        </div>
        
        <div className="content-container">
          <ShowOrders Orders={filteredOrders} ResetFilters={resetFilters} />
        </div>
      </div>
    </div>
  );
}

export default App;
