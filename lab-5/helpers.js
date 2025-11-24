function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

export function getRandomColor() {
    const colors = [
        '#FF6B6B',
        '#4ECDC4',
        '#45B7D1',
        '#FFA07A',
        '#98D8C8',
        '#F7DC6F',
        '#BB8FCE',
        '#85C1E2',
        '#F8B88B',
        '#52C9A8',
        '#FF8C94',
        '#A8D8EA',
        '#FFB347',
        '#87CEEB',
        '#FFB6C1',
        '#DDA0DD',
        '#98FB98',
        '#FFD700',
        '#FFA500',
        '#20B2AA',
    ];
    return colors[random(0, colors.length)];
}

let idCounter = 0;
export function generateId() {
    return `shape-${idCounter++}-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
}

export function resetIdCounter() {
    idCounter = 0;
}
