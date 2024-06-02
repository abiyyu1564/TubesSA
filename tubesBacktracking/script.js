document.addEventListener("DOMContentLoaded", function() {
    const gridContainer = document.getElementById("sudoku-grid");
    const solveButton = document.getElementById("solve-button");
    const dummyButton = document.getElementById("dummy-button");
    const timeTakenElement = document.createElement('p');
    timeTakenElement.id = 'time-taken';
    document.body.appendChild(timeTakenElement);
    const size = 9;

    // Create the Sudoku grid
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
        gridContainer.appendChild(tr);
    }

    addBorders();

    solveButton.addEventListener("click", async function() {
        clearErrors();
        const board = getBoard();
        const startTime = performance.now(); // Start timing
        if (await solveSudoku(board)) {
            displayBoard(board);
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

    function addBorders() {
        const rows = gridContainer.getElementsByTagName("tr");
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

    function displayBoard(board) {
        const rows = gridContainer.getElementsByTagName("tr");
        for (let i = 0; i < size; i++) {
            const cells = rows[i].getElementsByTagName("td");
            for (let j = 0; j < size; j++) {
                cells[j].getElementsByTagName("input")[0].value = board[i][j] !== 0 ? board[i][j] : "";
            }
        }
    }

    async function solveSudoku(board) {
        const emptyCell = findEmptyCell(board);
        if (!emptyCell) return true;

        const [row, col] = emptyCell;
        for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
                board[row][col] = num;
                await visualizeStep(board);

                if (await solveSudoku(board)) return true;

                board[row][col] = 0;
                await visualizeStep(board);
            }
        }
        return false;
    }

    function findEmptyCell(board) {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (board[i][j] === 0) return [i, j];
            }
        }
        return null;
    }

    function isValid(board, row, col, num) {
        for (let x = 0; x < size; x++) {
            if (board[row][x] === num || board[x][col] === num || 
                board[3 * Math.floor(row / 3) + Math.floor(x / 3)][3 * Math.floor(col / 3) + x % 3] === num) {
                return false;
            }
        }
        return true;
    }

    function visualizeStep(board) {
        return new Promise(resolve => {
            displayBoard(board);
            markErrors(board);
            setTimeout(resolve, 50); // Delay for visualization
        });
    }

    function markErrors(board) {
        const rows = gridContainer.getElementsByTagName("tr");
        for (let i = 0; i < size; i++) {
            const cells = rows[i].getElementsByTagName("td");
            for (let j = 0; j < size; j++) {
                if (board[i][j] !== 0 && !isValid(board, i, j, board[i][j])) {
                    cells[j].classList.add("error");
                } else {
                    cells[j].classList.remove("error");
                }
            }
        }
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
