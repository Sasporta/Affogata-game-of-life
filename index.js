// global variables
const gridRowAndColNum = 1000;
const populationcCounter = 0;
let grid;
const randomizer = (maxNum = 255) => Math.floor(Math.random() * maxNum);

// inition 
const init = () => {
    grid = createGrid(gridRowAndColNum);
    const firstCell = chooseFirstCell(gridRowAndColNum, randomizer);
    activateCell(grid, gridRowAndColNum, firstCell, activateCellSurrounding);
    const secondCell = chooseSecondCell(grid, gridRowAndColNum, firstCell, randomizer, locationRandomizer);
    activateCell(grid, gridRowAndColNum, secondCell, activateCellSurrounding);
    populationCounter(grid, gridRowAndColNum, populationcCounter);
};

// creat the grid 
//*** I chose object structure because I thought it will be more convenient - keys are easier to understand than indexes in my opinion 
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

// choose the first cell's loacation and color
const chooseFirstCell = (maxSize, randomizer) => {
    const color = { r: randomizer(), g: randomizer(), b: randomizer() };
    const y = randomizer(maxSize);
    const x = randomizer(maxSize);
    return { y, x, color };
};

// choose the second cell's loacation and color, also making sure it's within matrix borders, different location from the first cell and next to it
const chooseSecondCell = (grid, maxSize, firstCell, randomizer, locationRandomizer) => {
    const color = { r: randomizer(), b: randomizer(), g: randomizer() };
    const { y, x } = firstCell;
    const otherY = locationRandomizer(randomizer(2), y);
    const otherX = locationRandomizer(randomizer(2), x);
    if (otherY === y && otherX === x || otherY > maxSize || otherY < 0 || otherX > maxSize || otherX < 0) {
        return chooseSecondCell(grid, maxSize, firstCell, randomizer, locationRandomizer);
    };
    return { y: otherY, x: otherX, color };
};

// generate random x / y for the  chooseSecondCell function
const locationRandomizer = (num, position) => {
    if (num === 0) { return position };
    if (num === 1) { return position - 1 };
    if (num === 2) { return position + 1 };
};

// checking that the cell is within borders and is dormant, if so, activate it and check its surroundings by order (clockwise)
const activateCell = async (grid, maxSize, cell, activateCellSurrounding) => {
    const { y, x, color } = cell;
    if (y < maxSize && y >= 0 && x < maxSize && x >= 0) {
        if (grid[y][x].state === 'dormant') {
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

// checking if there are any active cells already surrounding the activated cell
// first checks if the loaction is within border, then if the cell is active, if so, activate other cells that are next to both of the matched cells 
const activateCellSurrounding = async (grid, maxSize, color1, y1, x1, y2, x2) => {
    if (y2 < maxSize && y2 >= 0 && x2 < maxSize && x2 >= 0) {
        if (grid[y2][x2].state === 'active') {
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

// call populationLogger function every 3 seconds, if the grid is full, stop the logging 
const populationCounter = (grid, maxSize, count) => {
    const gridIsFull = setInterval(() => {
        const population = populationLogger(grid, maxSize, count);
        const gridSize = maxSize*maxSize;
        if (population === gridSize){ clearInterval(gridIsFull) };
    },3000);
};

// check how many cells are activated and log it
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

// initiating everithing
init();


