import './components/product-card.js';
import './components/shopping-cart.js';
import './components/product-list.js';
import productsData from './data.json' with { type: 'json' };

const productList = document.querySelector('product-list');
const cart = document.querySelector('shopping-cart');

productList.setProducts(productsData);

document.addEventListener('add-to-cart', (event) => {
    const product = event.detail;
    cart.addItem(product);
    console.log('Dodano do koszyka:', product);
});
