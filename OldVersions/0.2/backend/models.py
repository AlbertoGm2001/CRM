#En este script se definirán como clases todos los objetos del CRM
#Cada objeto será en casi todos los casos la row key de una tabla de la BBDD

#Se empieza definiendo el objeto de Pedidos, pero más adelante se deberán añadir objetos como productos, clientes, etc.

from config import db
#Now we initializae the database tables Orders and Products








#We define the possible order status

possible_order_status = ['Planned', 'In Progress', 'Completed', 'Cancelled']





class Products(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(80), unique=True, nullable=False)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(80), nullable=False)

    def to_json(self):
        return {
            'id': self.id,
            'product_name': self.product_name,
            'price': self.price,
            'stock': self.stock,
            'category': self.category,
            'description': self.description}

    def __repr__(self):
        return f'<Product {self.product_name}>'

class Orders(db.Model):
    order_number = db.Column(db.String(80), primary_key=True)
    customer = db.Column(db.String(80), nullable=False)
    product = db.Column(db.String(80),db.ForeignKey('products.product_name'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    date = db.Column(db.String(80))
    status = db.Column(db.String(80), default='Planned')
    notes = db.Column(db.String(80))



    def to_json(self):
        return {
            'order_number': self.order_number,
            'customer': self.customer,
            'product': self.product,
            'quantity': self.quantity,
            'date': self.date,
            'status': self.status,
            'notes': self.notes}

    def __repr__(self):
        return f'<Order {self.order_number}>'
    
