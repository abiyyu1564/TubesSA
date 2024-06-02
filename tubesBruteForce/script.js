document.addEventListener("DOMContentLoaded", function() {
    const gridContainer = document.getElementById("sudoku-grid");
    const solveButton = document.getElementById("solve-button");
    const dummyButton = document.getElementById("dummy-button");
    const timeTakenElement = document.createElement('p');
    timeTakenElement.id = 'time-taken';
    document.body.appendChild(timeTakenElement);
    const size = 9;

    // Create the initial Sudoku grid
    createSudokuGrid(gridContainer);

    solveButton.addEventListener("click", async function() {
        clearErrors();
        const board = getBoard();
        const emptyCells = getEmptyCells(board);

        const startTime = performance.now(); // Start timing
        if (await solveSudoku(board, emptyCells)) {
            displayBoard(gridContainer, board);
        } else {
            alert("No solution exists!");
        }
        const endTime = performance.now(); // End timing

        const timeTaken = endTime - startTime;
        timeTakenElement.textContent = `Time taken: ${timeTaken.toFixed(2)} ms`;
    });

    dummyButton.addEventListener("click", function() {
        setDummyData();
    });

    function createSudokuGrid(container) {
        const table = document.createElement("table");
        for (let row = 0; row < size; row++) {
            const tr = document.createElement("tr");
            for (let col = 0; col < size; col++) {
                const td = document.createElement("td");
                const input = document.createElement("input");
                input.type = "text";
                input.maxLength = 1;
                td.appendChild(input);
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        container.appendChild(table);
        addBorders(table);
    }

    function addBorders(table) {
        const rows = table.getElementsByTagName("tr");
        for (let i = 0; i < size; i++) {
            const cells = rows[i].getElementsByTagName("td");
            for (let j = 0; j < size; j++) {
                if (j % 3 === 2 && j !== size - 1) {
                    cells[j].classList.add("block-vertical");
                }
                if (i % 3 === 2 && i !== size - 1) {
                    cells[j].classList.add("block-horizontal");
                }
            }
        }
    }

    function getBoard() {
        const board = [];
        const rows = gridContainer.getElementsByTagName("tr");
        for (let row of rows) {
            const rowData = [];
            const cells = row.getElementsByTagName("td");
            for (let cell of cells) {
                const value = cell.getElementsByTagName("input")[0].value;
                rowData.push(value === "" ? 0 : parseInt(value));
            }
            board.push(rowData);
        }
        return board;
    }

    function displayBoard(container, board) {
        const rows = container.getElementsByTagName("tr");
        for (let i = 0; i < size; i++) {
            const cells = rows[i].getElementsByTagName("td");
            for (let j = 0; j < size; j++) {
                cells[j].getElementsByTagName("input")[0].value = board[i][j] !== 0 ? board[i][j] : "";
            }
        }
    }

    async function solveSudoku(board, emptyCells) {
        const maxIndex = emptyCells.length;
        const counters = new Array(maxIndex).fill(1);

        while (true) {
            for (let i = 0; i < maxIndex; i++) {
                const [row, col] = emptyCells[i];
                board[row][col] = counters[i];
            }

            displayBoard(gridContainer, board);
            await new Promise(resolve => setTimeout(resolve, 50)); // Pause for visualization

            if (isValidBoard(board)) {
                return true;
            }

            let incrementIndex = maxIndex - 1;
            while (incrementIndex >= 0 && counters[incrementIndex] === 9) {
                counters[incrementIndex] = 1;
                incrementIndex--;
            }

            if (incrementIndex < 0) {
                return false; // No solution exists
            }

            counters[incrementIndex]++;
        }
    }

    function getEmptyCells(board) {
        const emptyCells = [];
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (board[i][j] === 0) emptyCells.push([i, j]);
            }
        }
        return emptyCells;
    }

    function isValidBoard(board) {
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (!isValid(board, row, col)) {
                    return false;
                }
            }
        }
        return true;
    }

    function isValid(board, row, col) {
        const num = board[row][col];
        if (num === 0) return true;

        // Check row
        for (let x = 0; x < size; x++) {
            if (x !== col && board[row][x] === num) {
                return false;
            }
        }

        // Check column
        for (let x = 0; x < size; x++) {
            if (x !== row && board[x][col] === num) {
                return false;
            }
        }

        // Check 3x3 grid
        const startRow = row - row % 3;
        const startCol = col - col % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const currRow = startRow + i;
                const currCol = startCol + j;
                if ((currRow !== row || currCol !== col) && board[currRow][currCol] === num) {
                    return false;
                }
            }
        }
        return true;
    }

    function clearErrors() {
        const cells = gridContainer.getElementsByTagName("td");
        for (let cell of cells) {
            cell.classList.remove("error");
        }
    }

    function setDummyData() {
        const dummyData = [
            [5, 3, 4, 6, 7, 8, 9, 1, 2],
            [6, 7, 2, 1, 9, 5, 3, 4, 8],
            [1, 9, 8, 3, 4, 2, 5, 6, 7],
            [8, 5, 9, 7, 6, 1, 4, 2, 3],
            [4, 2, 6, 8, 5, 3, 7, 9, 1],
            [7, 1, 3, 9, 2, 4, 8, 5, 6],
            [9, 6, 1, 5, 3, 7, 2, 8, 4],
            [2, 8, 7, 4, 1, 9, 6, 3, 5],
            [3, 4, 5, 2, 0, 0, 0, 0, 0]
        ];

        const rows = gridContainer.getElementsByTagName("tr");
        for (let i = 0; i < size; i++) {
            const cells = rows[i].getElementsByTagName("td");
            for (let j = 0; j < size; j++) {
                cells[j].getElementsByTagName("input")[0].value = dummyData[i][j] !== 0 ? dummyData[i][j] : "";
            }
        }
    }
});
