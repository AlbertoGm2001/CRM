/*
En este script se pretende definir la estructura de un botón que permita filtrar los pedidos de la BBDD
Se deberán exportar los valores de los filtros para que puedan ser usados en el script de OrdersList
*/ 

// PQ HACE FALTA TENER UN FILTER VALUES Y UN FORM VALUES, Y NO VALE CON UNO SOLO DE ELLOS?

import React, { useState, useEffect } from 'react';
import ShowOrders from './OrdersList';
import '../App.css';
import Select from "react-select";

 



function Filters() {


    const inf=9999999;  
    const [error,setError] = useState(null);
    const [appliedFilters,setAppliedFilters]=useState(false)
    const defaultFilters = {
        order_number: "",
        customer: [],
        product: [],
        min_quantity: "",
        max_quantity: "",
        min_date: "",
        max_date: "",
        status: [],
      };

    const fetchingGetOptions = { headers: { 'Content-Type': 'application/json' } };
    const [filteredOrders,setFilteredOrders]=useState([]);
    const [isLoading, setIsLoading] = useState(true);//Controla que no se ejecute nada hasta que se carguen los datos
    const [formValues, setFormValues] = useState(defaultFilters);
    const [activeFilter, setActiveFilter] = useState(null);
    const [filterValues, setFilterValues] = useState(defaultFilters);


    //Se inicializa la pantalla con todos los pedidos
    const fetchOrders = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/orders', fetchingGetOptions);
            if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setFilteredOrders(data.orders);
            
           
        } catch (e) {
            console.log("Error fetching orders:", e);
            setError(e.message)

        }  
        };
    
        
    useEffect(() => {//Nada más se renderiza la pantalla, se ejecuta fetchOrders
        fetchOrders();
    }, []);    



    useEffect(() => {
        if (filteredOrders.length > 0) {
            console.log("Fetched orders:", filteredOrders);
            setIsLoading(false);
        }
    }, [filteredOrders]); 
      
    const sortOrders=(column)=>{
    
      //Ordena los pedidos en función de la columna seleccionada
      //column: string, nombre de la columna por la que se quiere ordenar
      //return: lista de pedidos ordenados
      let sortedOrders=filteredOrders;
      sortedOrders.sort((a,b)=>a[column]>b[column]?1:-1);
      setFilteredOrders(sortedOrders);
    
    }

    //Función para mostrar los pedidos filtrados
    const FilterOrders= async (filterValues)=>{
        try {
            // console.log('Filters',filterValues)

            setAppliedFilters(true)
            // Convert filterValues into URL query parameters
            
            console.log('FILTERS:',filterValues)
            
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
            console.log('FILTERS URL:',url)
            // Fetch options without a body since it's a GET request
            const fetchingFilterOptions = {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            };
        
         
            const response = await fetch(url, fetchingFilterOptions);
        
            if (!response.ok) {
                const errorData=await response.json()
                console.log(errorData)
                setError(errorData.message)
                throw new Error(`HTTP error! Message: ${errorData.message}`);
            }
        
            const data = await response.json();
            setFilteredOrders(data.orders);  
            console.log("Filtered orders:", data.orders);
            setError(null)
        
        } catch (error) {
            console.error("Error filtering orders:", error);
        }  
    }


   

    const FilterForm = ({ filteredOrders, FilterOrders }) => {
        const Orders = filteredOrders;  
    

        // Función que actualiza el formValues, si se selecciona algo en un filtro
        const handleChange = (name, value) => {//Se ejecuta automáticamente al cambiar algo en el form de filtros
            setFormValues((prev) => ({
            ...prev,
            [name]: value,
            }));
        };



        // Extract unique products, customers, and statuses for the selects
        const productOptions = [...new Set(Orders.map((order) => order.product))].map((product) => ({
            value: product,
            label: product,
        }));

        const customerOptions = [...new Set(Orders.map((order) => order.customer))].map((customer) => ({
            value: customer,
            label: customer,
        }));

        const statusOptions = [...new Set(Orders.map((order) => order.status))].map((status) => ({
            value: status,
            label: status,
        }));

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
            });
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
                    type="number"
                    name="min_quantity"
                    value={formValues.min_quantity}
                    onChange={(e) => handleChange("min_quantity", e.target.value)}
                />

                <label>Max Quantity</label>
                <input
                    type="number"
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
                        FilterOrders(defaultFilters);
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

    const handleFilterClick = (column) => {
        setActiveFilter(activeFilter === column ? null : column);
    };

    const handleFilterApply = async (column, values) => {
        const newFilterValues = { ...filterValues };
        
        // Update the filter values based on column type
        switch(column) {
            case 'order_number':
                newFilterValues.order_number = values;
                break;
            case 'customer':
                newFilterValues.customer = values.map(v => v.value);
                break;
            case 'product':
                newFilterValues.product = values.map(v => v.value);
                break;
            case 'status':
                newFilterValues.status = values.map(v => v.value);
                break;
            // Add other cases as needed
        }

        setFilterValues(newFilterValues);
        await FilterOrders(newFilterValues);
        setActiveFilter(null);
    };

    
        return (
            <div>
            {isLoading ? (
                <p>Loading orders...</p>
            ) : (
                <ShowOrders 
                    Orders={filteredOrders}
                    onFilterClick={handleFilterClick}
                    activeFilter={activeFilter}
                    onFilterApply={handleFilterApply}
                    filterValues={filterValues}
                />
            )}
            </div>
        );
    }

 

export default Filters ;

