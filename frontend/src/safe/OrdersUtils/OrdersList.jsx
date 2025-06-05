/*
En este script se hace una petición get a la API, con la cual se reciben todos los pedidos de la BBDD
Para ello, se usa la función fetchOrders, y una vez se reciben los datos de la API, se renderiza la app usando useEffect.
Después se muestran estos pedidos como una tabla , àra lo cual debe ser definido un código HTML, que es lo que se pasa a la APP.jsx
*/ 


/*
31/01:Se cambia esta función para que no haga petición a la API de recibir todos los pedidos posibles, sino que recibe como input los pedidos a mostrar
*/ 

import React, { useState, useEffect } from 'react';
import UpdateButton from './UpdateButton';
import '../App.css';
 









const ShowOrders=({Orders})=>{//Si el input Orders es un diccionario, se pasa en el input como {Orders} 
  
    //Funcionalidad de mostrar todos los pedidos. Aquí se muestran los pedidos en función del valor de los filtros
    
    const fetchingGetOptions = { headers: { 'Content-Type': 'application/json' } };
  
    //Funcionalidad de Actualizar un pedido
    const [updatingOrder, setUpdatingOrder] = useState(null);
    const handleUpdateClick = (orderNumber) => {
      setUpdatingOrder(orderNumber);
    };
    
    
    //Funcionalidad de ordenar todos los pedidos
    const [visibleOrders, setVisibleOrders] = useState([]);
    const [isOrdersLoaded, setIsOrdersLoaded] = useState(false);
    const [sortingColumn,setSortingColumn]=useState(null);
    const [orderingDirection,setOrderingDirection]=useState(true);//Orden descendente o ascendente
    const [sorting,setSorting]=useState(true);

    useEffect(() => {
      setVisibleOrders(Orders);
    }, [Orders]);

    //Control de que los pedidos se han cargado  
    useEffect(() => {
      if (visibleOrders.length > 0) {
          setIsOrdersLoaded(true);
      }
    }, [visibleOrders]);

    
    
    const handleSortingClick = () => {
      if (orderingDirection===true){
         {
          setVisibleOrders((prevOrders) =>
            [...prevOrders].sort((a, b) =>
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


    useEffect(() => { 
      handleSortingClick();
      }, [sorting]);
    
      useEffect(() => {
        if (isOrdersLoaded && sortingColumn) {
            handleSortingClick();
        }
    }, [sortingColumn, isOrdersLoaded]);

    





    const fetchingDelOptions = { headers: { 'Content-Type': 'application/json' }, method: 'DELETE' };
    //Funcionalidad de borrar un pedido  
    const [deletingOrder, setDeletingOrder] = useState(null);
    const handleDeleteClick = (order_number) => {
      setDeletingOrder(order_number);
    };



    //Funcionalidad de que las opciones aparezcan comprimidas en un botón
    const [optionsMenu,setOptionsMenu]=useState(null)
    const handleOptionsClick=(order_number)=>{
      setOptionsMenu((optionsMenu) => (optionsMenu === order_number ? null : order_number))}

    //Función para borrar un pedido
    const DeleteOrder = async (order_id) => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/delete_order/${order_id}`, fetchingDelOptions);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log("Order deleted successfully");
        window.location.reload();
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }  
         
  
  
  
  return  (
    <div>
      <table className='ordersList'>
        <thead>
          <tr>
          <th onClick={() => {

                   setSortingColumn('order_number'); 
                    setSorting(!sorting);
          }}>
    Order ID
</th>
            <th onClick={() => {
                   setSortingColumn('product'); 
                   setSorting(!sorting)}}>Product ID</th>
            <th onClick={() => {
                   setSortingColumn('quantity'); 
                   setSorting(!sorting)}}>Quantity</th>
            <th onClick={() => {
              setSortingColumn('customer'); 
              setSorting(!sorting);
              } }>Customer</th>
            <th onClick={() => {
            setSortingColumn('status'); 
            setSorting(!sorting);
            }}>Status</th>
            <th onClick={() => {
            setSortingColumn('date'); 
            setSorting(!sorting);
            }}>Date</th>
            <th onClick={() => {
            setSortingColumn('notes'); 
            setSorting(!sorting);
            }}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {visibleOrders.map((order, index) => (
            <React.Fragment key={index}>
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
                    <UpdateButton order={order} />
                  </td>
                </tr>
              )}
              {deletingOrder==order.order_number && (<div className="modal-content">
                <p>Are you sure you want to delete this order? This action cannot be undone.</p>
                <button className="close-button" type="button" onClick={()=>DeleteOrder(order.order_number)}>
                  Delete
                </button>
                <button className="create-button" type="submit" onClick={()=>window.location.reload()}>
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



 