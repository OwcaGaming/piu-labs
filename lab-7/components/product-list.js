import loadTemplate from '../utils/loadTemplate.js';
import ProductCard from './product-card.js';

const template = await loadTemplate('./components/product-list.html');

export default class ProductList extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));
    }

    setProducts(products) {
        const grid = this.shadowRoot.querySelector('.products-grid');
        grid.innerHTML = '';

        for (let product of products) {
            const card = document.createElement('product-card');
            card.setData(product);
            grid.appendChild(card);
        }
    }
}

customElements.define('product-list', ProductList);
