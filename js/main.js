/*----------------------------------------------------------------------------*
 * Title:          main.js                                                    *
 * Author:         Roberto Gomez                                              *
 * Date:           12/30/13                                                   *
 * Description:    A robust and versatile take on the Game of Nim using       *
 *                 JavaScript to manipulate DOM elements.                     *
 *----------------------------------------------------------------------------*/

var Nim = (function() {
    var maxHeaps = 5,                               // Maximum number of heaps possible
        maxTokens = 5,                              // Maximum number of tokens possible per heap
        dx = 400/maxHeaps,                          // Column and row sizes in pixels
        dy = 350/maxTokens,                         // Used for calculating position of Token objects
        playerScore = 0,                            // Number of wins for player
        compScore = 0,                              // Number of wins for computer
        tokens;                                     // Array for storing Token objects

    // Create a reference variable for accessing the game's boundaries
    var playArea = document.getElementById("play-area");

    /*----------------------------------------------------------------------------*
     * Token() constructor                                                        *
     *                                                                            *
     * Constructor for creating the Token objects. Heap and order are             *
     * sub-properties of the element property because they need to be             *
     * accessible using the "this" keyword when the event listeners are added in  *
     * startGame().                                                               *
     *----------------------------------------------------------------------------*/

    var Token = function (pos_x, pos_y, heap, order) {
        this.pos_x = pos_x;                                 // X position for CSS left property
        this.pos_y = pos_y;                                 // Y position for CSS top property
        this.element = document.createElement("div");       // HTML element placed in DOM
        this.element.heap = heap;                           // Index values that correspond to the
        this.element.order = order;                         // tokens array, eg tokens[heap][order]

        /*
         * highlight() method
         *
         * Changes the background-color style property of the selected token as
         * well as the tokens above it. The if statement is necessary for
         * preventing access outside of the tokens array.
         */

        this.highlight = function(event) {
            this.element.style.backgroundColor = "green";

            // Call highlight() of the next Token, but not if it is the last one in the heap
            if (this.element.order+1 !== tokens[this.element.heap].length)
                tokens[this.element.heap][this.element.order+1].highlight();
        };

        /*
         * unHighlight() method
         *
         * Restores the color of tokens modified by the hightlight() method.
         */

        this.unHighlight = function(event) {
            this.element.style.backgroundColor = "black";

            if (this.element.order+1 !== tokens[this.element.heap].length)
                tokens[this.element.heap][this.element.order+1].unHighlight();
        };

        // Register the methods to fire on the appropriate UI events
        // The value of "this" needs to be corrected using the bind() method
        this.element.addEventListener("mouseover", this.highlight.bind(this), false);
        this.element.addEventListener("mouseout", this.unHighlight.bind(this), false);
    };

    /*----------------------------------------------------------------------------*
     * startGame() function                                                       *
     *                                                                            *
     * Fired by the play button. Sets up a round of Nim by generating a random    *
     * array of Token objects and assigs event listeners to them. The listeners   *
     * call functons that are central to the game play such as removing tokens,   *
     * starting the computer's move, and highlighting and unhighlighting tokens.  *
     *----------------------------------------------------------------------------*/

    var startGame = function() {
        var numOfHeaps = getRandomInt(2, maxHeaps);         // Number of heaps in this round     

        document.getElementById("play-button").style.display = "none";      // Hide the play button

        // Create a random 2D array for storing the Token objects
        // First index represents the heap, second index represents the Token in each heap
        tokens = Array(numOfHeaps);
        for (var i=0; i<numOfHeaps; i++)
            tokens[i] = Array(getRandomInt(2, maxTokens));

        // Populate playArea with tokens
        for (i=0; i<tokens.length; i++) {
            for (var j=0; j<tokens[i].length; j++) {
                tokens[i][j] = new Token(((20 + i * dx)), (400 - (dy + j * dy)), i, j);
                playArea.appendChild(tokens[i][j].element);
                tokens[i][j].element.classList.add("token");

                // Specify location of each token
                tokens[i][j].element.style.left = tokens[i][j].pos_x + 'px';
                tokens[i][j].element.style.top = tokens[i][j].pos_y + 'px';
            }
        }
    };

    /*----------------------------------------------------------------------------*
     * getRandomInt() function                                                    *
     *                                                                            *
     * Returns a random integer between min and max                               *
     * Using Math.round() will give you a non-uniform distribution!               *
     *----------------------------------------------------------------------------*/
 
    var getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    return {
        init: function() {      // Public method used to begin the game
            startGame();
        }
    };
})();

