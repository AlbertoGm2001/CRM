import React,{useState,useEffect}  from 'react';
import '../App.css';



function CreateButton() {
 

  const possibleOrderStatus= ['Planned', 'In Progress', 'Completed', 'Cancelled']
  const [error,setError] = useState(null);
  const[productOptions,setProductOptions]=useState([])
  const [confirming,setConfirming]=useState(false)

  const Confirmation = () =>{
    setConfirming(true)

  }

  //Se hace una petición a la API para saber qué productos están disponibles, y mostrarlos como desplegable
  
  useEffect(() => {//Se hace una petición a la API para tener los posibles productos, cada vez que se carga la página
    async function fetchProductOptions() {
      try {
        const response = await fetch("http://127.0.0.1:5000/products");
        const data = await response.json();
        const options = data.products.map((product) => product.product_name);
        setProductOptions(options); // Set options for the select dropdown
      } catch (err) {
        setError("Failed to fetch product options");
      }
    }
    fetchProductOptions();
  }, []); // Runs only once when the component mounts
  

  const CreateOrder = async (
    order_number,
    customer,
    product,
    quantity,
    status,
    date,
    notes
  ) => {
    try {
      const queryParams = JSON.stringify({
        orderNumber: order_number,
        customer: customer,
        product: product,
        quantity: quantity,
        status: status,
        date: date,
        notes: notes,
      });

      const fetchingCreateOptions = {
        headers: { 'Content-Type': 'application/json' },
        body: queryParams,
        method: 'POST',
      };
      
      const url = `http://127.0.0.1:5000/create_order`;

      const response = await fetch(url, fetchingCreateOptions);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${errorData.message}`);
      }
      window.location.reload();

      console.log("Order created successfully");
    } catch (error) {
      console.error("Error creating order:", error);
      setError(error.message)
      setConfirming(false);
    }
  };

  return (
    <div>
      
      <form
        onSubmit={(e) => {
          e.preventDefault();
          CreateOrder(
            e.target.order_number.value,
            e.target.customer.value,
            e.target.product.value,
            e.target.quantity.value,
            e.target.status.value,
            e.target.date.value,
            e.target.notes.value
          );
        }}
      >
        {error && <div className="error-message">{error}</div>}
        <label>Order Number:</label>
        <input type="text" name="order_number" required />
        <label>Customer:</label>
        <input type="text" name="customer" required />
        <label>Product:</label>
        <select name="product">{/*Se cargan dinámicamente los componentes de productOptions en el desplegable de Product*/ }
            {
                productOptions.map((product,index)=>
                    (<option key={index} value={product}>{product}</option>
            ))
            }

        </select>
        <label>Quantity:</label>
        <input type="number" name="quantity" required />
        <label>Status:</label>
        <select id="status" name="status">
            <option value="Planned">Planned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
        </select>
        <label>Date:</label>
        <input type="date" name="date" />
        <label>Notes:</label>
        <input type="text" name="notes" />
        {!confirming && <button className="create-button" type="submit" onClick={()=>Confirmation()}>Create Order</button>}{/*Esto funciona sin OnClick, pq se especifica en el propio form */}
        {confirming && <>
        <p>Confirm Creation?</p>
        <button className="create-button" type="submit" onClick={()=>Confirmation()}>Confirm</button>
        </>
        }
        <button className='close-button' type='submit' onClick={()=>window.location.reload()}>Cancel</button>

    </form>
    </div>
  );
}

export default CreateButton;


 