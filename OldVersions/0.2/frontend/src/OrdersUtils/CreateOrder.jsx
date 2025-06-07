import React, { useState, useEffect } from 'react';
import '../App.css';

// 🟢 Exporting CreateOrder as a standalone function
export const CreateOrder = async (
    order_number, customer, product, quantity, status, date, notes, setError, setConfirming
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
        setError(error.message);
        setConfirming(false);
    }
};


// 🟢 CreateForm accepts CreateOrder as a prop
function CreateForm({ CreateOrder }) {
    const [error, setError] = useState(null);
    const [productOptions, setProductOptions] = useState([]);
    const [confirming, setConfirming] = useState(false);

    const Confirmation = () => {
        setConfirming(true);
    };

    useEffect(() => {
        async function fetchProductOptions() {
            try {
                const response = await fetch("http://127.0.0.1:5000/products");
                const data = await response.json();
                const options = data.products.map((product) => product.product_name);
                setProductOptions(options);
            } catch (err) {
                setError("Failed to fetch product options");
            }
        }
        fetchProductOptions();
    }, []);

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
                        e.target.notes.value,
                        setError,        // 🟢 Passing setError to handle errors
                        setConfirming    // 🟢 Passing setConfirming to handle confirmation state
                    );
                }}
            >
                {error && <div className="error-message">{error}</div>}
                
                <label>Order Number:</label>
                <input type="text" name="order_number" required />

                <label>Customer:</label>
                <input type="text" name="customer" required />

                <label>Product:</label>
                <select name="product">
                    {productOptions.map((product, index) => (
                        <option key={index} value={product}>{product}</option>
                    ))}
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

                {!confirming && (
                    <button
                        className="create-button"
                        type="submit"
                        onClick={Confirmation}
                    >
                        Create Order
                    </button>
                )}
                
                {confirming && (
                    <>
                        <p>Confirm Creation?</p>
                        <button className="create-button" type="submit">Confirm</button>
                    </>
                )}
                
                <button
                    className='close-button'
                    type='button'
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

            {showCreateForm && <CreateForm CreateOrder={CreateOrder} />}
        </div>
    );
};


// 🟢 Named export of FullCreateOrder and CreateOrder
export default FullCreateOrder;


 