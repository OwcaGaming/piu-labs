import loadTemplate from '../utils/loadTemplate.js';

const template = await loadTemplate('./components/product-card.html');

export default class ProductCard extends HTMLElement {
    constructor() {
        super();
        this.selectedSize = null;
        this.product = null;

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.render();
        const button = this.shadowRoot.querySelector('button');
        button.addEventListener('click', () => this.handleAddToCart());
    }

    setData(product) {
        this.product = product;
        this.render();
    }

    render() {
        if (!this.product) return;

        const shadow = this.shadowRoot;
        const name = this.product.name;
        const price = this.product.price;
        const image = this.product.image;
        const sizes = this.product.sizes;
        const promotion = this.product.promotion;

        shadow.querySelector('.name').textContent = name;
        shadow.querySelector('.price').textContent = price + ' zł';
        shadow.querySelector('img').src = image;
        shadow.querySelector('img').alt = name;

        const promotionEl = shadow.querySelector('.promotion');
        if (promotion) {
            promotionEl.textContent = promotion;
            promotionEl.style.display = 'block';
        } else {
            promotionEl.style.display = 'none';
        }

        const optionsContainer = shadow.querySelector('.options');
        optionsContainer.innerHTML = '';

        if (sizes && sizes.length > 0) {
            const sizeGroup = document.createElement('div');
            sizeGroup.className = 'option-group';
            sizeGroup.innerHTML =
                '<span class="option-label">Rozmiar:</span><div class="option-list"></div>';

            for (let size of sizes) {
                const sizeItem = document.createElement('div');
                sizeItem.className = 'option-item';
                sizeItem.textContent = size;

                sizeItem.addEventListener('click', () =>
                    this.selectSize(sizeItem, size),
                );

                sizeGroup.querySelector('.option-list').appendChild(sizeItem);
            }

            optionsContainer.appendChild(sizeGroup);
        }
    }

    selectSize(element, size) {
        const allSizeItems = this.shadowRoot.querySelectorAll('.option-item');
        for (let item of allSizeItems) {
            item.classList.remove('selected');
        }

        element.classList.add('selected');
        this.selectedSize = size;
    }

    handleAddToCart() {
        if (!this.selectedSize) {
            alert('Proszę wybrać rozmiar');
            return;
        }

        const productData = {
            id: this.product.id,
            name: this.product.name,
            price: this.product.price,
            size: this.selectedSize,
        };

        this.dispatchEvent(
            new CustomEvent('add-to-cart', {
                detail: productData,
                bubbles: true,
                composed: true,
            }),
        );
    }
}

customElements.define('product-card', ProductCard);
