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
        board[row][column].setPlayerToken(playerToken)
    }

    return { generateBoard, getBoard, getCellValue, displayBoard, addPlayerToken }
}

function Cell() {
    let cellValue = 0

    const setPlayerToken = (playerToken) => {
        cellValue = playerToken
    }

    const value = () => cellValue 

    return { setPlayerToken, value }
}

function Player(name, token) {
    let playerName = ""
    let playerValue = 0

    const setPlayerName = (newName) => {
        if(typeof newName === typeof "") {
            playerName = newName
            return
        }

        return "Invalid name"
    }

    const setToken = (playerToken) => {
        if(playerToken == 1 || playerToken == 2) {
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

function WinCondition() {
    const rows = 3
    const columns = 3
    let gameBoard = []
    let player = null

    const setGameBoard = (board) => gameBoard = board 

    const setActivePlayer = (activePlayer) => player = new String(activePlayer.getToken()).repeat(3)

    // ? figure out which player won
    // ? check columns and diagonal conditions
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

    const checkConditions = () => checkRows() || checkColumns() || checkDiagonals()

    return { setGameBoard, setActivePlayer, checkConditions }
}

function GameController() {
    const gameBoard = GameBoard()
    
    const winCondition = WinCondition()

    const players = [Player("One",1), Player("Two",2)]

    let randomPick = () => Math.floor(Math.random() * players.length)

    let activePlayer = players[randomPick()]

    const getActivePlayer = () => activePlayer

    const setNewRound = () => {
        gameBoard.displayBoard()

        console.log(`${activePlayer.getName()}'s turn.`)
    }
    
    const playRound = (row, column) => {
        if(gameBoard.getCellValue(row, column) == 0) {
            gameBoard.addPlayerToken(row, column, activePlayer.getToken())
            
            console.log(`${activePlayer.getName()} place at row:${row}, column: ${column}`)

            winCondition.setActivePlayer(activePlayer)

            console.log(winCondition.checkConditions())

            if(winCondition.checkConditions()) {
                gameOver()
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

    const gameOver = () => {
        console.log(`Congratulations ${activePlayer.getName()}! You won the game.`)
    }

    gameBoard.generateBoard()

    winCondition.setGameBoard(gameBoard.getBoard())
    
    setNewRound()

    return { getActivePlayer, setNewRound, playRound }
}