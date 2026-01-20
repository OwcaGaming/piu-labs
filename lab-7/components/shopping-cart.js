import loadTemplate from '../utils/loadTemplate.js';

const template = await loadTemplate('./components/shopping-cart.html');

export default class ShoppingCart extends HTMLElement {
    constructor() {
        super();
        this.items = [];

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.setupClearButton();
    }

    addItem(product) {
        this.items.push(product);
        this.updateDisplay();
    }

    removeItem(index) {
        this.items.splice(index, 1);
        this.updateDisplay();
    }

    clearCart() {
        this.items = [];
        this.updateDisplay();
    }

    updateDisplay() {
        const shadow = this.shadowRoot;
        const itemsContainer = shadow.querySelector('.cart-items');
        const itemCount = shadow.querySelector('.item-count');
        const totalPrice = shadow.querySelector('.total-price');
        const clearBtn = shadow.querySelector('.clear-cart-btn');

        if (this.items.length === 0) {
            itemsContainer.innerHTML =
                '<div class="cart-empty">Koszyk jest pusty</div>';
            itemCount.textContent = '0';
            totalPrice.textContent = '0 zł';
            clearBtn.style.display = 'none';
        } else {
            itemsContainer.innerHTML = '';
            let total = 0;

            for (let i = 0; i < this.items.length; i++) {
                const item = this.items[i];
                total = total + item.price;

                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';

                let sizeText = '';
                if (item.size) {
                    sizeText =
                        '<div class="item-options">Rozmiar: ' +
                        item.size +
                        '</div>';
                }

                itemEl.innerHTML = `
          <div class="item-details">
            <div class="item-name">${item.name}</div>
            ${sizeText}
            <div class="item-price">${item.price} zł</div>
          </div>
          <button class="remove-btn" data-index="${i}">Usuń</button>
        `;

                const removeBtn = itemEl.querySelector('.remove-btn');
                removeBtn.addEventListener('click', (event) => {
                    const index = parseInt(event.target.dataset.index);
                    this.removeItem(index);
                });

                itemsContainer.appendChild(itemEl);
            }

            itemCount.textContent = this.items.length;
            totalPrice.textContent = total + ' zł';
            clearBtn.style.display = 'block';
        }
    }

    setupClearButton() {
        const clearBtn = this.shadowRoot.querySelector('.clear-cart-btn');
        clearBtn.addEventListener('click', () => {
            const sure = confirm('Na pewno chcesz opróżnić koszyk?');
            if (sure) {
                this.clearCart();
            }
        });
    }
}

customElements.define('shopping-cart', ShoppingCart);
