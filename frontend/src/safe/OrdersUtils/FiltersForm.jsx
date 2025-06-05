/*
En este script se pretende definir la estructura de un botón que permita filtrar los pedidos de la BBDD
Se deberán exportar los valores de los filtros para que puedan ser usados en el script de OrdersList
*/ 


import React, { useState, useEffect } from 'react';
import ShowOrders from '../../OrdersUtils/ShowOrders';
import '../App.css';
import { fetchOrders } from '../../OrdersUtils/Params';

const Filtering = () => {
  const [error, setError] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    fetchOrders(setFilteredOrders, setError);
  }, []);

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      <ShowOrders Orders={filteredOrders} />
    </div>
  );
};

export default Filtering;

