const fetchOrders = async (setOrders,setError) => {
    try {
        const fetchingGetOptions = { headers: { 'Content-Type': 'application/json' } };

        const response = await fetch('http://127.0.0.1:5000/orders', fetchingGetOptions);
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setOrders(data.orders);
        
       
    } catch (e) {
        console.log("Error fetching orders:", e);
        setError("Error del servidor. Habla con Beto")

    }  
    };


const fetchingFilterOptions = {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
        };

const fetchingDelOptions = { headers: { 'Content-Type': 'application/json' }, method: 'DELETE' };

const fetchingUpsertOptions =(order_number,customer,product,quantity,status,date,notes,updating)=> {
    
    const queryParams = JSON.stringify({
        orderNumber: order_number,
        customer: customer,
        product: product,
        quantity: quantity,
        status: status,
        date: date,
        notes: notes,
      });


    
    return {headers: { 'Content-Type': 'application/json' },
    body: queryParams,
    method: updating ?  'PATCH':'POST',}
  };



const extractUniqueValues=(column,Orders)=>{
        
        return [...new Set(Orders.map((order) => order[column]))].map((column) => ({
            value: column,
            label: column,
        }));
    }
    
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
       

export {fetchOrders,defaultFilters,fetchingFilterOptions,fetchingDelOptions,fetchingUpsertOptions,extractUniqueValues,DeleteOrder};