import React,{useState,useEffect}from 'react';
import './App.css';

function UpdateButton({ order }) {
  const [error, setError] = useState(null);//Se mete una variable de error que controla si hay errores en la petición a la API
  const[productOptions,setProductOptions]=useState([]);


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

  const UpdateOrder = async (
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

      const fetchingUpdateOptions = {
        headers: { 'Content-Type': 'application/json' },
        body: queryParams,
        method: 'PATCH',
      };

      const url = `http://127.0.0.1:5000/update_order/${order_number}`;

      const response = await fetch(url, fetchingUpdateOptions);
      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error data:", errorData);
        throw new Error(`HTTP error! Status: ${errorData.message}`);
      }
      window.location.reload();
    } catch (error) {
      console.error("Error updating order:", error);
      setError(error.message);

    }
  };

  return (
    <div className="UpdateForm">
      {error && <div className="error-message">{error}</div>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          UpdateOrder(
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
        <table>
          <tbody>
            <tr>
              <td><label>Order Number:</label></td>
              <td><input type="text" name="order_number" defaultValue={order.order_number} required /></td>
            </tr>
            <tr>
              <td><label>Customer:</label></td>
              <td><input type="text" name="customer" defaultValue={order.customer} required /></td>
            </tr>
            <tr>
              <td><label>Product:</label></td>
              <td> 
                <select>{/*Se cargan dinámicamente los componentes de productOptions en el desplegable de Product*/ }
                {productOptions.map((product,index) =>
                (<option key={index} value={product}>{product}</option> 
                ))
                }
                </select>

              </td>
            </tr>
            <tr>
              <td><label>Quantity:</label></td>
              <td><input type="number" name="quantity" defaultValue={order.quantity} required /></td>
            </tr>
            <tr>
              <td><label>Status:</label></td>
              <td>
              <select id="status" name="status" defaultValue={order.status}>
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              </td>
            </tr>
            <tr>
              <td><label>Date:</label></td>
              <td><input type="date" name="date" defaultValue={order.date} /></td>
            </tr>
            <tr>
              <td><label>Notes:</label></td>
              <td><input type="text" name="notes" defaultValue={order.notes} /></td>
            </tr>
            <tr>
              <td colSpan="2" style={{ textAlign: 'center' }}>
                <button type="submit">Update Order</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}

export default UpdateButton;
