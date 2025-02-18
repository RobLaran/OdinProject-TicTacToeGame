console.log("Tic toe")

function GameBoard() {
    const rows = 3
    const columns = 3
    let board = []

    const generateBoard = () => {
        for(let i = 0; i < rows; i++) {
            board[i] = []

            for(let j = 0; j < columns; j++) {
                board[i][j] = Cell(i, j)
            }
        }
    }

    const getBoard = () => board

    const getCellValue = (row, column) => board[row][column].value()

    const clearBoard = () => {
        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < columns; j++) {
                board[i][j].clear()
            }
        }
    }

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
        board[row][column].getPosition().occupied = true
    }

    generateBoard()

    return { generateBoard, getBoard, getCellValue, displayBoard, addPlayerToken, clearBoard }
}

function Cell(row, column) {
    let cellValue = " "
    let cellPosition = {
        cellRow: row,
        cellColumn: column,
        occupied: false
    }

    const addValue = (value) => {
        cellValue = value
    }

    const value = () => cellValue 

    const getPosition = () => cellPosition

    const clear = () => cellValue = " "

    return { addValue, value, getPosition, clear }
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

        return `${activePlayer.getName()}'s turn. Sign('${activePlayer.getToken()}')`
    }

    const playRound = (row, column) => {
        board.addPlayerToken(row, column, activePlayer.getToken())

        if(!gameCondition.checkWin() && !gameCondition.checkDraw()) {
            changeTurn()

            setNewRound()
        }

        console.log(`${activePlayer.getName()} place at row: ${row}, column: ${column}`)
    }

    const reset = () => {
        board.clearBoard()
    }

    const changeTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0]
    }

    const setPlayerNames = (playerOneName="", playerTwoName="") => {
        players = [Player(playerOneName,"X"), Player(playerTwoName,"O")]

        activePlayer = players[randomPick()]
    }

    board.generateBoard()

    return { getActivePlayer,
            changeTurn,
            setNewRound, 
            playRound, 
            setPlayerNames, 
            gameCondition,
            reset,
            getBoard: board.getBoard }
}

function ScreenController() {
    const game = GameController()

    let boardDiv = document.querySelector(".board")

    let buttons = null

    let message = document.querySelector(".message")

    let playerDialog = document.querySelector(".setup-players.dialog")

    const startGame = () => {
        playerDialog.showModal()
    }

    const setupGame = () => {
        const board = game.getBoard()

        board.forEach(row => {
            row.forEach(cell => {
                let button = document.createElement("button")

                button.classList.add("cell")

                button.innerText = cell.value()

                button.dataset.row = cell.getPosition().cellRow
                button.dataset.column = cell.getPosition().cellColumn

                button.dataset.occupied = false

                boardDiv.appendChild(button)
            })            
        })

        buttons = document.querySelectorAll(".cell")


        clickHandler(board)

        startGame()
    }

    const restartGame = () => {
        game.reset()

        game.changeTurn()
    }

    const exitGame = () => {
        restartGame()

        startGame()
    }

    const displayTurn = () => {
        let symbol = document.createElement("span")

        symbol.innerText = `${game.getActivePlayer().getToken()}`
        symbol.classList.add(game.getActivePlayer().getToken())

        message.innerHTML = `${game.getActivePlayer().getName()}'s turn. Symbol `
        
        message.appendChild(symbol)
    }

    const clickHandler = (board) => {
        const buttons = document.querySelectorAll(".cell")

        const startGameBtn = document.querySelector(".start.btn")
        const restartGameBtn = document.querySelector(".restart.btn")
        const exitGameBtn = document.querySelector(".exit.btn")

        buttons.forEach(button => {
            button.addEventListener("click", () => {
                
                const row = button.dataset.row
                const column = button.dataset.column
                
                const occupied = JSON.parse(button.dataset.occupied)
                
                if(!occupied) {
                    button.innerText = game.getActivePlayer().getToken()
                    
                    button.dataset.occupied = true

                    button.classList.add(button.innerText)

                    game.playRound(row, column)

                    
                    displayTurn()
                } else {
                    message.innerText = "Occupied! Try Again."
                }
                
                checkCondition()
            })
        })

        startGameBtn.addEventListener("click", () => {
            let playerOneName = document.querySelector("#player-one").value
            let playerTwoName = document.querySelector("#player-two").value

            game.setPlayerNames(playerOneName, playerTwoName)
            
            message.style = "opacity: 1;"
            displayTurn()


            playerDialog.close()
        })

        restartGameBtn.addEventListener("click", () => {
            restartGame()

            buttons.forEach(button => {
                button.classList = "cell"
                button.innerText = ""
                button.dataset.occupied = false

                if(button.disabled) {
                    button.disabled = false
                }
            })

            displayTurn()
        })

        exitGameBtn.addEventListener("click", () => {
            exitGame()

            buttons.forEach(button => {
                button.classList = "cell"
                button.innerText = ""
                button.dataset.occupied = false

                if(button.disabled) {
                    button.disabled = false
                }
            })

            // message.innerText = `${game.getActivePlayer().getName()}'s turn. Symbol ('${game.getActivePlayer().getToken()}')`
        })
    }

    const checkCondition = () => {
        buttons = document.querySelectorAll(".cell")

        if(game.gameCondition.checkWin()) {
            buttons.forEach(button => button.disabled = true)
    
            message.innerText = `Congratulations ${game.getActivePlayer().getName()}! You won the game.`
        } else if(game.gameCondition.checkDraw()) {
            buttons.forEach(button => button.disabled = true)

            message.innerText = "GAME DRAW!"
        }
    }

    return { setupGame, startGame }
}

ScreenController().setupGame()

