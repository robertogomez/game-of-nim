/*-------------------------------------------------------------------*
 *	Title:			main.js											 *
 *	Author:			Roberto Gomez									 *
 *	Date:			6/27/13											 *
 *	Description:	A robust and versatile take on the Game of Nim	 *
 *					using JS to manipulate DOM elements.			 *
 *-------------------------------------------------------------------*/

function startGame() {
	var playButton = document.getElementById('playButton');
	playButton.style.display = 'none';						// Hide playButton link

	var maxHeaps = 5;										// Maximum number of heaps possible
	var maxTokens = 5;										// Maximum number of tokens possible in each heap
	var dx = 400/maxHeaps;									// Division sizes in pixels to draw tokens in playArea
	var dy = 350/maxTokens;									// Used for calculating pos_x and pos_y of Token objects

	var numOfHeaps = getRandomInt(2, maxHeaps);				// Actual number of heaps in this round
	var tokens = Array(numOfHeaps);							// Create random 2D array for storing Token objects
	for (var i=0; i<numOfHeaps; i++)						// First index represents the heap
		tokens[i] = Array(getRandomInt(2, maxTokens));		// Second index represents the Token object in each heap

	/*var tokens = Array(3);
	tokens[0] = Array(1);
	tokens[1] = Array(5);
	tokens[2] = Array(5);*/

	for (var i=0; i<tokens.length; i++) {
		for (var j=0; j<tokens[i].length; j++) {
			// Create Token objects and assign to tokens array
			tokens[i][j] = new Token(((20 + i * dx)), (400 - (dy + j * dy)), i, j);
			document.body.appendChild(tokens[i][j].element);	// Add token element to DOM
			tokens[i][j].element.classList.add('token');		// Apply token CSS class as specified in nim.css

			// Specify location of tokens in DOM
			tokens[i][j].element.style.left = tokens[i][j].pos_x + 'px';
			tokens[i][j].element.style.top = tokens[i][j].pos_y + 'px';

			// Add event listeners to trigger functions when a token is clicked and moused over
			tokens[i][j].element.addEventListener("click", function(){removeTokens(this.heap, this.order)}, false);
			tokens[i][j].element.addEventListener("click", delayCompTurn, false);
			tokens[i][j].element.addEventListener("mouseover", function(){highlightTokens(this.heap, this.order)}, false);
			tokens[i][j].element.addEventListener("mouseout", function(){unHighlightTokens(this.heap, this.order)}, false);
		}
	}

	/*---------------------------------------------------------------*
	 * Token() constructor function									 *
	 *																 *
	 * Constructor function for creating Token objects. Heap and	 *
	 * order are sub-properties of the element property because they *
	 * need to be accessible using the this keyword when the event	 *
	 * listener for removeTokens() is added to the Token objects	 *
	 *---------------------------------------------------------------*/

	function Token(pos_x, pos_y, heap, order) {
		this.pos_x = pos_x;									// X position for CSS left property
		this.pos_y = pos_y;									// Y position for CSS top property
		this.element = document.createElement('div');		// HTML element placed in DOM
		this.element.heap = heap;							// Index values that correspond to the
		this.element.order = order;			 				// tokens array, eg tokens[heap][order]
	}

	/*---------------------------------------------------------------*
	 * getRandomInt() function										 *
	 *																 *
	 * Returns a random integer between min and max					 *
	 * Using Math.round() will give you a non-uniform distribution!	 *
	 *---------------------------------------------------------------*/

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/*---------------------------------------------------------------*
	 * removeTokens() function										 *
	 *																 *
	 * Removes the token specified by the column and row			 *
	 * parameters from both the DOM and the tokens array. Also		 *
	 * checks if the column is depleted of tokens, and if so,		 *
	 * decrements the heap properties of all the tokens that are	 *
	 * after it and removes it from the tokens array.				 *
	 *---------------------------------------------------------------*/

	function removeTokens(column, row) {
		console.log("[" + tokens[column][row].element.heap + "][" + tokens[column][row].element.order + "]");

		// Removes token elements starting from the top of the
		// column down to the specified token. To prevent invalid array
		// access and to update the number of tokens in a column the
		// Token objects are removed from the tokens array using the pop method.
		for (var j=tokens[column].length-1; j>=row; j--) {
			tokens[column][j].element.parentNode.removeChild(tokens[column][j].element);
			tokens[column].pop();
		}

		if (tokens[column].length == 0) {
			for (var i=column+1; i<tokens.length; i++)
				for (var j=0; j<tokens[i].length; j++)
					tokens[i][j].element.heap--;
			tokens.splice(column, 1);
		}
	}

	/*---------------------------------------------------------------*
	 * delayCompTurn() function										 *
	 *																 *
	 * Function used to call startCompTurn() after 2 sec. Necessary	 *
	 * to cause a delay after the player has moved and before the	 *
	 * computer makes it selection.									 *
	 *---------------------------------------------------------------*/

	function delayCompTurn() {
		window.setTimeout(startCompTurn, 2000);
	}

	/*---------------------------------------------------------------*
	 * startCompTurn() function										 *
	 *																 *
	 * Responsible for starting the computer's turn at selecting	 *
	 * tokens. Checks the length of the tokens array to see if there *
	 * are tokens still remaining. Calculates nim sums to determine	 *
	 * the best possible selection to ensure its victory. If the	 *
	 * value of nimSumAll is zero, the computer can not gaurantee	 *
	 * victory, in which case it picks randomly. The nim sum of two	 *
	 * or more numbers is merely the XOR between them ie			 *
	 * nim sum = x ⊕ y ⊕ ... ⊕ z. Heap size refers to the number of	 *
	 * tokens in the heap.								 			 *
	 *---------------------------------------------------------------*/

	function startCompTurn() {
		// See if the last tokens were taken by the player
		if (tokens.length == 0)
			return (console.log('No More Tokens, Player Wins!'));

		var nimSumAll = 0;								// Nim-sum of all the heap sizes
		var nimSumEach = Array(tokens.length);			// Nim-sum of each heap size with nimSumAll

		nimSumAll = tokens[0].length;					// Calculate nim-sum of all the heap sizes
		for (var i=1; i<tokens.length; i++)
			nimSumAll ^= tokens[i].length;

		// If nimSumAll is zero, computer is in losing situation, so pick randomly
		if (nimSumAll == 0) {
			console.log("nimSumAll is zero, getting random token");
			var selectedCol = getRandomInt(0, tokens.length-1);
			var selectedTok = getRandomInt(0, tokens[selectedCol].length-1);
		}
		// else follow the optimal strategy procedure
		else {
			// Calculate nim sum of heap sizes and nimSumAll
			for (var i=0; i<tokens.length; i++)
				nimSumEach[i] = tokens[i].length ^ nimSumAll;

			// Find a heap in which nimSumEach is less than the heap size
			// The nimSumEach value for that heap is the number of tokens
			// that the heap should be reduced to
			for (var i=0; i<tokens.length; i++)	 {
				if (nimSumEach[i] < tokens[i].length) {
					var selectedCol = i;
					var selectedTok = nimSumEach[i];
					break;
				}
			}
		}

		highlightTokens(selectedCol, selectedTok);

		window.setTimeout(function() {
			removeTokens(selectedCol, selectedTok);
			if (tokens.length == 0)
				console.log('No More Tokens, Comp Wins!');
		}, 2000);

		// For Random computer selection
		// Calculate nim-sums of the sizes of the columns with nimSumAll
		/*var selectedCol = getRandomInt(0, tokens.length-1);
		// Continually get a new column if the selected column has no tokens
		while (tokens[selectedCol] == null)						
			selectedCol = getRandomInt(0, tokens.length-1);
		var selectedTok = getRandomInt(0, tokens[selectedCol].length-1);*/
	}

	/*---------------------------------------------------------------*
	 * highlightTokens() function									 *
	 *																 *
	 * Changes the background-color style property of a				 *
	 * token when a player mouse overs it.							 *
	 *---------------------------------------------------------------*/

	function highlightTokens(column, row) {
		for (var j=row; j<tokens[column].length; j++) {
			tokens[column][j].element.style.backgroundColor = 'green';
		}
	}

	/*---------------------------------------------------------------*
	 * unHighlightTokens() function									 *
	 *																 *
	 * Restores the color of a token when a player stops mousing	 *
	 * over it.														 *
	 *---------------------------------------------------------------*/

	function unHighlightTokens(column, row) {
		for (var j=row; j<tokens[column].length; j++) {
			tokens[column][j].element.style.backgroundColor = 'black';
		}
	}
}