/*-------------------------------------------------------------------*
 *	Title:			main.js											 *
 *	Author:			Roberto Gomez									 *
 *	Date:			6/10/13											 *
 *	Description:	A robust and versatile take on the Game of Nim	 *
 *					using JS to manipulate DOM elements.			 *
 *-------------------------------------------------------------------*/

function startGame()
{
	var playButton = document.getElementById('playButton');
	playButton.style.display = 'none';						// Hide playButton link

	var maxColumns = 5;										// Maximum number of columns possible
	var maxTokens = 5;										// Maximum number of tokens possible in each column
	var dx = 400/maxColumns;								// Division sizes in pixels to draw tokens in playArea
	var dy = 350/maxTokens;									// Used for calculating pos_x and pos_y of Token objects

	var numOfCol = getRandomInt(2, maxColumns);				// Actual number of columns in this round
	var tokens = Array(numOfCol);							// Create random 2D array for storing Token objects
	for (var i=0; i<numOfCol; i++)							// First index represents the column
		tokens[i] = Array(getRandomInt(2, maxTokens));		// Second index represents the Token object in each column

	for (var i=0; i<tokens.length; i++) {
		for (var j=0; j<tokens[i].length; j++) {
			// Create Token objects and assign to tokens array
			tokens[i][j] = new Token(((20 + i * dx)), (400 - (dy + j * dy)), i, j);
			document.body.appendChild(tokens[i][j].element);	// Add token element to DOM
			tokens[i][j].element.classList.add('token');		// Apply token CSS class as specified in nim.css

			// Specify location of tokens in DOM
			tokens[i][j].element.style.left = tokens[i][j].pos_x + 'px';
			tokens[i][j].element.style.top = tokens[i][j].pos_y + 'px';

			// Add event listeners to trigger functions on click of a token
			tokens[i][j].element.addEventListener("click", removeTokens, false);
			tokens[i][j].element.addEventListener("click", delayCompTurn, false);
		}
	}

	// Constructor function for creating token objects
	function Token(pos_x, pos_y, col, num) {
		this.pos_x = pos_x;									// X position for CSS left property
		this.pos_y = pos_y;									// Y position for CSS top property
		this.element = document.createElement('div');		// HTML element placed in DOM
		this.element.col = col;								// Index value for specifying which column token belongs to
		this.element.num = num;								// Index value for specifying placement of token in its column
	}

	// Returns a random integer between min and max
	// Using Math.round() will give you a non-uniform distribution!
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/*---------------------------------------------------------------*
	 * removeTokens() function										 *
	 *																 *
	 * Removes the selected token and the tokens above it from the	 *
	 * DOM. Remove tokens starting from the top of the column down	 *
	 * to the selected token. First for loop line removes token		 *
	 * element from the DOM and second removes the the Token object	 *
	 * from the tokens array (necessary so that computer's random	 *
	 * selection doesn't choose an invalid index.					 *
	 *---------------------------------------------------------------*/

	function removeTokens() {
		//console.log('token[' + this.col + '][' + this.num + ']');
		//if (tokens === undefined)
		// use this keyword
		// else use tokens or Token argument or i and j arguments supplied to access tokens array
		for (var j=tokens[this.col].length-1; j>=this.num; j--) {
			tokens[this.col][j].element.parentNode.removeChild(tokens[this.col][j].element);
			tokens[this.col].pop();
		}

		// Set empty column to null to prevent future access
		if (tokens[this.col].length == 0) {
			console.log('empty');
			tokens[this.col] = null;
		}
	}

	/*---------------------------------------------------------------*
	 * delayCompTurn() function										 *
	 *																 *
	 * Function used to call startCompTurn() after 2 sec.			 *
	 *---------------------------------------------------------------*/

	function delayCompTurn() {
		window.setTimeout(startCompTurn, 2000);
	}

	/*---------------------------------------------------------------*
	 * startCompTurn() function										 *
	 *																 *
	 * Responsible for starting the computer's turn at selecting	 *
	 * tokens.														 *
	 *---------------------------------------------------------------*/

	function startCompTurn() {
		// Check if there are any tokens left to prevent infinite loop
		var noMoreTokens = true;
		for (var i=0; i<tokens.length; i++) {
			if (tokens[i] != null)	noMoreTokens = false;
		}
		if (noMoreTokens)	return(console.log('No More Tokens!'));

		// Get random indices from tokens array to represent
		// computer's token selection
		var compSelCol = getRandomInt(0, tokens.length-1);
		while (tokens[compSelCol] == null) {
			compSelCol = getRandomInt(0, tokens.length-1);
			console.log('compSelCol = ' + compSelCol);
		}
		var compSelTok = getRandomInt(0, tokens[compSelCol].length-1);
		console.log('token[' + compSelCol + '][' + compSelTok + ']');

		// First remove event listener that triggers delayCompTurn
		// to prevent computer from taking successive turns
		tokens[compSelCol][compSelTok].element.removeEventListener("click", delayCompTurn, false);

		// Simulate click on the randomly selected token to trigger
		// the listener for removeTokens()
		tokens[compSelCol][compSelTok].element.click();
	}
}

/*
maybe don't need Token.element just do
this = document.createElement('div');
consider renaming Token.element.num to Token.element.tok
*/