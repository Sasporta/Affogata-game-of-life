// global variables
const gridRowAndColNum = 100;
const populationcCounter = 0;
let grid;
const randomizer = (maxNum = 255) => Math.floor(Math.random() * maxNum);

// inition 
const init = () => {
    grid = createGrid(gridRowAndColNum);
    const secondCell = createFirstTwoCells(grid, gridRowAndColNum, randomizer, locationRandomizer);
    activateCell(grid, gridRowAndColNum, secondCell, activateCellSurrounding);
    populationCounter(grid, gridRowAndColNum, populationcCounter);
};

// creat the grid 
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

// create the first cell and activate it, then create the second cell
const createFirstTwoCells = (grid, maxSize, randomizer, locationRandomizer) => {
    const y1 = randomizer(maxSize);
    const x1 = randomizer(maxSize);
    grid[y1][x1] = { state: 'active', color: { r: randomizer(), g: randomizer(), b: randomizer() } };
    const { y2, x2 } = generateUniqueLocation(y1, x1, maxSize, randomizer, locationRandomizer);
    return { y: y2, x: x2, color: { r: randomizer(), g: randomizer(), b: randomizer() } };
};

// generate unique and in matrix borders values for the second cell's location
const generateUniqueLocation = (y1, x1, maxSize, randomizer, locationRandomizer) => {
    const y2 = locationRandomizer(randomizer(2), y1);
    const x2 = locationRandomizer(randomizer(2), x1);
    if (y2 === y1 && x2 === x1 || y2 > maxSize || y2 < 0 || x2 > maxSize || x2 < 0) {
        return generateUniqueLocation(y1, x1, maxSize, randomizer, locationRandomizer);
    };
    return { y2, x2 };
};

// generate random yet next to the first cell's location x / y for the second cell
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
            const gridSize = maxSize * maxSize;
            if (population === gridSize) { clearInterval(gridIsFull) };
        }, 3000);
    };

    // check how many cells are activated and log it
    const populationLogger = (grid, maxSize, counter) => {
        for (let row = 0; row < maxSize; row++) {
            for (let col = 0; col < maxSize; col++) {
                if (grid[row][col].state === 'active') {
                    counter++;
                };
            };
        };
        console.log('Cell population: ', counter);
        return counter;
    };

// initiating everithing
init();



