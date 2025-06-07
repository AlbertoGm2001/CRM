from flask import request, jsonify
from config import app, db
from models import *


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
    status = request.json.get("status")
    notes = request.json.get("notes")

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
    order=Orders.query.get(order_number)

    if not order: 
        return jsonify({"message": "Order not found"}), 404

    data = request.json
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
