# LLM Powered CRM

The idea of this project was to develop a simple and user-friendly CRM, to which i would integrate certain LLMs related functionalities, to help users improve efficiency.

I quit this project because I was progressing too slow, and got excited with the Fantasy Stock idea. 
Anyway, even though I never got to integrate any LLM functionality into it, and the design is as ugly as it can be, I think I got a decently functional and very basic CRM.

## Technology Stack

### Frontend
- React 18.2.0
- React Select 5.10.0
- React Scripts 5.0.1
- Testing Libraries (Jest, React Testing Library)

### Backend
- Python 3.11+ (recommended)
- Flask 3.1.0
- Flask-SQLAlchemy 3.1.1
- Flask-CORS 5.0.1
- SQLAlchemy 2.0.39
- Pandas 2.2.3
- NumPy 2.2.3

## Prerequisites

- Node.js (v14 or higher)
- Python 3.11 or higher
- pip (Python package manager)
- npm (Node package manager)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a Python virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- Windows (PowerShell):
```bash
.\venv\Scripts\Activate.ps1
```
- Windows (Command Prompt):
```bash
.\venv\Scripts\activate.bat
```
- Unix/MacOS:
```bash
source venv/bin/activate
```

4. Install Python dependencies:
```bash
pip install -r requirements.txt
```

5. Run the Flask server:
```bash
python main.py
```
The backend server will start on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```
The frontend application will start on http://localhost:3000

## Project Structure

```
CRM/
├── backend/
│   ├── venv/
│   ├── config.py
│   ├── main.py
│   ├── models.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
└── README.md
```

## Features

- Order Management
  - Create, read, update, and delete orders
  - Filter orders by various criteria
  - Track order status
- Product Management
  - Product catalog
  - Stock tracking
  - Category management
- Customer Management
  - Customer profiles
  - Order history
  - Contact information

## API Endpoints

### Orders
- GET /orders - Get all orders
- POST /create_order - Create a new order
- GET /filter_orders - Filter orders by criteria
- PATCH /update_order/<order_number> - Update an order
- DELETE /delete_order/<order_number> - Delete an order

### Products
- GET /products - Get all products
- POST /create_product - Create a new product
- DELETE /delete_product/<product_id> - Delete a product

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 
