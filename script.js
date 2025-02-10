console.log("Tic toe")

function GameBoard() {
    const rows = 3
    const columns = 3
    let board = []

    const generateBoard = () => {
        for(let i = 0; i < rows; i++) {
            board[i] = []

            for(let j = 0; j < columns; j++) {
                board[i][j] = Cell()
            }
        }
    }

    const getBoard = () => board

    const displayBoard = () => {
        const boardWithCellValues = []

        for(let i = 0; i < rows; i++) {
            boardWithCellValues[i] = []

            for(let j = 0; j < columns; j++) {
                boardWithCellValues[i][j] = board[i][j].value()
            }
        }

        console.log(boardWithCellValues)
    }

    const addPlayerToken = (row, column, playerToken) => {
        board[row][column].setPlayerToken(playerToken)
    }

    return { generateBoard, getBoard, displayBoard, addPlayerToken }
}

function Cell() {
    let cellValue = 0

    const setPlayerToken = (playerToken) => {
        cellValue = playerToken
    }

    const value = () => cellValue 

    return { setPlayerToken, value }
}

function Player(playerToken) {
    let playerValue = 0

    const setToken = (playerToken) => {
        if(playerToken == 1 || playerToken == 2) {
            playerValue = playerToken
            return
        }

        return "Invalid token"
    }

    const token = () => playerValue ?? "Token not set" 

    setToken(playerToken)

    return { setToken, token };
}

function GameController() {

}