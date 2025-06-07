import React,{useState,useEffect}from 'react';
import '../App.css';
import { fetchingUpsertOptions,defaultFilters } from './Params';




export const upsertOrder = async (
  order_number,new_order_number,customer,product,quantity,status,date,notes,setError,setConfirming,updating) => {
    //updating is a boolean that determines if you are creating or updating a function
  try {
     
    const url = updating ? `http://127.0.0.1:5000/update_order/${order_number}`:`http://127.0.0.1:5000/create_order`;

    const fetchingOptions= fetchingUpsertOptions(order_number=  new_order_number,
                                                                                  customer=customer,
                                                                                  product=product,
                                                                                  quantity=quantity,
                                                                                  status=status,
                                                                                  date=date,
                                                                                  notes=notes,
                                                                                  updating=updating)


    const response = await fetch(url, fetchingOptions);
    if (!response.ok) {
      const errorData = await response.json();
      console.log("Error data:", errorData);
      throw new Error(`HTTP error! Status: ${errorData.message}`);
    }
    window.location.reload();
  } catch (error) {
    console.error("Error updating order:", error);
    setError(error.message);
    setConfirming(false)

  }
};






function UpsertForm({ order, updating }) {
  const [error, setError] = useState(null);//Se mete una variable de error que controla si hay errores en la petición a la API
  const [productOptions,setProductOptions]=useState([]);
  const [confirming,setConfirming]=useState(false); 
 
  useEffect(()=>{//renderiza los productos disponibles
    const fetchProductOptions= async()=>{
    try {
        const response = await fetch("http://127.0.0.1:5000/products");
        const data = await response.json();
        const options = data.products.map((product) => product.product_name);
        setProductOptions(options); // Set options for the select dropdown
      } catch (err) {
        setError("Failed to fetch product options");
      }
    }
    fetchProductOptions()
  },[])
  
  const showConfirmingMessage =()=>{
    setConfirming(true)



  }
  
  return (
    <div>
      
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log('e.target:',e.target);
          upsertOrder(
            order.order_number,
            e.target.order_number.value,
            e.target.customer.value,
            e.target.product.value,
            e.target.quantity.value,
            e.target.status.value,
            e.target.date.value,
            e.target.notes.value,
            setConfirming,
            setError,updating
          );
        }}         

      >
        
        {error && <div className="error-message">{error}</div>}
        <label>Order Number:</label>
        <input
          type="text"
          name="order_number"
          defaultValue={order.order_number}
          required
        />
        
        <label>Customer:</label>
        <input
          type="text"
          name="customer"
          defaultValue={order.customer}
          required
        />
        
        <label>Product:</label>
        <select name="product" defaultValue={order.product}>
          {productOptions.map((product, index) => (
            <option key={index} value={product}>
              {product}
            </option>
          ))}
        </select>
        
        <label>Quantity:</label>
        <input
          type="number"
          name="quantity"
          defaultValue={order.quantity}
          required
        />
        
        <label>Status:</label>
        <select id="status" name="status" defaultValue={order.status}>
          <option value="Planned">Planned</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        
        <label>Date:</label>
        <input type="date" name="date" defaultValue={order.date} />
        
        <label>Notes:</label>
        <input type="text" name="notes" defaultValue={order.notes} />
        
        { !confirming && <button className="create-button" type="submit" onClick={()=>showConfirmingMessage()}>
          Update Order
        </button>}
        { confirming && 
        (<>
        <p>Confirm Changes?</p>
        <button className="create-button" type="submit" >
          Confirm
        </button></>)}
        
        <button
          className="close-button"
          type="button"
          onClick={() => window.location.reload()}
        >
          Cancel
        </button>
      </form>
    </div>
  );
  
}




// 🟢 FullCreateOrder component renders CreateForm and passes CreateOrder
const FullCreateOrder = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateClick = () => {
      setShowCreateForm(!showCreateForm);

  };

 
  return (
      <div className="App">
          <button onClick={handleCreateClick}>
              Create Order
          </button>

          {showCreateForm && <UpsertForm order={defaultFilters} updating={false} />}
      </div>
  );
};


// 🟢 Named export of FullCreateOrder and CreateOrder
 

export  {UpsertForm,FullCreateOrder};
