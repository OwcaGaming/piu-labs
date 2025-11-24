import { store } from './store.js';

let containerEl;
let squaresCountEl;
let circlesCountEl;
let addSquareBtn;
let addCircleBtn;
let changeSquareColorBtn;
let changeCircleColorBtn;

export function initUI() {
    containerEl = document.querySelector('#shapes-container');
    squaresCountEl = document.querySelector('#squares-count');
    circlesCountEl = document.querySelector('#circles-count');
    addSquareBtn = document.querySelector('#add-square');
    addCircleBtn = document.querySelector('#add-circle');
    changeSquareColorBtn = document.querySelector('#change-square-color');
    changeCircleColorBtn = document.querySelector('#change-circle-color');

    containerEl.addEventListener('click', handleShapeClick);

    addSquareBtn.addEventListener('click', () => store.addShape('square'));
    addCircleBtn.addEventListener('click', () => store.addShape('circle'));
    changeSquareColorBtn.addEventListener('click', () =>
        store.changeSquareColor()
    );
    changeCircleColorBtn.addEventListener('click', () =>
        store.changeCircleColor()
    );

    store.subscribe('shapes', (data) => {
        renderShapes(data.shapes);
    });

    store.subscribe('counters', (data) => {
        updateCounters(data.counters);
    });
}

function handleShapeClick(event) {
    const shapeEl = event.target.closest('[data-shape-id]');
    if (shapeEl) {
        const shapeId = shapeEl.getAttribute('data-shape-id');
        store.removeShape(shapeId);
    }
}

function renderShapes(shapes) {
    const existingIds = new Set();
    const existingEls = containerEl.querySelectorAll('[data-shape-id]');

    existingEls.forEach((el) => {
        const id = el.getAttribute('data-shape-id');
        existingIds.add(id);
    });

    const currentIds = new Set(shapes.map((s) => s.id));

    existingEls.forEach((el) => {
        const id = el.getAttribute('data-shape-id');
        if (!currentIds.has(id)) {
            el.remove();
        }
    });

    shapes.forEach((shape) => {
        let shapeEl = containerEl.querySelector(
            `[data-shape-id="${shape.id}"]`
        );

        if (!shapeEl) {
            shapeEl = document.createElement('div');
            shapeEl.setAttribute('data-shape-id', shape.id);
            shapeEl.className = `shape ${shape.type}`;
            containerEl.appendChild(shapeEl);
        }

        shapeEl.style.backgroundColor = shape.color;
        shapeEl.className = `shape ${shape.type}`;
    });
}

function updateCounters(counters) {
    squaresCountEl.textContent = counters.squares;
    circlesCountEl.textContent = counters.circles;
}
