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

    const getCellValue = (row, column) => board[row][column].value()

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
        board[row][column].addValue(playerToken)
    }

    generateBoard()

    return { generateBoard, getBoard, getCellValue, displayBoard, addPlayerToken }
}

function Cell() {
    let cellValue = " "

    const addValue = (value) => {
        cellValue = value
    }

    const value = () => cellValue 

    return { addValue, value }
}

function Player(name, token) {
    let playerName = ""
    let playerValue = ""

    const setPlayerName = (newName) => {
        if(typeof newName === typeof "") {
            playerName = newName
            return
        }

        return "Invalid name"
    }

    const setToken = (playerToken) => {
        if(playerToken == "X" || playerToken == "O") {
            playerValue = playerToken
            return
        }

        return "Invalid token"
    }

    const getToken = () => playerValue ?? "Token not set"
    const getName = () => playerName ?? "No name"

    setPlayerName(name)
    setToken(token)

    return { setPlayerName, setToken, getName, getToken };
}

function WinCondition(board, activePlayer) {
    const rows = 3
    const columns = 3
    let gameBoard = board
    let player = null

    const setActivePlayer = () => player = activePlayer.getToken().repeat(3)

    const checkRows = () => {
        for(let i = 0; i < rows; i++) {
            let pattern = ""
            for(let j = 0; j < columns; j++) {
                pattern += gameBoard[i][j].value()
            }

            if(pattern === player) return true
        }   

        return false
    }

    const checkColumns = () => {
        for(let i = 0; i < rows; i++) {
            let pattern = ""
            for(let j = 0; j < columns; j++) {
                pattern += gameBoard[j][i].value()
            }

            if(pattern === player) return true
        }

        return false
    }

    const checkDiagonals = () => {
        const leftDiagonal = `${gameBoard[0][0].value()}${gameBoard[1][1].value()}${gameBoard[2][2].value()}`
        const rightDiagonal = `${gameBoard[0][2].value()}${gameBoard[1][1].value()}${gameBoard[2][0].value()}`

        return leftDiagonal === player || rightDiagonal === player
    }

    const check = () => checkRows() || checkColumns() || checkDiagonals()

    setActivePlayer()

    return { setActivePlayer, check }
}

function DrawCondition(board) {
    let gameBoard = board

    const cellsLeft = () => {
        let cells = 9

        for(let i = 0; i < gameBoard.length; i++) {
            for(let j = 0; j < gameBoard[0].length; j++) {
                if(gameBoard[i][j].value() != " ") {
                    cells--
                }
            }
        }

        return cells
    }

    const check = () => {
        return cellsLeft() == 0
    }

    return { check }
}

function GameController() {
    const board = GameBoard()
    
    let players = []

    let randomPick = () => Math.floor(Math.random() * players.length)

    let activePlayer = null

    const gameCondition = (function () {
        let gameBoard = board.getBoard()
        
        const checkWin = () => WinCondition(gameBoard, activePlayer).check()
        
        const checkDraw = () => DrawCondition(gameBoard).check()
        
        const gameOver = (playerName="") => {
            console.log(`Congratulations ${playerName}! You won the game.`)
        }
        
        return { checkWin, checkDraw, gameOver }
    })()
    
    const getActivePlayer = () => activePlayer

    const setNewRound = () => {
        board.displayBoard()

        console.log(`${activePlayer.getName()}'s turn. Sign('${activePlayer.getToken()}')`)
    }
    
    const playRound = (row, column) => {
        if(board.getCellValue(row, column) == " ") {
            board.addPlayerToken(row, column, activePlayer.getToken())

            console.log(`${activePlayer.getName()} place at row: ${row}, column: ${column}`)

            if(gameCondition.checkWin()) {
                board.displayBoard()
                gameCondition.gameOver(activePlayer.getName())
            } else if(gameCondition.checkDraw()) {
                console.log("GAME DRAW!")
            } else {
                changeTurn()
                setNewRound()
            }
       } else {
            console.log("Occupied! Try Again.")
       }
    }

    const changeTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0]
    }

    const setPlayerNames = (playerOneName, playerTwoName) => {
        players = [Player(playerOneName,"X"), Player(playerTwoName,"O")]

        activePlayer = players[randomPick()]
    }

    setPlayerNames("Rob", "Blanche")

    board.generateBoard()

    setNewRound()

    return { getActivePlayer, setNewRound, playRound, setPlayerNames }
}

const controller = GameController()

