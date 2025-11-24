import { generateId, getRandomColor } from './helpers.js';

class Store {
    #state = {
        shapes: [],
    };

    #subscribers = new Map();

    constructor() {
        this.#loadFromLocalStorage();
    }

    getShapes() {
        return this.#state.shapes;
    }

    getCounters() {
        return {
            squares: this.#state.shapes.filter((s) => s.type === 'square')
                .length,
            circles: this.#state.shapes.filter((s) => s.type === 'circle')
                .length,
        };
    }

    addShape(type) {
        if (type !== 'square' && type !== 'circle') return;

        const newShape = {
            id: generateId(),
            type,
            color: getRandomColor(),
        };

        this.#state.shapes.push(newShape);
        this.#notify(['shapes', 'counters']);
        this.#saveToLocalStorage();
    }

    removeShape(id) {
        const index = this.#state.shapes.findIndex((s) => s.id === id);
        if (index !== -1) {
            this.#state.shapes.splice(index, 1);
            this.#notify(['shapes', 'counters']);
            this.#saveToLocalStorage();
        }
    }

    changeSquareColor() {
        const squares = this.#state.shapes.filter((s) => s.type === 'square');
        squares.forEach((s) => {
            s.color = getRandomColor();
        });
        if (squares.length > 0) {
            this.#notify(['shapes']);
            this.#saveToLocalStorage();
        }
    }

    changeCircleColor() {
        const circles = this.#state.shapes.filter((s) => s.type === 'circle');
        circles.forEach((s) => {
            s.color = getRandomColor();
        });
        if (circles.length > 0) {
            this.#notify(['shapes']);
            this.#saveToLocalStorage();
        }
    }

    subscribe(keys, callback) {
        const keyArray = Array.isArray(keys) ? keys : [keys];

        keyArray.forEach((key) => {
            if (!this.#subscribers.has(key)) {
                this.#subscribers.set(key, new Set());
            }
            this.#subscribers.get(key).add(callback);
        });

        const data = {};
        keyArray.forEach((key) => {
            if (key === 'shapes') data.shapes = this.getShapes();
            if (key === 'counters') data.counters = this.getCounters();
        });
        callback(data);

        return () => {
            keyArray.forEach((key) => {
                this.#subscribers.get(key).delete(callback);
            });
        };
    }

    #notify(keys) {
        const keyArray = Array.isArray(keys) ? keys : [keys];

        keyArray.forEach((key) => {
            const set = this.#subscribers.get(key);
            if (set) {
                let data = {};
                if (key === 'shapes') data.shapes = this.getShapes();
                if (key === 'counters') data.counters = this.getCounters();

                for (const cb of set) {
                    cb(data);
                }
            }
        });
    }

    #saveToLocalStorage() {
        try {
            localStorage.setItem('shapes-store', JSON.stringify(this.#state));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }

    #loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('shapes-store');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.shapes && Array.isArray(parsed.shapes)) {
                    this.#state.shapes = parsed.shapes;
                }
            }
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
            this.#state.shapes = [];
        }
    }

    getState() {
        return JSON.parse(JSON.stringify(this.#state));
    }
}

export const store = new Store();
