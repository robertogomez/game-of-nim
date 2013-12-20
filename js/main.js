/*----------------------------------------------------------------------------*
 *  Title:          main.js                                                   *
 *  Author:         Roberto Gomez                                             *
 *  Date:           12/20/13                                                  *
 *  Description:    A robust and versatile take on the Game of Nim using      *
 *                  JavaScript to manipulate DOM elements.                    *
 *----------------------------------------------------------------------------*/

// The onclick properties for the buttons need to be specified in global scope
// so that they can fire their functions before the startGame function is called
document.getElementById('help-button').onclick = showHelp;

// Create reference variable for play-area so that elements can be added to it
var playArea = document.getElementById('play-area');

/*----------------------------------------------------------------------------*
 * showHelp() function                                                        *
 *                                                                            *
 * Shows the help dialogue to instruct the user how to play the game. If the  *
 * 'help' div has not yet been created and added to the DOM, it does so. If   *
 * it has, it merely toggles its visibility.                                  *
 *----------------------------------------------------------------------------*/

function showHelp() {
    var help = document.getElementById('help');

    // Create the help dialogue if it does not exist in the DOM yet
    // getElementById returns null if the element with the ID is not in the DOM
    // It would be nice to use (typeof help === 'null') but typeof null returns 'object'
    if (help === null) {
        var helpTitle = document.createElement('h3'),
            titleText = document.createTextNode("How to Play Nim"),
            p = document.createElement('p'),
            instructions =
                "The objective of the game is to select the last token. " +
                "Tokens can only be taken from one heap at a time. " +
                "When you select a token, any tokens above it in the same " +
                "heap will be removed as well.",
            helpText = document.createTextNode(instructions),
            okButton = document.createElement('button'),
            okButtonText = document.createTextNode('OK');

        help = document.createElement('div');
        playArea.appendChild(help);
        help.classList.add('help');
        help.id = 'help';

        help.appendChild(helpTitle);
        helpTitle.appendChild(titleText);
        help.appendChild(p);
        p.appendChild(helpText);

        help.appendChild(okButton);
        okButton.id = 'ok-button';
        okButton.appendChild(okButtonText);

        // Hide the menu when button is clicked
        okButton.onclick = function () {help.style.visibility = 'hidden';};
 
        // Hide the dialogue when it is clicked
        help.onclick = function() {help.style. visibility = 'hidden';};
    }
    else if (help.style.visibility === 'hidden')        // The help dialogue is already created
        help.style. visibility = 'visible';             // so either toggle it on
    else
        help.style. visibility = 'hidden';              // or toggle it off
}

/*----------------------------------------------------------------------------*
 * startGame() function                                                       *
 *                                                                            *
 * Called by the playButtton. Initiates the setup required for a round of     *
 * nim, which consists of generating a random array of tokens and assigning   *
 * event listeners to them. The listeners call functions that are central to  *
 * the game play such as removing tokens, starting the computer's move, and   *
 * highlighting and unhighlighting tokens.                                    *
 *----------------------------------------------------------------------------*/

function startGame() {
    var maxHeaps = 5,                               // Maximum number of heaps possible
        maxTokens = 5,                              // Maximum number of tokens possible per heap
        numOfHeaps = getRandomInt(2, maxHeaps),     // Actual number of heaps in this round     
        dx = 400/maxHeaps,                          // Column and row sizes in pixels
        dy = 350/maxTokens;                         // Used for calculating position of Token objects

    // Create random 2D array for storing Token objects
    // First index represents the heap, second index represents the Token in each heap
    var tokens = Array(numOfHeaps);
    for (var i=0; i<numOfHeaps; i++)
        tokens[i] = Array(getRandomInt(2, maxTokens));

    document.getElementById('playButton').style.display = 'none';   // Hide playButton link

    for (i=0; i<tokens.length; i++) {
        for (var j=0; j<tokens[i].length; j++) {
            // Create Token objects and assign to tokens array
            tokens[i][j] = new Token(((20 + i * dx)), (400 - (dy + j * dy)), i, j);
            playArea.appendChild(tokens[i][j].element);         // Add token element to DOM
            tokens[i][j].element.classList.add('token');        // Apply token CSS class from nim.css

            // Specify location of tokens in DOM
            tokens[i][j].element.style.left = tokens[i][j].pos_x + 'px';
            tokens[i][j].element.style.top = tokens[i][j].pos_y + 'px';

            // Add event listeners to trigger functions when a token is clicked and moused over
            tokens[i][j].element.addEventListener("click", function(){removeTokens(this.heap, this.order);}, false);
            tokens[i][j].element.addEventListener("click", delayCompTurn, false);
            tokens[i][j].element.addEventListener("mouseover", function(){highlightTokens(this.heap, this.order);}, false);
            tokens[i][j].element.addEventListener("mouseout", function(){unHighlightTokens(this.heap, this.order);}, false);
        }
    }

    /*----------------------------------------------------------------------------*
     * Token() constructor function                                               *
     *                                                                            *
     * Constructor function for creating Token objects. Heap and order are        *
     * sub-properties of the element property because they need to be             *
     * accessible using the "this" keyword when the event listener for            *
     * removeTokens() is added to the Token objects.                              *
     *----------------------------------------------------------------------------*/

    function Token(pos_x, pos_y, heap, order) {
        this.pos_x = pos_x;                                 // X position for CSS left property
        this.pos_y = pos_y;                                 // Y position for CSS top property
        this.element = document.createElement('div');       // HTML element placed in DOM
        this.element.heap = heap;                           // Index values that correspond to the
        this.element.order = order;                         // tokens array, eg tokens[heap][order]
    }

    /*----------------------------------------------------------------------------*
     * getRandomInt() function                                                    *
     *                                                                            *
     * Returns a random integer between min and max                               *
     * Using Math.round() will give you a non-uniform distribution!               *
     *----------------------------------------------------------------------------*/

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /*----------------------------------------------------------------------------*
     * removeTokens() function                                                    *
     *                                                                            *
     * Removes the token specified by the column and row parameters from both the *
     * DOM and the tokens array. Also checks if the column is depleted of tokens, *
     * and if so, decrements the heap properties of all the tokens that are after *
     * it and removes it from the tokens array.                                   *
     *----------------------------------------------------------------------------*/

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

        if (tokens[column].length === 0) {
            for (var i=column+1; i<tokens.length; i++)
                for (j=0; j<tokens[i].length; j++)
                    tokens[i][j].element.heap--;
            tokens.splice(column, 1);
        }
    }

    /*----------------------------------------------------------------------------*
     * delayCompTurn() function                                                   *
     *                                                                            *
     * Function used to call startCompTurn() after 2 sec. Necessary to cause a    *
     * delay after the player has moved and before the computer makes its         *
     * selection.                                                                 *
     *----------------------------------------------------------------------------*/

    function delayCompTurn() {
        window.setTimeout(startCompTurn, 2000);
    }

    /*----------------------------------------------------------------------------*
     * startCompTurn() function                                                   *
     *                                                                            *
     * Responsible for starting the computer's turn at selecting tokens. Checks   *
     * the length of the tokens array to see if there are tokens still remaining. *
     * Calculates nim sums to determine the best possible selection to ensure its *
     * victory. If the value of nimSumAll is zero, the computer can not gaurantee *
     * victory, in which case it picks randomly. The nim sum of two or more       *
     * numbers is merely the XOR between them ie nim sum = x₁ ⊕ x₂ ⊕ ... ⊕ xₙ.    *
     * Heap size refers to the number of tokens in the heap.                      *
     *----------------------------------------------------------------------------*/

    function startCompTurn() {
        // See if the last tokens were taken by the player
        if (tokens.length === 0)
            return (console.log('No More Tokens, Player Wins!'));

        var nimSumAll = 0,                              // Nim-sum of all the heap sizes
            nimSumEach = Array(tokens.length),          // Nim-sum of each heap size with nimSumAll
            selectedCol, selectedTok;                   // Indices of the computer's selected token

        nimSumAll = tokens[0].length;                   // Calculate nim-sum of all the heap sizes
        for (var i=1; i<tokens.length; i++)
            nimSumAll ^= tokens[i].length;

        // If nimSumAll is zero, computer is in losing situation, so pick randomly
        if (nimSumAll === 0) {
            selectedCol = getRandomInt(0, tokens.length-1);
            selectedTok = getRandomInt(0, tokens[selectedCol].length-1);
        }
        // else follow the optimal strategy procedure
        else {
            // Calculate nim sum of heap sizes and nimSumAll
            for (i=0; i<tokens.length; i++)
                nimSumEach[i] = tokens[i].length ^ nimSumAll;

            // Find a heap in which nimSumEach is less than the heap size
            // The nimSumEach value for that heap is the number of tokens
            // that the heap should be reduced to
            for (i=0; i<tokens.length; i++) {
                if (nimSumEach[i] < tokens[i].length) {
                    selectedCol = i;
                    selectedTok = nimSumEach[i];
                    break;
                }
            }
        }

        highlightTokens(selectedCol, selectedTok);

        // The check for tokens.length needs to be called after removeTokens
        // inside the anonymous function so that the length property is
        // updated after the Tokens are removed
        window.setTimeout(function() {
            removeTokens(selectedCol, selectedTok);
            if (tokens.length === 0)
                console.log('No More Tokens, Comp Wins!');
        }, 2000);
    }

    /*----------------------------------------------------------------------------*
     * highlightTokens() function                                                 *
     *                                                                            *
     * Changes the background-color style property of a token. Called when the    *
     * player mouses overs a token or after the computer has made its selection.  *
     *----------------------------------------------------------------------------*/

    function highlightTokens(column, row) {
        for (var j=row; j<tokens[column].length; j++) {
            tokens[column][j].element.style.backgroundColor = 'green';
        }
    }

    /*----------------------------------------------------------------------------*
     * unHighlightTokens() function                                               *
     *                                                                            *
     * Restores the color of a token when a player stops mousing over it. A       *
     * preliminary check to see if tokens[column] is defined is necessary to      *
     * avoid referencing erros from being thrown once a column of tokens has been *
     * removed.                                                                   *
     *----------------------------------------------------------------------------*/

    function unHighlightTokens(column, row) {
        if (typeof tokens[column] !== 'undefined')
            for (var j=row; j<tokens[column].length; j++)
                tokens[column][j].element.style.backgroundColor = 'black';
    }
}

