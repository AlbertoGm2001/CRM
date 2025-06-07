from flask import request, jsonify
from config import app, db
from models import *
from sqlalchemy import or_
import datetime


@app.route("/orders", methods=["GET"])
def get_orders():
    orders = Orders.query.all()
    json_orders = list(map(lambda x: x.to_json(), orders))
    return jsonify({"orders": json_orders})

 
@app.route("/products", methods=["GET"])
def get_products():
    products = Products.query.all()
    json_products = list(map(lambda x: x.to_json(), products))
    return jsonify({"products": json_products})

# return {
#             'id': self.id,
#             'order_number': self.order_number,
#             'customer': self.customer,
#             'product': self.product,
#             'quantity': self.quantity,
#             'date': self.date,
#             'status': self.status,
#             'notes': self.notes}





@app.route("/create_order", methods=["POST"])
def create_order():
    order_number = request.json.get("orderNumber")
    customer = request.json.get("customer")
    product = request.json.get("product")
    # product=Products.query.filter_by(product_name=request.json.get("product")).first()  
    quantity = int(request.json.get("quantity"))
    date = request.json.get("date")
    if not date:  # If date is empty or None
        date = None
    status = request.json.get("status")
    notes = request.json.get("notes")
    if not notes:
        notes = None
    if order_number in [order.order_number for order in Orders.query.all()]:
         return (
            jsonify({"message": "The order number cannot be repeated"}),
            400,
        )
    if not order_number or not customer or not product or not quantity:
        return (
            jsonify({"message": "You must include order number, customer, product and quantity"}),
            400,
        )
    if quantity<0:
        return jsonify({"message": "Quantity must be a positive number"}), 400

    if product not in [product.product_name for product in Products.query.all()]:
         
        return jsonify({"message": "Product not found"}), 404
    
    if status not in possible_order_status:
        return jsonify({"message": "Status not valid. It must be 'Planned', 'In Progress', 'Completed', 'Cancelled'"}), 400


    new_order = Orders(
        order_number=order_number,
        customer=customer,
        product=product,
        quantity=quantity,
        date=date,
        status=status,
        notes=notes,
    )
    
    try:
        db.session.add(new_order)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    return jsonify({"message": "Order created!"}), 201



@app.route("/filter_orders",methods=["GET"])
def filter_orders():
     
    # data=request.json  Al ser una petición get, no puede tener cuerpo. Los parámetros se pasan en la URL. Este request.json lee el cuerpo de la petición
    
    possible_order_numbers=set([order.order_number for order in Orders.query.all()])
    possible_customers=set([order.customer for order in Orders.query.all()])
    possible_products=set([order.product for order in Orders.query.all()])
    possible_status=set([order.status for order in Orders.query.all()])
    filter_order_numbers = request.args.getlist("order_number") or possible_order_numbers
    filter_min_quantity = request.args.get("min_quantity", 0)
    filter_max_quantity = request.args.get("max_quantity", 1000000)
    start_filter_date = request.args.get("min_date", "1900-12-01")
    end_filter_date = request.args.get("max_date", "2100-12-01")
    

     

    if request.args.getlist("status")==['']:    
        filter_status=possible_status
    else:
        filter_status=request.args.getlist("status")[0].split(',')


    if request.args.getlist("product")==['']:
        filter_products=possible_products
    else:
        filter_products=request.args.getlist("product")[0].split(',')


    if request.args.getlist("customer")==['']:
        filter_customers=possible_customers
    else:
        filter_customers=request.args.getlist("customer")[0].split(',')

    
    for product in filter_products:
        if product not in possible_products:
            return jsonify({"message": "Product not found"}), 404    

    for status in filter_status:
        if status not in possible_status:
            return jsonify({"message": "Status not valid. It must be 'Planned', 'In Progress', 'Completed', 'Cancelled'"}), 400
    for customer in filter_customers:
        if customer not in possible_customers:
            return jsonify({"message": "Customer not found"}), 404
    for order_number in filter_order_numbers:
        if order_number not in possible_order_numbers:
            return jsonify({"message": "Order number not found"}), 404

    try:
        int(filter_min_quantity)
    except:
        return jsonify({"message": "Min quantity must be an integer"}), 400
    try:
        int(filter_max_quantity)
    except:
        return jsonify({"message": "Max quantity must be an integer"}), 400
    try:
        datetime.datetime.strptime(start_filter_date, '%Y-%m-%d')
    except:
        return jsonify({"message": "Start date must be in the format YYYY-MM-DD"}), 400
    try:
        datetime.datetime.strptime(end_filter_date, '%Y-%m-%d')
    except:
        return jsonify({"message": "End date must be in the format YYYY-MM-DD"}), 400
    




    date_condition = (
    Orders.date.between(start_filter_date, end_filter_date)
    if (start_filter_date != '1900-12-01' or end_filter_date != '2100-12-01')
    else or_(Orders.date.between(start_filter_date, end_filter_date), Orders.date.is_(None))
)

    # Build the query with the date condition included
    filtered_orders = Orders.query.filter(
        Orders.order_number.in_(filter_order_numbers),
        Orders.customer.in_(filter_customers),
        Orders.product.in_(filter_products),
        Orders.status.in_(filter_status),
        Orders.quantity.between(filter_min_quantity, filter_max_quantity),
        date_condition
    ).all()


    print('Order Numbers',filter_order_numbers)
    print('Product',filter_products)
    print('Customer',filter_customers)
    print('Status',filter_status)
    print('Min Quantity',filter_min_quantity)
    print('Max Quantity',filter_max_quantity)
    print('Start date',start_filter_date)
    print('End date',end_filter_date)
    print('Filtro fecha',Orders.query.filter(Orders.date.between(start_filter_date,end_filter_date),Orders.date.is_(None)).all())
    print('Fechas',Orders.query.with_entities(Orders.date).all())

    json_orders = list(map(lambda x: x.to_json(), filtered_orders))
    return jsonify({"orders": json_orders,"message":"Orders filtered succesfully"}),200
     



@app.route("/create_product", methods=["POST"])
def create_product():
    product_name = request.json.get("product_name")
    price = request.json.get("price")
    stock = request.json.get("stock")
    category = request.json.get("category")
    description = request.json.get("description")

    if not product_name or not price or not stock :
        return (
            jsonify({"message": "You must include product name, price, stock"}),
            400,
        )
    if price<0:
        return jsonify({"message": "Price must be a positive number"}), 400
    if stock<0:
        return jsonify({"message": "Stock must be a positive number"}), 400

    new_product = Products(
        product_name=product_name,
        price=price,
        stock=stock,
        category=category,
        description=description,
    )
    
    try:
        db.session.add(new_product)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    return jsonify({"message": "Product created!"}), 201



@app.route("/update_order/<int:order_number>", methods=["PATCH"])
def update_order(order_number):
    print(f'La API recibe el nº de orden {order_number}')
    order=Orders.query.get(order_number)

    if not order: 
        return jsonify({"message": "Order not found"}), 404

    data = request.json

    new_order_number=data.get("orderNumber",order_number)
    # Se comprueba que el cambio de número de pedido, en caso de haberlo, es válido
    if  str(new_order_number).strip()!=str(order_number).strip() and (new_order_number in [ord.order_number for ord in Orders.query.all()]):
         
         return (
            jsonify({"message": "The order number cannot be repeated",
                     "original_order_number":order_number,"new_order_number":new_order_number
                     }
                    ),
            400,
        )
    order.order_number=new_order_number
    order.customer = data.get("customer", order.customer)        
    order.product = data.get("product", order.product)
    order.quantity = data.get("quantity", order.quantity)
    order.date = data.get("date", order.date)
    order.status = data.get("status", order.status)
    order.notes = data.get("notes", order.notes)
    
    if order.product not in [product.product_name for product in Products.query.all()]:
        return jsonify({"message": "Product not found"}), 404
    if order.status not in possible_order_status:
        return jsonify({"message": "Status not valid. It must be 'Planned', 'In Progress', 'Completed', 'Cancelled'"}), 400

    db.session.commit()

    return jsonify({"message": "Order updated."}), 200








@app.route("/delete_order/<int:order_number>", methods=["DELETE"])
def delete_order(order_number):
    order = Orders.query.get(order_number)

    if not order:
        return jsonify({"message": "Order not found"}), 404

    db.session.delete(order)
    db.session.commit()

    return jsonify({"order": "Order deleted!"}), 200


@app.route('/delete_product/<int:product_id>',methods=['DELETE'])
def delete_product(product_id):
    product = Products.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 403

    db.session.delete(product)
    db.session.commit()

    return jsonify({"message": "Product deleted!"}), 200


if __name__ == "__main__":
    with app.app_context():
        db.create_all()#Initialize the database

    app.run(debug=True)
