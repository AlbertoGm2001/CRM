/*
En este script se hace una petición get a la API, con la cual se reciben todos los pedidos de la BBDD
Para ello, se usa la función fetchOrders, y una vez se reciben los datos de la API, se renderiza la app usando useEffect.
Después se muestran estos pedidos como una tabla , àra lo cual debe ser definido un código HTML, que es lo que se pasa a la APP.jsx
*/ 

import React, { useState, useEffect } from 'react';
import UpdateButton from './UpdateButton';
import './App.css';

const OrdersList = () => {
  const [Orders, SetOrders] = useState([]);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const handleUpdateClick = (orderNumber) => {
    setUpdatingOrder(orderNumber);
  };

  const fetchingGetOptions = { headers: { 'Content-Type': 'application/json' } };
  const fetchingDelOptions = { headers: { 'Content-Type': 'application/json' }, method: 'DELETE' };

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/orders', fetchingGetOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched orders:", data.orders);
      SetOrders(data.orders);
    } catch (e) {
      console.log("Error fetching orders:", e);
    }
  };

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

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    console.log("Orders state updated:", Orders);
  }, [Orders]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Product ID</th>
            <th>Quantity</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Date</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {Orders.map((order, index) => (
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
                  <button onClick={() => DeleteOrder(order.order_number)}>Delete</button>
                </td>
                <td>
                  <button onClick={() => handleUpdateClick(order.order_number)}>Update</button>
                </td>
              </tr>
              {updatingOrder === order.order_number && (
                <tr>
                  <td colSpan="7">
                    <UpdateButton order={order} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersList;