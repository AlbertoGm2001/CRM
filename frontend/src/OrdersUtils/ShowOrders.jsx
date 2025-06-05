/*
En este script se hace una petición get a la API, con la cual se reciben todos los pedidos de la BBDD
Para ello, se usa la función fetchOrders, y una vez se reciben los datos de la API, se renderiza la app usando useEffect.
Después se muestran estos pedidos como una tabla ,para lo cual debe ser definido un código HTML, que es lo que se pasa a la APP.jsx
*/ 


/*
31/01:Se cambia esta función para que no haga petición a la API de recibir todos los pedidos posibles, sino que recibe como input los pedidos a mostrar
*/ 

import React, { useState, useEffect, useRef } from 'react';
import {UpsertForm} from './UpsertOrder';
import '../App.css';
import {DeleteOrder} from './Params'
import Select from "react-select";
import { defaultFilters } from './Params';




 


const ShowOrders = ({ Orders,ResetFilters }) => {
  const [visibleOrders, setVisibleOrders] = useState([]);
  const [orderingDirection, setOrderingDirection] = useState(true);
  const [activeFilter, setActiveFilter] = useState(null);
  const [filterValues, setFilterValues] = useState(defaultFilters);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);
  const [optionsMenu, setOptionsMenu] = useState(null);
  const filterPopupRef = useRef(null);
  //UseRef sirve para guardar el valor de una variable, de manera que si cambia, no se re-renderiza el componente.
  //Para tema de filtros se necesita para no reiniciar el listener de si se hace click fuera del popup de filtros cuando cambie algo en la pg.
  

  
  useEffect(() => {
    setVisibleOrders(Orders);
  }, [Orders]);

  // Add resetFilters function
  const handleResetFilters = () => {
    // Reset all filter states to their initial values:
    setFilterValues(defaultFilters); // Clear any applied filter values
    setVisibleOrders(Orders); // Reset visible orders back to original Orders array
    setActiveFilter(null); // Clear any active filter column
  };
   
  useEffect(() => {
    if (ResetFilters) {
      handleResetFilters();
    }
  }, [ResetFilters]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeFilter && filterPopupRef.current && !filterPopupRef.current.contains(event.target)) {//Se mira si se clicka fuera del popup
        setActiveFilter(null);
      }
    };

    if (activeFilter) {
      document.addEventListener('mousedown', handleClickOutside);//Si se clicka, se ejecuta el handleClickOutside
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeFilter]);

  const handleSortingClick = (column) => {
    if (orderingDirection) {
      setVisibleOrders((prevOrders) =>
        [...prevOrders].sort((a, b) =>
          typeof a[column] === 'string'
            ? b[column].localeCompare(a[column])
            : b[column] - a[column]
        )
      );
    } else {
      setVisibleOrders((prevOrders) =>
        [...prevOrders].sort((a, b) =>
          typeof a[column] === 'string'
            ? a[column].localeCompare(b[column])
            : a[column] - b[column]
        )
      );
    }
    setOrderingDirection(!orderingDirection);
  };

  const handleUpdateClick = (orderNumber) => {
    setUpdatingOrder(orderNumber);
  };

  const handleDeleteClick = (order_number) => {
    setDeletingOrder(order_number);
  };

  const handleOptionsClick = (order_number) => {
    setOptionsMenu((prevMenu) => (prevMenu === order_number ? null : order_number));
  };

  const handleFilterClick = (column) => {
    setActiveFilter(activeFilter === column ? null : column);
  };

  const handleFilterApply = (column, value) => {

    // Esta función se encarga primero de, leer el filtro que se ha añadido, y actualizarlo en filterValues.
    // Una vez se ha actualizado filterValues, dice, vale para cada columna,
    //  si tengo un array(status,customer,product)-->para cada pedido, miro a ver si alguno de los elementos de cada array está en ese pedido.
    //
    const newFilterValues = { ...filterValues };
    if (value && value.length > 0) {
      newFilterValues[column] = value;
    } else {
      delete newFilterValues[column];
    }
    setFilterValues(newFilterValues);
    console.log(newFilterValues);

    // Apply filters
    let filtered = [...Orders];
    Object.entries(newFilterValues).forEach(([col, val]) => {
      if (Array.isArray(val) && val.length > 0) {
        const values = val.map(v => v.value);
        filtered = filtered.filter(order => values.includes(order[col]));
      } else if (col === 'min_quantity') {
        const num = parseFloat(val);
        if (!isNaN(num)) {
          filtered = filtered.filter(order => parseFloat(order['quantity']) >= num);
        }
      }
      else if (col === 'max_quantity') {
        const num = parseFloat(val);
        if (!isNaN(num)) {
          filtered = filtered.filter(order => parseFloat(order['quantity']) <= num);
        }
      }
      else if (col === 'min_date') {
        const date = val;
        filtered = filtered.filter(order => (order['date']) >= date);
        }
      
      else if (col === 'max_date') {
        const date = val;
        
        filtered = filtered.filter(order => (order['date']) <= date);
        }
      
       else {
        filtered = filtered//.filter(order => order[col].toString().toLowerCase().includes(val.toLowerCase()));
      }
    });
    setVisibleOrders(filtered);
  };

  const FilterPopup = ({ column }) => {

    // Esta función define el tipo de modal que se va a mostrar en función de la columna sobre la que se quiera filtrar.
    const options = ['customer', 'product', 'status','order_number'].includes(column) ? [...new Set(Orders.map(order => order[column]))]
      .sort((a, b) => a.localeCompare(b))
      .map(value => ({
        value: value,
        label: value
      })) : null;

    return (
      <div className="filter-popup" ref={filterPopupRef} onClick={(e) => e.stopPropagation()}>
        {/*
        e.stopPropagation:

        Si no se pone, cundo tú haces un click, ese click se asocia al div en que se ha hecho el clikc, pero
        después de un tiempo, se va a asociar al div padre que es el documento.
        Si por un problema de tiempo, la función handleClickOutside no se ejecuta suficientemente rápido por lo que sea,
        el click estará asociado al documento por lo que si hubieras clickado dentro del popup, se cerraría también, pensando que era fuera.
        
        */}
        {['customer', 'product', 'status','order_number'].includes(column) ? (
          <Select
            isMulti
            options={options}
            value={filterValues[column] || []}
            onChange={(selected) => handleFilterApply(column, selected)}
            placeholder={`Filter ${column}`}
            className="filter-select"
          />
        ) :
         column === 'quantity' ? (
          <div className="filter-multiple-popup">
            <input
              type="number" 
              value={filterValues['min_quantity'] || ''}
              onChange={(e) => handleFilterApply('min_quantity', e.target.value)}
              placeholder="Min quantity"
            />
            <input
              type="number"
              value={filterValues['max_quantity'] || ''}
              onChange={(e) => handleFilterApply('max_quantity', e.target.value)} 
              placeholder="Max quantity"
            />
          </div>
          
            ) : column==='date' ?
            <div className="filter-multiple-popup">
              <input
                type="date"
                value={'2025-01-01'}
                onChange={(e) => handleFilterApply('min_date', e.target.value)}
                placeholder="Min date"
              />
              <input
                type="date"
                value={'2026-01-01'}
                onChange={(e) => handleFilterApply('max_date', e.target.value)}
                placeholder="Max date"
              />
            </div> : null            
            }
        <div className="filter-actions">
          <button onClick={() => {
            const newFilterValues = { ...filterValues };
            delete newFilterValues[column];
            setFilterValues(newFilterValues);
            handleFilterApply(column, null);
          }}>Clear</button>
          <button onClick={() => setActiveFilter(null)}>Close</button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <table className='ordersList'>
        <thead>
          <tr>
            {['order_number', 'product', 'quantity', 'customer', 'status', 'date', 'notes'].map((column) => (
              <th key={column}>
                <div className="column-header">
                  <span onClick={() => handleSortingClick(column)}>
                    {column.replace('_', ' ')}
                  </span>
                  {column !== 'notes' && (
                    <button
                      className={`filter-toggle ${filterValues[column] ? 'active' : ''}`}
                      onClick={() => handleFilterClick(column)}
                    >
                      ⚡
                    </button>
                  )}
                  {activeFilter === column && (
                    <FilterPopup column={column} />
                  )}
                </div>
              </th>
            ))}
            <th>Actions</th>
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
                    <button className='menu-button' onClick={() => handleOptionsClick(order.order_number)}>&#8230;</button>
                    {optionsMenu === order.order_number && (
                      <div className='menu-options simple-menu'>
                        <button onClick={() => handleDeleteClick(order.order_number)}>Delete</button>
                        <button onClick={() => handleUpdateClick(order.order_number)}>Update</button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
              {updatingOrder === order.order_number && (
                <tr>
                  <td colSpan="8">
                    <UpsertForm order={order} updating={true} />
                  </td>
                </tr>
              )}
              {deletingOrder === order.order_number && (
                <div className="modal-content">
                  <p>Are you sure you want to delete this order? This action cannot be undone.</p>
                  <button className="close-button" type="button" onClick={() => DeleteOrder(order.order_number)}>
                    Delete
                  </button>
                  <button className="create-button" type="submit" onClick={() => setDeletingOrder(null)}>
                    Cancel
                  </button>
                </div>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowOrders;



 