# Instrucciones de Uso

## Entrega Final

**Se crean dos tipos de rutas (app y api):**

1. **Rutas APP: estas estan encargadas de renderizar los productos tanto por HTTP como por Webscokets. Asi estan definidas:**  

    * ``http://localhost:8080`` :Esta dirección se muestra todos los productos con su respectiva paginación y con la posibilidad de agregarlos al carrito.
    * ``http://localhost:8080/cart-products/(id_carrito)`` : Esta dirección muestra los productos que tiene el carrito en especifico. Asi se puede comprobar que el producto anteriormente agregado, se incluyo correctamente.
    * ``http://localhost:8080/real-time-products`` :Esta dirección es por medio de Websockets, lo que permite ver la lista de productos en tiempo real. Esta dirección tambien permitira guardar un nuevo producto y asi mismo contara con un boton para eliminarlo.
    * ``http://localhost:8080/products/(id_producto)`` :Esta direccion permite al usuario observar la información del producto que se le pase por su id.  

2. **Rutas API: estas rutas se generan para gestionar tanto el producto y el carrito en el POSTMAN**  

    * **API/PRODUCTS**
    
        * Al momento de ingresar a la siguiente dirección esta solo mostrara un limite de 10 productos que esten en la base de datos, con su respectiva paginación.  

            http://localhost:8080/api/products

        * Se puede ingresar también por query params lo siguiente: `limit`, `page`, `category` y para ordenar por medio del precio `order`. Direcciones de ejemplo:  

            * http://localhost:8080/api/products?limit=10&page=1&order=desc&category=Especias  

            * http://localhost:8080/api/products?category=Frutas

        * Metodo POST para agregar un producto.  

            http://localhost:8080/api/products

        * Metodo PUT para actualizar uno o varios datos del producto.

            http://localhost:8080/api/products/(id_producto)

        * Metodo DELETE para borrar un producto.

            http://localhost:8080/api/products/(id_producto)

    * **API/CARTS**  

        * Metodo GET para obtener todos los carritos.

            http://localhost:8080/api/carts

        * Metodo GET con POPULATE que trae más informacion de los productos.

            http://localhost:8080/api/carts/(id_carrito)
        
        * Metodo POST para crear un carrito.

            http://localhost:8080/api/carts

        * Metodo POST para poder insertar la cantidad de un producto a un carrito.  

            http://localhost:8080/api/carts/(id_carrito)/product/(id_producto)  

            Body:  
            ```
            {
                "quantity": "6"
            }       
            ```

        * Método PUT para actualizar el carrito con un arreglo de productos.  

            http://localhost:8080/api/carts/(id_carrito)  
            Body: 
            ```
            {
                "products": [
                    {
                    "productId": "6685853c5b33ce0bf9ddbcad",
                    "quantity": 6
                    },
                    {
                    "productId": "668574e15b33ce0bf9d4d698",
                    "quantity": 2
                    },
                    {
                    "productId": "6685853c5b33ce0bf9ddbcb7",
                    "quantity": 19
                    }
                ]
            }
            ```
        
        * Metodo PUT para actulizar la cantidad de ejemplares del producto.

            http://localhost:8080/api/carts/(id_carrito)/products/(id_producto)  
            Body:
            ```
            {
                "quantity": "3"
            }       
            ```

        * Metodo DELETE para eliminar un carrito.

            http://localhost:8080/api/carts/(id_carrito)

        * Metodo DELETE para eliminar del carrito un producto seleccionado.

            http://localhost:8080/api/carts/(id_carrito)/products/(id_producto)

        * Metodo DELETE para eliminar todos los productos del carrito.  

            http://localhost:8080/api/carts/cart/(id_carrito)