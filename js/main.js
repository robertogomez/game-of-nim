/*-------------------------------------------------------------------*
 *	Title:			main.js											 *
 *	Author:			Roberto Gomez									 *
 *	Date:			6/9/13											 *
 *	Description:	A robust and versatile take on the Game of Nim	 *
 *					using JS to manipulate DOM elements.			 *
 *-------------------------------------------------------------------*/

// Main function called to initiate gameplay
function startGame()
{
	// Variable for handling playButton link
	var playButton = document.getElementById('playButton');

	// Create random 2D array for storing Token objects
	// numCol is the number of columns, maxColTokens is the greatest
	// number of tokens in all the columns
	var numCol = getRandomInt(2, 5);
	var tokens = Array(numCol);
	var maxColTokens = 0;
	for (var i=0; i<numCol; i++) {
		tokens[i] = Array(getRandomInt(2, 5));
		maxColTokens = Math.max(maxColTokens, tokens[i].length)
	}

	// 2D array for storing tokens
	// This is where the amount of tokens in each column is stored
	/*var tokens = Array(3);
	tokens[0] = Array(5);
	tokens[1] = Array(3);
	tokens[2] = Array(1);*/

	// Division sizes in pixels to draw tokens in playArea
	// Used for calculating pos_x and pos_y of Token objects
	var dx = 400/numCol;
	var dy = 350/maxColTokens;

	playButton.style.display = 'none';			// Hide playButton link		

	// Two nested for loops to fill tokens array with Token objects,
	// add the token elements to the DOM, and register the onclick properties
	// i corresponds to the column of tokens
	// j corresponds to the number of tokens in each column
	for (var i=0; i<tokens.length; i++) {
		for (var j=0; j<tokens[i].length; j++) {	
			// Create Token objects and assign to tokens array
			tokens[i][j] = new Token(((dx + i * dx) - 100), 
			(400 - (dy + j * dy)), i, j);
			// Add token element to DOM
			document.body.appendChild(tokens[i][j].element);
			// Apply token CSS class as specified in nim.css
			tokens[i][j].element.classList.add('token');		

			// Specify location of tokens on DOM
			tokens[i][j].element.style.left = tokens[i][j].pos_x + 'px';
			tokens[i][j].element.style.top = tokens[i][j].pos_y + 'px';

			// Add onclick property to trigger remove function
			tokens[i][j].element.onclick = remove;
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

	// maybe define remove function as a method for each Token object so
	// it has access to all the objects properties
	function remove() {
		//alert("token[" + this.col + "][" + this.num + "]");

		// Remove tokens starting from the top of the column down
		// to the selected token. First line removes token element from DOM
		// and second removes the the Token object from the tokens array.
		for (var j=tokens[this.col].length-1; j>=this.num; j--) {
			tokens[this.col][j].element.parentNode.removeChild(tokens[this.col][j].element);
			tokens[this.col].pop();
		}
	}

	// Returns a random integer between min and max
	// Using Math.round() will give you a non-uniform distribution!
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}

/*
NOTES

use document fragments to add elements to DOM faster/more efficiently 
than adding them individually

create area to place tokens on, surface, and use surface.clear() to clear
all references (to avoid memory leaks) and create new round

add way of checking for incompatible browsers
*/

/*
 * Thanks to
 *
 * MDN for providing getRandomInt() function
 */