/*
En este script se hace una petición get a la API, con la cual se reciben todos los pedidos de la BBDD
Para ello, se usa la función fetchOrders, y una vez se reciben los datos de la API, se renderiza la app usando useEffect.
Después se muestran estos pedidos como una tabla ,para lo cual debe ser definido un código HTML, que es lo que se pasa a la APP.jsx
*/ 


/*
31/01:Se cambia esta función para que no haga petición a la API de recibir todos los pedidos posibles, sino que recibe como input los pedidos a mostrar
*/ 

import React, { useState, useEffect } from 'react';
import {UpsertForm} from './UpsertOrder';
import '../App.css';
import {DeleteOrder} from './Params'
 





 
const handleSortingClick = (setVisibleOrders,orderingDirection,setOrderingDirection,sortingColumn) => {
  if (orderingDirection===true){
     {
      setVisibleOrders((prevOrders) =>
        [...prevOrders].sort((a, b) =>//prevOrders es detectado automáticaamente como el estado previo de visibleOrders
          typeof a[sortingColumn] === 'string'
            ? b[sortingColumn].localeCompare(a[sortingColumn])
            : a[sortingColumn] - b[sortingColumn]
        )
      );
      }
  }
  else{
    setVisibleOrders((prevOrders) =>
      [...prevOrders].sort((a, b) =>
        typeof a[sortingColumn] === 'string'
          ? a[sortingColumn].localeCompare(b[sortingColumn])
          : b[sortingColumn] - a[sortingColumn]
      )
    );
      }
  

  setOrderingDirection(!orderingDirection)
  };


const ShowOrders=({Orders})=>{//Si el input Orders es un diccionario, se pasa en el input como {Orders} 
  
  const [visibleOrders, setVisibleOrders] = useState([]);
  const [orderingDirection,setOrderingDirection]=useState(true);//Orden descendente o ascendente

  //Funcionalidad de mostrar todos los pedidos. Aquí se muestran los pedidos en función del valor de los filtros
  //Estos dos hooks son necesarios, pq si defines visibleOrders como Orders, como para calcular Orders se hace una petición a la API,que no es inmediata, visibleOrders se queda vacío.
    
    
  useEffect(() => {
    setVisibleOrders(Orders);
  }, [Orders]);



  //Funcionalidad de Actualizar un pedido
  const [updatingOrder, setUpdatingOrder] = useState(null);  
  const handleUpdateClick = (orderNumber) => {
    setUpdatingOrder(orderNumber);
  };
    
    //Funcionalidad de borrar un pedido  
    const [deletingOrder, setDeletingOrder] = useState(null);
    const handleDeleteClick = (order_number) => {
      setDeletingOrder(order_number);
    };

    //Funcionalidad de que las opciones aparezcan comprimidas en un botón
    const [optionsMenu,setOptionsMenu]=useState(null)
    const handleOptionsClick=(order_number)=>{
      setOptionsMenu((optionsMenu) => (optionsMenu === order_number ? null : order_number))}

    
  
  
  
  return  (
    <div>
      <table className='ordersList'>
        <thead>
        <tr>
            {['order_number', 'product', 'quantity', 'customer', 'status', 'date', 'notes'].map((column) => (
              <th key={column} onClick={() => handleSortingClick(setVisibleOrders,orderingDirection,setOrderingDirection,column)}>
                {column.replace('_', ' ')}
              </th>
            ))}
          </tr>
         </thead>
        <tbody>
          {visibleOrders.map((order) => (
            <React.Fragment key={order.order_number}>
              <tr>
                <td>{order.order_number}</td>
                <td>{order.product}</td>
                <td>{order.quantity}</td>
                <td>{order.customer}</td>
                <td>{order.status}</td>
                <td>{order.date}</td>
                <td>{order.notes}</td>
                <td>
                  <div className='action-menu'>
                    <button className='menu-button' onClick={() => handleOptionsClick(order.order_number)}>  &#8230; {/* Icono de puntos suspensivos */}</button>
                    
                    {optionsMenu===order.order_number && (<div className='menu-options simple-menu'>
                      <button onClick={() => handleDeleteClick(order.order_number)}>Delete</button>
                      <button onClick={() => handleUpdateClick(order.order_number)}>Update</button>
                    </div>)}

                  </div>
                  
                </td>
              </tr>
            
              {updatingOrder === order.order_number && (
                <tr>
                  <td colSpan="7">
                    <UpsertForm order={order} updating={true} />
                  </td>
                </tr>
              )}
              {deletingOrder==order.order_number && (<div className="modal-content">
                <p>Are you sure you want to delete this order? This action cannot be undone.</p>
                <button className="close-button" type="button" onClick={()=>DeleteOrder(order.order_number)}>
                  Delete
                </button>
                <button className="create-button" type="submit" onClick={()=>setDeletingOrder(null)}>
                  Cancel
                </button>
              </div>
            ) }
            </React.Fragment>
          
          ))}
        </tbody>
      </table>
    
    </div>
  )
}
;



 
 


export default ShowOrders;



 