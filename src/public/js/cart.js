document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.delete-products').forEach(button => {
        button.addEventListener('click', async (event) => {
            const cartId = event.target.getAttribute('cart-id');

            try {
                const response = await fetch(`/api/carts/cart/${cartId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if(!response.ok){
                    throw new Error('Error al eliminar los productos del carrito');
                }

                const result = await response.json();
                alert("Productos eliminados del carrito correctamente. Recargar pagina para ver cambios.");
                console.log('Productos eliminados del carrito correctamente', result);
            } catch (error) {
                console.error("Error al eliminar los productos del carrito:", error);
            }
        });
    });

    document.querySelectorAll('.sort-button').forEach(button => {
        button.addEventListener('click', () => {
            const order = button.getAttribute('data-order');
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('order', order);
            window.location.href = currentUrl.toString();
        });
    });
    
    document.querySelectorAll('.description').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.getAttribute('data-product-id');
            window.location.href = `/products/${productId}`;
        });
    });
});