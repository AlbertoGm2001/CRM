/*
En este script se pretende definir la estructura de un botón que permita filtrar los pedidos de la BBDD
Se deberán exportar los valores de los filtros para que puedan ser usados en el script de OrdersList
*/ 

// PQ HACE FALTA TENER UN FILTER VALUES Y UN FORM VALUES, Y NO VALE CON UNO SOLO DE ELLOS?

import React, { useState, useEffect,useCallback } from 'react';
import ShowOrders from './ShowOrders';
import '../App.css';
import Select from "react-select";
import { fetchOrders,defaultFilters,fetchingFilterOptions,extractUniqueValues } from './Params';
  

 



    

//Función para mostrar los pedidos filtrados
const FilterOrders= async (filterValues,setFilteredOrders,setError)=>{
    try {
        
        // Convert filterValues into URL query parameters
         
        const queryParamsObj = {};
        if (filterValues.order_number) queryParamsObj.order_number = filterValues.order_number;
        if (filterValues.customer) queryParamsObj.customer = filterValues.customer;
        if (filterValues.product) queryParamsObj.product = filterValues.product;
        if (filterValues.min_quantity) queryParamsObj.min_quantity = filterValues.min_quantity;
        if (filterValues.max_quantity) queryParamsObj.max_quantity = filterValues.max_quantity;
        if (filterValues.min_date) queryParamsObj.min_date = filterValues.min_date;
        if (filterValues.max_date) queryParamsObj.max_date = filterValues.max_date;
        if (filterValues.status) queryParamsObj.status = filterValues.status;

        // Convert to query parameters
        const queryParams = new URLSearchParams(queryParamsObj).toString();
    
        // Construct the URL with query parameters
        const url = `http://127.0.0.1:5000/filter_orders?${queryParams.toString()}`;
        // Fetch options without a body since it's a GET request
        
    
     
        const response = await fetch(url, fetchingFilterOptions);
    
        if (!response.ok) {
            const errorData=await response.json()
            console.log(errorData)
            setError(errorData.message)
            throw new Error(`HTTP error! Message: ${errorData.message}`);
        }
        
        const data = await response.json();
        setFilteredOrders(data.orders);  
        setError(null)
    
    } catch (error) {
        console.error("Error filtering orders:", error);
        setError(error.message)
    }  
}


    
     
    

  


    const FilterForm = ({ filteredOrders, FilterOrders,defaultFilters,setFilteredOrders,error,setError }) => {

        const [formValues, setFormValues] = useState(defaultFilters);
        

        // Función que actualiza el formValues, si se selecciona algo en un filtro
        const handleChange = useCallback((name, value) => {//UseCallback hace que la función se memoriza, y no se cree de nuevo en cada render. Es solo un tema de eficiencia.
            setFormValues((prev) => ({
            ...prev,
            [name]: value,
            }));
        });
        
        



        


        // Saca los valores únicos de las variables categóricas
        const productOptions= extractUniqueValues('product',filteredOrders)
 
        const customerOptions = extractUniqueValues('customer',filteredOrders)

        const statusOptions = extractUniqueValues('status',filteredOrders)

        // Se pasa a FilterOrders los valores del formValues
        const handleSubmit = (e) => {
            e.preventDefault();
            FilterOrders({
            order_number: formValues.order_number,
            customer: formValues.customer.map((c) => c.value), 
            product: formValues.product.map((p) => p.value), 
            min_quantity: formValues.min_quantity,
            max_quantity: formValues.max_quantity,
            min_date: formValues.min_date,
            max_date: formValues.max_date,
            status: formValues.status.map((s) => s.value), 
            },setFilteredOrders,setError);
        };

        return (
            <form className="filterForm" onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}

            <div className="container">
                <label>Order Number</label>
                <input
                type="number"
                name="order_number"
                value={formValues.order_number}
                onChange={(e) => handleChange("order_number", e.target.value)}
                />

                <label>Products</label>
                
                <Select
                isMulti
                options={productOptions}
                value={formValues.product}
                onChange={(selected) => handleChange("product", selected || [])}//Si se cambia algo se llama a handleChange
                placeholder="Select Products"
                classNamePrefix="custom-select"
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                <label>Min Quantity</label>
                <input
                    type="text"
                    name="min_quantity"
                    value={formValues.min_quantity}
                    onChange={(e) => handleChange("min_quantity", e.target.value)}
                />

                <label>Max Quantity</label>
                <input
                    type="text"
                    name="max_quantity"
                    value={formValues.max_quantity } 
                    onChange={(e) => handleChange("max_quantity", e.target.value)}
                />
                </div>

                <label>Customer</label>
                <Select
                isMulti
                options={customerOptions}
                value={formValues.customer}
                onChange={(selected) => handleChange("customer", selected || [])}
                placeholder="Select Customer"
                classNamePrefix="custom-select"

                />

                <label>Status</label>
                {/* MultiSelect for Status */}
                <Select
                isMulti
                options={statusOptions}
                value={formValues.status}
                onChange={(selected) => handleChange("status", selected || [])}
                placeholder="Select Status"
                classNamePrefix="custom-select"

                />

                <div style={{ display: "flex", flexDirection: "column" }}>
                <label>Start Date:</label>
                <input
                    type="date"
                    name="min_date"
                    value={formValues.min_date}
                    onChange={(e) => handleChange("min_date", e.target.value)}
                />

                <label>End Date</label>
                <input
                    type="date"
                    name="max_date"
                    value={formValues.max_date}
                    onChange={(e) => handleChange("max_date", e.target.value)}
                />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button type="submit">Filter</button>
                <button 
                    type="button" 
                    onClick={() => {
                    
                        setFormValues(defaultFilters)
                        FilterOrders(defaultFilters,setFilteredOrders,setError);
                        setError(null)

                    }}
    >
                    Reset
                </button>
                </div>
            </div>
            </form>
        );
        };





    const Filtering =() =>{
        const [error,setError] = useState(null);

        const [filteredOrders,setFilteredOrders]=useState([])

        useEffect(() => {//Nada más se renderiza la pantalla, se ejecuta fetchOrders
            fetchOrders(setFilteredOrders,setError);
        }, []);

        return (
            <div>
            {<FilterForm filteredOrders={filteredOrders} 
                            FilterOrders={FilterOrders}
                            defaultFilters={defaultFilters}
                            setFilteredOrders={setFilteredOrders}
                            error={error}
                            setError={setError}  />}
            <ShowOrders Orders={filteredOrders}/>
            </div>
        )
    };


 

export default Filtering ;

