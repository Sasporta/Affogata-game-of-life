const gridRowAndColNum = 1000;
const populationcCounter = 0;
let grid;
const randomizer = (maxNum = 255) => Math.floor(Math.random() * maxNum);

const init = () => {
    grid = createGrid(gridRowAndColNum);
    const firstCell = chooseFirstCell(gridRowAndColNum, randomizer);
    activateCell(grid, gridRowAndColNum, firstCell, activateCellSurrounding);
    const secondCell = chooseSecondCell(grid, gridRowAndColNum, firstCell, randomizer, locationRandomizer);
    activateCell(grid, gridRowAndColNum, secondCell, activateCellSurrounding);
    populationCounter(grid, gridRowAndColNum, populationcCounter);
};

const createGrid = (gridSize) => {
    const grid = {};
    for (let row = 0; row < gridSize; row++) {
        grid[row] = {};
        for (let col = 0; col < gridSize; col++) {
            grid[row][col] = { state: 'dormant', color: 'none' };
        };
    };
    return grid;
};

const chooseFirstCell = (maxSize, randomizer) => {
    const color = { r: randomizer(), g: randomizer(), b: randomizer() };
    const y = randomizer(maxSize);
    const x = randomizer(maxSize);
    return { y, x, color };
};

const chooseSecondCell = (grid, maxSize, firstCell, randomizer, locationRandomizer) => {
    const color = { r: randomizer(), b: randomizer(), g: randomizer() };
    const { y, x } = firstCell;
    const otherY = locationRandomizer(randomizer(2), y);
    const otherX = locationRandomizer(randomizer(2), x);
    if (otherY === y && otherX === x || otherY > maxSize || otherY < 0 || otherX > maxSize || otherX < 0) {
        return chooseSecondCell(grid, maxSize, firstCell, randomizer, locationRandomizer)
    };
    return { y: otherY, x: otherX, color };
};

const locationRandomizer = (num, position) => {
    if (num === 0) { return position };
    if (num === 1) { return position - 1 };
    if (num === 2) { return position + 1 };
};


const activateCell = async (grid, maxSize, cell, activateCellSurrounding) => {
    const { y, x, color } = cell;
    if (y < maxSize && y >= 0 && x < maxSize && x >= 0) {
        if (grid[y][x].state === 'dormant') {
            // console.log('~~~~~~~activateCell', y, x);
            grid[y][x] = { state: 'active', color: color };
            await setTimeout(activateCellSurrounding, 500, grid, maxSize, color, y, x, y - 1, x); 
            await setTimeout(activateCellSurrounding, 500, grid, maxSize, color, y, x, y - 1, x + 1);
            await setTimeout(activateCellSurrounding, 500, grid, maxSize, color, y, x, y, x + 1);
            await setTimeout(activateCellSurrounding, 500, grid, maxSize, color, y, x, y + 1, x + 1);
            await setTimeout(activateCellSurrounding, 500, grid, maxSize, color, y, x, y + 1, x);
            await setTimeout(activateCellSurrounding, 500, grid, maxSize, color, y, x, y + 1, x - 1);
            await setTimeout(activateCellSurrounding, 500, grid, maxSize, color, y, x, y, x - 1);
            await setTimeout(activateCellSurrounding, 500, grid, maxSize, color, y, x, y - 1, x - 1);
        }
    }
    return;
};

const activateCellSurrounding = async (grid, maxSize, color1, y1, x1, y2, x2) => {
    // console.log(y1, x1, 'befor active check', y2, x2);
    if (y2 < maxSize && y2 >= 0 && x2 < maxSize && x2 >= 0) {
        if (grid[y2][x2].state === 'active') {
            // console.log(y1, x1, 'after active check', y2, x2);
            const colorDecider = (colorA, colorB) => Math.round(Math.random()) ? colorA : colorB;
            const color2 = grid[y2][x2].color;
            if (y1 === y2) {
                if (y1 + 1 < maxSize) {
                    if (grid[y1 + 1][x1].state === 'dormant') {
                        const chosenColor = colorDecider(color1, color2);
                        const cell = { y: y1 + 1, x: x1, color: chosenColor };
                        await activateCell(grid, maxSize, cell, activateCellSurrounding);
                    };
                    if (grid[y1 + 1][x2].state === 'dormant') {
                        const chosenColor = colorDecider(color1, color2);
                        const cell = { y: y1 + 1, x: x2, color: chosenColor };
                        await activateCell(grid, maxSize, cell, activateCellSurrounding);
                    };
                };
                if (y1 - 1 >= 0) {
                    if (grid[y1 - 1][x1].state === 'dormant') {
                        const chosenColor = colorDecider(color1, color2);
                        const cell = { y: y1 - 1, x: x1, color: chosenColor };
                        await activateCell(grid, maxSize, cell, activateCellSurrounding);
                    };
                    if (grid[y1 - 1][x2].state === 'dormant') {
                        const chosenColor = colorDecider(color1, color2);
                        const cell = { y: y1 - 1, x: x2, color: chosenColor };
                        await activateCell(grid, maxSize, cell, activateCellSurrounding);
                    };
                };
            }
            else if (x1 === x2) {
                if (x1 + 1 < maxSize) {
                    if (grid[y1][x1 + 1].state === 'dormant') {
                        const chosenColor = colorDecider(color1, color2);
                        const cell = { y: y1, x: x1 + 1, color: chosenColor };
                        await activateCell(grid, maxSize, cell, activateCellSurrounding);
                    };
                    if (grid[y2][x1 + 1].state === 'dormant') {
                        const chosenColor = colorDecider(color1, color2);
                        const cell = { y: y2, x: x1 + 1, color: chosenColor };
                        await activateCell(grid, maxSize, cell, activateCellSurrounding);
                    };
                };
                if (x1 - 1 >= 0) {
                    if (grid[y1][x1 - 1].state === 'dormant') {
                        const chosenColor = colorDecider(color1, color2);
                        const cell = { y: y1, x: x1 - 1, color: chosenColor };
                        await activateCell(grid, maxSize, cell, activateCellSurrounding);
                    };
                    if (grid[y2][x1 - 1].state === 'dormant') {
                        const chosenColor = colorDecider(color1, color2);
                        const cell = { y: y2, x: x1 - 1, color: chosenColor };
                        await activateCell(grid, maxSize, cell, activateCellSurrounding);
                    };
                };
            }
            else if (y1 === y2 + 1) {
                if (grid[y1 - 1][x1].state === 'dormant') {
                    const chosenColor = colorDecider(color1, color2);
                    const cell = { y: y1 - 1, x: x1, color: chosenColor };
                    await activateCell(grid, maxSize, cell, activateCellSurrounding);
                };
            }
            else if (y1 === y2 - 1) {
                if (grid[y1 + 1][x1].state === 'dormant') {
                    const chosenColor = colorDecider(color1, color2);
                    const cell = { y: y1 + 1, x: x1, color: chosenColor };
                    await activateCell(grid, maxSize, cell, activateCellSurrounding);
                };
            };
            if (grid[y1][x2].state === 'dormant') {
                const chosenColor = colorDecider(color1, color2);
                const cell = { y: y1, x: x2, color: chosenColor };
                await activateCell(grid, maxSize, cell, activateCellSurrounding);
            };
        }
    }
    return;
};

const populationCounter = (grid, maxSize, count) => {
    const gridIsFull = setInterval(() => {
        const population = populationLogger(grid, maxSize, count);
        const gridSize = maxSize*maxSize;
        if (population === gridSize){ clearInterval(gridIsFull) };
    },3000);
};

const populationLogger = (grid, maxSize, counter) => {
    for (let row = 0; row < maxSize; row++) {
        for (let col = 0; col < maxSize; col++) {
            if(grid[row][col].state === 'active'){
                counter++;
            };
        };
    };
    console.log('Cell population: ', counter);
    return counter;
};

init();


