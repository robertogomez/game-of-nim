/*-------------------------------------------------------------------*
 *	Title:			main.js											 *
 *	Author:			Roberto Gomez									 *
 *	Date:			6/5/13											 *
 *	Description:	A robust and versatile take on the Game of Nim	 *
 *					using JS to manipulate DOM elements.			 *
 *-------------------------------------------------------------------*/

// Variable for handling playButton link
var playButton = document.getElementById('playButton');

// Division sizes in pixels to draw tokens in playArea
var dx = 400/3;
var dy = 350/5;

// 2D array for storing tokens
var tokens = Array(3);
tokens[0] = Array(5);
tokens[1] = Array(3);
tokens[2] = Array(1);
for (var i=0; i<tokens.length; i++)
	for (var j=0; j<tokens[i].length; j++)
		// Create div element to represent a token
		tokens[i][j] = document.createElement('div');

function startGame()
{
	playButton.style.display = 'none';			// Hide playButton link		

	for (var i=0; i<tokens.length; i++) {
		for (var j=0; j<tokens[i].length; j++) {	
			// Add token div to HTML document
			document.body.appendChild(tokens[i][j]);			
			// Apply token class
			tokens[i][j].classList.add('token');
			// Adjust location of tokens
			tokens[i][j].style.top = 400 - (dy + j * dy) + 'px';
			tokens[i][j].style.left = (dx + i * dx) - 100 + 'px';
		}
	}
}