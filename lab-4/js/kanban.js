(function () {
    const STORAGE_KEY = 'piu-kanban-v1';
    const boardEl = document.getElementById('board');
    const columnsMeta = [
        { id: 'todo', title: 'Do zrobienia' },
        { id: 'doing', title: 'W trakcie' },
        { id: 'done', title: 'Zrobione' },
    ];

    let state = { columns: {}, order: columnsMeta.map((c) => c.id), sort: {} };

    function randColor() {
        const h = Math.floor(Math.random() * 360);
        const s = 60 + Math.floor(Math.random() * 15);
        const l = 70 - Math.floor(Math.random() * 10);
        return `hsl(${h} ${s}% ${l}%)`;
    }

    function uid() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }

    function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
    function load() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try {
                state = JSON.parse(raw);
            } catch (e) {
                console.warn('Bad state, resetting', e);
                initEmpty();
            }
        } else initEmpty();
    }
    function initEmpty() {
        state = { columns: {}, order: columnsMeta.map((c) => c.id), sort: {} };
        columnsMeta.forEach((c) => (state.columns[c.id] = []));
    }

    function render() {
        boardEl.innerHTML = '';
        columnsMeta.forEach((col, idx) => {
            const wrapper = document.createElement('section');
            wrapper.className = 'column';
            wrapper.dataset.col = col.id;

            const header = document.createElement('div');
            header.className = 'col-header';
            const title = document.createElement('div');
            title.className = 'col-title';
            title.textContent = col.title;
            const actions = document.createElement('div');
            actions.className = 'col-actions';

            const count = document.createElement('span');
            count.className = 'counter small';
            count.textContent = (state.columns[col.id] || []).length + ' kart';

            const addBtn = document.createElement('button');
            addBtn.className = 'add-card-btn';
            addBtn.textContent = 'Dodaj kartę';
            addBtn.dataset.action = 'add';
            const colorBtn = document.createElement('button');
            colorBtn.className = 'color-btn';
            colorBtn.textContent = 'Koloruj kolumnę';
            colorBtn.dataset.action = 'color-col';
            const sortBtn = document.createElement('button');
            sortBtn.className = 'sort-btn';
            sortBtn.textContent =
                state.sort[col.id] === 'asc' ? 'Sortuj ↓' : 'Sortuj ↑';
            sortBtn.dataset.action = 'sort-col';

            actions.appendChild(colorBtn);
            actions.appendChild(sortBtn);
            actions.appendChild(addBtn);

            header.appendChild(title);
            header.appendChild(actions);

            const body = document.createElement('div');
            body.className = 'col-body';
            body.dataset.col = col.id;

            const cards = state.columns[col.id] || [];
            cards.forEach((card) => body.appendChild(renderCard(card, col.id)));

            const footer = document.createElement('div');
            footer.className = 'col-footer';
            const counter = document.createElement('div');
            counter.className = 'small';
            counter.textContent = `Liczba kart: ${cards.length}`;
            footer.appendChild(counter);

            wrapper.appendChild(header);
            wrapper.appendChild(body);
            wrapper.appendChild(footer);

            boardEl.appendChild(wrapper);
        });

        attachDelegation();
    }

    function renderCard(card, colId) {
        const el = document.createElement('article');
        el.className = 'card';
        el.dataset.id = card.id;
        el.style.background = card.color || randColor();

        const del = document.createElement('button');
        del.className = 'delete';
        del.title = 'Usuń kartę';
        del.innerHTML = '✕';
        del.dataset.action = 'delete';

        const content = document.createElement('div');
        content.className = 'content';
        content.contentEditable = true;
        content.spellcheck = false;
        content.innerText = card.text || 'Nowa karta';
        content.addEventListener(
            'input',
            debounce(() => {
                card.text = content.innerText.trim();
                save();
            }, 350)
        );
        content.addEventListener('blur', () => {
            card.text = content.innerText.trim();
            save();
        });

        const controls = document.createElement('div');
        controls.className = 'card-controls';
        const left = document.createElement('button');
        left.className = 'move-btn';
        left.textContent = '←';
        left.title = 'Przenieś w lewo';
        left.dataset.action = 'move-left';
        const right = document.createElement('button');
        right.className = 'move-btn';
        right.textContent = '→';
        right.title = 'Przenieś w prawo';
        right.dataset.action = 'move-right';
        const colorSingle = document.createElement('button');
        colorSingle.className = 'color-btn';
        colorSingle.textContent = 'Koloruj';
        colorSingle.title = 'Zmień kolor karty';
        colorSingle.dataset.action = 'color-card';

        controls.appendChild(left);
        controls.appendChild(right);
        controls.appendChild(colorSingle);

        el.appendChild(del);
        el.appendChild(content);
        el.appendChild(controls);

        requestAnimationFrame(() => el.classList.add('added'));
        setTimeout(() => el.classList.remove('added'), 350);

        return el;
    }

    function attachDelegation() {
        const el = document.getElementById('board');
        if (!el) return;
        if (el._kanbanDelegated) return;

        el.addEventListener('click', function (e) {
            const target = e.target;
            const action = target.dataset.action;
            if (!action) return;

            const colEl = target.closest('.column');
            const colId = colEl && colEl.dataset.col;

            if (action === 'add') {
                const newCard = {
                    id: uid(),
                    text: 'Nowa karta',
                    color: randColor(),
                };
                state.columns[colId].push(newCard);
                save();
                render();
                focusCard(newCard.id);
            } else if (action === 'color-col') {
                const cards = state.columns[colId] || [];
                cards.forEach((c) => (c.color = randColor()));
                save();
                render();
            } else if (action === 'sort-col') {
                const cur = state.sort[colId] === 'asc' ? 'desc' : 'asc';
                state.sort[colId] = cur;
                state.columns[colId].sort((a, b) => {
                    const ta = (a.text || '').toLowerCase();
                    const tb = (b.text || '').toLowerCase();
                    if (ta === tb) return 0;
                    return cur === 'asc'
                        ? ta < tb
                            ? -1
                            : 1
                        : ta < tb
                        ? 1
                        : -1;
                });
                save();
                render();
            } else if (action === 'delete') {
                const cardEl = target.closest('.card');
                if (!cardEl) return;
                const id = cardEl.dataset.id;
                removeCardById(id);
                save();
                render();
            } else if (action === 'move-left' || action === 'move-right') {
                const cardEl = target.closest('.card');
                if (!cardEl) return;
                const id = cardEl.dataset.id;
                moveCard(id, action === 'move-left' ? -1 : 1);
                save();
                render();
            } else if (action === 'color-card') {
                const cardEl = target.closest('.card');
                if (!cardEl) return;
                const id = cardEl.dataset.id;
                const card = findCardById(id);
                if (!card) return;
                card.color = randColor();
                save();
                render();
            }
        });

        el._kanbanDelegated = true;
    }

    const clearBtn = document.getElementById('clear-all');
    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            if (
                !confirm(
                    'Czy na pewno usunąć wszystkie karty? Ta operacja nie może zostać cofnięta.'
                )
            )
                return;
            for (const col in state.columns) state.columns[col] = [];
            save();
            render();
        });
    }

    function removeCardById(id) {
        for (const col in state.columns) {
            const idx = state.columns[col].findIndex((c) => c.id === id);
            if (idx >= 0) {
                state.columns[col].splice(idx, 1);
                return true;
            }
        }
        return false;
    }
    function findCardById(id) {
        for (const col in state.columns) {
            const c = state.columns[col].find((x) => x.id === id);
            if (c) return c;
        }
        return null;
    }
    function moveCard(id, dir) {
        const colIds = Object.keys(state.columns);
        for (let i = 0; i < colIds.length; i++) {
            const colId = colIds[i];
            const idx = state.columns[colId].findIndex((c) => c.id === id);
            if (idx >= 0) {
                const [card] = state.columns[colId].splice(idx, 1);
                const newIdx = Math.min(
                    Math.max(0, i + dir),
                    colIds.length - 1
                );
                state.columns[colIds[newIdx]].push(card);
                return true;
            }
        }
        return false;
    }

    function focusCard(id) {
        setTimeout(() => {
            const el = document.querySelector(
                `.card[data-id="${id}"] .content`
            );
            if (el) {
                el.focus();
                placeCaretAtEnd(el);
            }
        }, 50);
    }

    function placeCaretAtEnd(el) {
        el.focus();
        if (
            typeof window.getSelection !== 'undefined' &&
            typeof document.createRange !== 'undefined'
        ) {
            const range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
    function debounce(fn, t) {
        let to;
        return function () {
            clearTimeout(to);
            to = setTimeout(() => fn.apply(this, arguments), t);
        };
    }

    load();
    render();

    window._kanban_state = state;
})();
