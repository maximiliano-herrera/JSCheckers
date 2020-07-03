// Global Variables

var possibleMoves = [];

var board = [];

var activePiece = null;

// keep game state tracked. Game is over when one player has captured 12 peices
var redPlayerActive;
var redScore;
var blackScore;
var winningScore; 

// Class Declerations 
function EmptySquare (rowPos, colPos)
{
		this.row = rowPos;
		this.col = colPos;
		this.name = "emptySquare";
		this.boardId = this.name + this.row + "-" + this.col;
		
		this.Draw = function ()
		{
				var square = document.getElementById("square" + this.row + "-" + this.col);
				var emptySquare = document.createElement("span");
				emptySquare.setAttribute("class", this.name);
				emptySquare.setAttribute("id", this.boardId);
				
				emptySquare.onclick = function () {
					ClearExistingPossibleMoves();
				};
				square.appendChild(emptySquare);
		}
}

function Checker (pieceColor, rowPos, colPos)
{
		this.color = pieceColor;
		this.row = rowPos;
		this.col = colPos;
		this.name = "checker";
		this.boardId = this.name + this.row + "-" + this.col;
		var myself = this;
		this.isKing = false;
		
		this.DisplayPossibleMoves = function ()
		{
			ClearExistingPossibleMoves();
		}
		
		// Start get empty nearby squares 
		// returns null if doesn't exist
		this.GetUpperLeftEmptySquare = function ()
		{
			var nextRow = this.row-1;
			var nextCol = this.col-1;
			
		    if( nextRow < 0 || nextCol -1 < 0)
			{
				return null;
			}
			
			if(board[nextRow][nextCol].name == "emptySquare")
			{
				ShowHighlightSquare(nextRow, nextCol);
			}
			else if(board[nextRow][nextCol].color != this.color)
			{
				var checker = board[nextRow][nextCol];
				nextRow = nextRow - 1;
				nextCol = nextCol - 1;
				// can we jump? 
				if(nextRow < 0 || nextCol < 0)
				{
					return null;
				}
				
				if(board[nextRow][nextCol].name == "emptySquare")
				{
					ShowHighlightSquare(nextRow, nextCol, checker);
				}
			}
		}
		
		this.GetUpperRightEmptySquare = function ()
		{
			var nextRow = this.row - 1;
			var nextCol = this.col + 1;
			
		    if( nextRow < 0 || nextCol >= board.length)
			{
				return null;
			}
			
			if(board[nextRow][nextCol].name == "emptySquare")
			{
				ShowHighlightSquare(nextRow, nextCol);
			}
			else if(board[nextRow][nextCol].color != this.color)
			{
				var checker = board[nextRow][nextCol];
				nextRow = nextRow - 1;
				nextCol = nextCol + 1;
				// can we jump? 
				if(nextRow < 0 || nextCol >= board.length)
				{
					return null;
				}
				
				if(board[nextRow][nextCol].name == "emptySquare")
				{
					ShowHighlightSquare(nextRow, nextCol, checker);
				}
			}
		}
		
		this.GetDownLeftEmptySquare = function ()
		{
			var nextRow = this.row + 1;
			var nextCol = this.col - 1;
			
		    if( nextRow >= board.length || nextCol < 0 )
			{
				return null;
			}
			
			if(board[nextRow][nextCol].name == "emptySquare")
			{
				ShowHighlightSquare(nextRow, nextCol);
			}
			else if(board[nextRow][nextCol].color != this.color)
			{
				var checker = board[nextRow][nextCol];
					
				nextRow = nextRow + 1;
				nextCol = nextCol - 1;
				// can we jump? 
		
				if(nextRow >= board.length || nextCol < 0)
				{
					return null;
				}
				
				if(board[nextRow][nextCol].name == "emptySquare")
				{
					ShowHighlightSquare(nextRow, nextCol, checker);
				}
			}
		}
		
		this.GetDownRightEmptySquare = function ()
		{
			var nextRow = this.row + 1;
			var nextCol = this.col + 1;
			
		    if (nextRow >= board.length || nextCol >= board.length)
			{
				return null;
			}
			
			if (board[nextRow][nextCol].name == "emptySquare")
			{
				ShowHighlightSquare(nextRow, nextCol);
			}
			else if(board[nextRow][nextCol].color != this.color)
			{
				var checker = board[nextRow][nextCol];
				nextRow = nextRow + 1;
				nextCol = nextCol + 1;
				// can we jump? 
				if (nextRow >= board.length || nextCol >= board.length)
				{
					return null;
				}
				
				if (board[nextRow][nextCol].name == "emptySquare")
				{
					ShowHighlightSquare(nextRow, nextCol, checker);
				}
			}
		}
		// End get empty squares
		
		this.Draw = function ()
		{
				var square = document.getElementById("square" + this.row + "-" + this.col);
						
				var checker = document.createElement("span");
				checker.setAttribute("class", checker.name);
				checker.setAttribute("id", checker.boardId);
				checker.setAttribute("class", this.color == "red" ? "checkerPiece redPiece" : "checkerPiece blackPiece");
				
				if(this.isKing){
					checker.style.borderColor = "gold";
				}
				
				checker.onclick = function () 
				{
					myself.DisplayPossibleMoves();
				};
				square.appendChild(checker);
		}
		
}

function RedChecker (rowPos, colPos)
{
	Checker.call(this, "red", rowPos, colPos);
	this.name = "redchecker";
	
	this.DisplayPossibleMoves = function ()
	{
		ClearExistingPossibleMoves();
		
		if(!redPlayerActive)
		{
			return;
		}
		
		activePiece = this;
		var emptySquares = [];
		
		// red moves forward by going down
		this.GetDownLeftEmptySquare();
		this.GetDownRightEmptySquare();
		
		if(this.isKing)
		{
			this.GetUpperLeftEmptySquare();
			this.GetUpperRightEmptySquare();
		}			
	}

	this.CheckIfKingAndUpdate = function ()
	{
		this.isKing = this.isKing || this.row == board.length-1;
	}
}

function BlackChecker (rowPos, colPos)
{
	Checker.call(this, "black", rowPos, colPos);
	this.name = "blackchecker";
	
	this.DisplayPossibleMoves = function ()
	{
		ClearExistingPossibleMoves();
		
		if(redPlayerActive){
			return;
		}
		
		activePiece = this;
		
		// black moves forward by going up
		// left diagonal

		this.GetUpperLeftEmptySquare();
		this.GetUpperRightEmptySquare();

		
		if(this.isKing)
		{
			this.GetDownLeftEmptySquare();
			this.GetDownRightEmptySquare();
		}			
	}

	this.CheckIfKingAndUpdate = function ()
	{
		this.isKing =  this.isKing || this.row == 0;
	}
	
}


function HighlightSquare(rowPos, colPos, checkerToJump)
{
	this.row = rowPos;
	this.col = colPos;
	this.name = "highlightSquare";
	this.boardId = this.name + this.row + "-" + this.col;
	var mysquare = this;
	this.checker = checkerToJump;
	
	this.Draw = function (row, col)
	{
		var square = document.getElementById("square" + this.row + "-" + this.col);
		var highlight = document.createElement("span");
		highlight.setAttribute("class", this.name);
		highlight.setAttribute("id", this.boardId);
		
		highlight.onclick = function () 
		{
			mysquare.MovePieceHere();
		};

		square.appendChild(highlight);
	}
	
	this.MovePieceHere = function ()
	{
		ClearExistingPossibleMoves();
		var curRow = activePiece.row;
		var curCol = activePiece.col;
		
		ClearSquare(curRow, curCol);
		ClearSquare(this.row, this.col);
		
		// remove jumped checker
		if(this.checker)
		{
			var chRow = this.checker.row;
			var chCol = this.checker.col;	
			ClearSquare(chRow, chCol);
			UpdateScore(this.checker.color);
			board[chRow][chCol] = new EmptySquare(chRow, chCol);
		}
				
		//update gameBoard
		activePiece.row = this.row;
		activePiece.col = this.col;
		activePiece.CheckIfKingAndUpdate();
				
		board[this.row][this.col] = activePiece;
		board[curRow][curCol] = new EmptySquare(curRow, curCol);
		
		// Draw the moved piece
		activePiece.Draw();
		UpdateGameStatus();
		activePiece = null;
	}
}


// Initialize Board State 
function InitiateBoard()
{
	blackScore = 0;
	redScore = 0;
	// set false so that the first move is red 
	redPlayerActive = false;
	winningScore = 12;
	
	// 0 - no checker present
	// 1 - Red Checker
	// 2 - Black Checker
	var startingBoard = 
		[ 
			[1, 0, 1, 0, 1, 0, 1, 0], 
			[0, 1, 0, 1, 0, 1, 0, 1],
			[1, 0, 1, 0, 1, 0, 1, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 2, 0, 2, 0, 2, 0, 2],
			[2, 0, 2, 0, 2, 0, 2, 0],
			[0, 2, 0, 2, 0, 2, 0, 2]
		];
	
	for (let i = 0; i < startingBoard.length; i++)
	{
		board[i] = []; 
		for (let j = 0; j < startingBoard[i].length; j++)
		{
			if(startingBoard[i][j] == 0)
			{
				board[i].push(new EmptySquare(i, j));
			}
			else
			{
				var checker = startingBoard[i][j] == 1 ? new RedChecker(i, j) : new BlackChecker(i, j);
				board[i].push(checker);
			}
		}
	}	
}

function ClearExistingPossibleMoves()
{
	while (possibleMoves.length > 0)
	{
		var p = possibleMoves.pop();
		var highlight = document.getElementById(p.boardId);
		var holdingDiv = highlight.parentNode;
		holdingDiv.removeChild(highlight);
	}
}

function ClearSquare(row, col)
{
	var square = document.getElementById("square" + row + "-" + col);
	
	while (square != null && square.firstChild) 
	{
		square.removeChild(square.lastChild);
	}
	
	var em = new EmptySquare(row, col)
	em.Draw();
	board[row][col] = em;
}


function ShowHighlightSquare(row, col, checker){
	ClearSquare(row, col);
	var highlightSquare = new HighlightSquare(row, col, checker) ;
	possibleMoves.push(highlightSquare);
	
	highlightSquare.Draw();
}

function UpdateScore(color)
{
	// if we remove a checker, give a point to the opposite checker player
	if(color == "red")
	{
		blackScore += 1;
	}
	else{
		redScore += 1;
	}
}

function UpdateGameStatus()
{
	var gameState = "";
	
	if(blackScore == winningScore)
	{
		redPlayerActive = undefined;
		gameState = "Black has won!";
	}
	else if (redScore == winningScore)
	{
		redPlayerActive = undefined;
		gameState = "Red has won!";
	}
	else
	{
		redPlayerActive = !redPlayerActive;
		gameState = (redPlayerActive ? "Red's" : "Black's") + " Turn"
	}
	
	var playerEm = document.getElementById("gameState");

	playerEm.textContent = gameState;
	
	
}

function DrawBoard() 
{    
	UpdateGameStatus();
	
    var checkerboard = document.getElementById("gameBoard");
    
    for (var i = 0; i < 8; i++) 
    {
		var row =  document.createElement("div");
        row.setAttribute("class", "rowDiv");
        row.setAttribute("id", "row" + i);
        var row = checkerboard.appendChild(row);
        
		var firstSquareColor = i %2 == 1? "black" : "white";
        var secondSquareColor = i %2 == 1? "white" : "black";        
        
        for (var j = 0; j < 8; j++)
		{
            var square = document.createElement('div');
          	square.setAttribute("class", "square");
          	square.setAttribute("id", "square" + i + "-" + j );
            square.style.backgroundColor = j % 2 ==  1 ? firstSquareColor : secondSquareColor;
		
			row.appendChild(square);
			(board[i][j]).Draw();
        }
    }
}

InitiateBoard()
DrawBoard()
