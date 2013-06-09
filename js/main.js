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

// Create div element to represent a token
// i corresponds to the column of tokens
// j corresponds to the number of tokends in each column
/*for (var i=0; i<tokens.length; i++)
	for (var j=0; j<tokens[i].length; j++)
		tokens[i][j] = new Token();*/

function startGame()
{
	playButton.style.display = 'none';			// Hide playButton link		

	for (var i=0; i<tokens.length; i++) {
		for (var j=0; j<tokens[i].length; j++) {	
			// Add token div to HTML document & apply token class
			tokens[i][j] = new Token(((dx + i * dx) - 100),
			(400 - (dy + j * dy)), i, j);
			document.body.appendChild(tokens[i][j].element);			
			tokens[i][j].element.classList.add('token');

			// Adjust location of tokens
			tokens[i][j].element.style.top = 400 - (dy + j * dy) + 'px';
			//tokens[i][j].element.style.top = tokens[i][j].pos_y + 'px';
			tokens[i][j].element.style.left = (dx + i * dx) - 100 + 'px';

			// Add onclick property to trigger remove function
			tokens[i][j].element.onclick = remove;

			// Add event listener for each token
			//tokens[i][j].addEventListener("click", remove, false);

			// Add event listener for each token with anonymous function
			// call to supply row and col indices as parameters
			//tokens[i][j].addEventListener("click", function(){remove(i, j)}, false);
		}
	}
}

// need a way to get i and j when onclick is triggered
// look into get methods, or this
function remove()
{
	/*var playArea = document.getElementById('play-area');
	var token = tokens[i][j];
	token.parentNode.removeChild(token);*/
	//alert(this);
	//tokens[i][j].parentNode.removeChild(tokens[i][j]);
	alert("token[" + this.row + "][" + this.col + "]");
	this.parentNode.removeChild(this);
	/*this.style.display = 'none';*/
}

// Constructor function for token objects
function Token(pos_x, pos_y, row, col) {
	this.pos_x = pos_x;
	this.pos_y = pos_y;
	this.row = row;
	this.col = col;
	this.element = document.createElement('div');
	//this.element = "div";
	this.element.row = row;
	this.element.col = col;
}

/*
Remove tokens issue
its a problem when supplying arguments to remove function
When trying to remove individual tokens, all of them get removed after
play button is clicked
Maybe during a round, just hide the tokens, and at end of round removeChild 
them all
or specify id's for each individual token and do 
var token = document.getElementById('21');
token.parentNode.removeChild(token);
or use appendChild to add tokens under a parent div for each column
or create separate parent div to place all tokens in


this.id, that is the id of each token is undefined so perhaps define
id's for each token created so that you can reference them by id instead
of having to pass the i and j indexes to the remove function

create all tokens as children of each other so that when user clicks on one
all the children of that token are removed as well
*/