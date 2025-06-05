
#En este fichero se define la BBDD y se activa el servidor de la API.
#El Flask_Cors permite a la API recibir peticiones de cualquier origen.  

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False




db = SQLAlchemy(app)