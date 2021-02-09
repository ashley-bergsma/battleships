document.addEventListener("DOMContentLoaded", () => {
    // Now we're going to use class names from elements, to check that they're loaded before continuing 
    const userGrid = document.querySelector('.grid-user');
    // userSquares & computerSquares are used to keep track of the available squares in the game boards 
    const userSquares = []; 
    const computerGrid = document.querySelector('.grid-computer');
    const computerSquares = []; 
    const displayGrid = document.querySelector('.grid-display');
    // hardcoding all the user ships to start off in horizontal position 👇
    let isHorizontal = true; 
    // Selecting all the ships we'll need later in the JS 
    const ships = document.querySelectorAll('.ship');
    const destroyer = document.querySelector('.destroyer-container');
    const submarine = document.querySelector('.submarine-container');
    const cruiser = document.querySelector('.cruiser-container');
    const battleship = document.querySelector('.battleship-container');
    const carrier = document.querySelector('.carrier-container');
    // Selecting the buttons we'll need 
    const startButton = document.querySelector('#start');
    const rotateShip = document.querySelector('#rotate');
    // Div to see whose turn it is & info
    const turnDisplay = document.querySelector('#whose-go');
    const infoDisplay = document.querySelector('#info');

    // Creates Boards 
    const width = 10; 

    function createBoard(grid, squares, width) {
        for (let i=0; i<width * width; i++) {
            const square = document.createElement('div'); 
            // giving the square an id, the id is its place in the iteration 👇
            square.dataset.id = i; 
            // creating the grid squares, but we need to do something with it 👇
            // Targeting the display grid, we append the squares there 
            grid.appendChild(square); 
            // we're using this array (userSquares) to keep track of the squares 
            squares.push(square); 
        }
    }; 

    // Calling the function we built to make a grid, passing in the arguments we need! 
    createBoard(userGrid, userSquares, width); 
    createBoard(computerGrid, computerSquares, width); 

    // Ships 
    // This array contains all of the ships in the game, and their possible position depending on if they are rotated or not
    // directions are given as if 'painting' onto the screen using the 10X10 grid we created in the displays 
    const shipArray = [
        {
            name: 'destroyer', 
            directions: [
                [0, 1], // vertical - stacked NEXT to each other
                [0, width] // horizontal - 10 would be the first square in the next row - stack ON TOP of each other
            ]   
        }, 
        {
            name: 'submarine', 
            directions: [
                [0, 1, 2], 
                [0, width, width*2]
            ]
        }, 
        {
            name: 'cruiser', 
            directions: [
                [0, 1, 2], 
                [0, width, width*2]
            ]
        }, 
        {
            name: 'battleship', 
            directions: [
                [0, 1, 2, 3], 
                [0, width, width*2, width*3]
            ]
        }, 
        {
            name: 'carrier', 
            directions: [
                [0, 1, 2, 3, 4], 
                [0, width, width*2, width*3, width*4]
            ]
        }
    ]; 

    // Draws the computer's ships in "random" locations 
    function generate(ship) {
        // this floored, random number is used to pick between the two possible directions a ship can be facing
        let randomDirection = Math.floor(Math.random() * ship.directions.length); 
        // and this assigns the direction to a ship using bracket notation and the result of the above calculation 
        let current = ship.directions[randomDirection]; 
        if (randomDirection === 0) direction = 1;
        if (randomDirection === 1) direction = 10;
        // Now to assign a random start point in our grid 
        // Had to add the Math abs method, flooring wasn't enough to define a proper start space for the Carrier ships
        let randomStart = Math.abs(Math.floor(Math.random() * computerSquares.length - (ship.directions[0].length * direction))); 

        // Check to make sure that squares aren't taken, or are at the edges 
        const isTaken = current.some(index => computerSquares[randomStart + index].classList.contains('taken'))
        const isAtRightEdge = current.some(index => (randomStart + index) % width === width - 1); 
        const isAtLeftEdge = current.some(index => (randomStart + index) % width === 0); 

        // IF a square is not taken, not at the right edge, and not at the left edge... then
        if (!isTaken && !isAtRightEdge && !isAtLeftEdge){
            current.forEach((index) => {
                // here we actually add the 'taken' class name to be checked for 
                // also adds the ship NAME - i.e. carrier, submarine, etc 
                computerSquares[randomStart + index].classList.add('taken', ship.name)
            })
        } else {
            generate(ship)
        }
    }; 

    // could I just do a MAP to generate a ship for each ship in the shipsArray?
    generate(shipArray[0]);
    generate(shipArray[1]);
    generate(shipArray[2]);
    generate(shipArray[3]);
    generate(shipArray[4]); 

    // User functionality 
    // Rotate ships
    //! There's a lot of repition here - I can refactor this to be more DRY later.
    //? When I add a return after updating the isHorizontal variable it causes some odd behavior in my ships div. That goes away once it's removed. Don't I need to return though?
    function rotate() {
        if (isHorizontal) {
            destroyer.classList.toggle('destroyer-container-vertical');
            submarine.classList.toggle('submarine-container-vertical');
            cruiser.classList.toggle('cruiser-container-vertical');
            battleship.classList.toggle('battleship-container-vertical');
            carrier.classList.toggle('carrier-container-vertical'); 
            isHorizontal = false;
        }
        if (!isHorizontal) {
            destroyer.classList.toggle('destroyer-container');
            submarine.classList.toggle('submarine-container');
            cruiser.classList.toggle('cruiser-container');
            battleship.classList.toggle('battleship-container');
            carrier.classList.toggle('carrier-container'); 
            isHorizontal = true;
        }
    }
    // attaches the 👆 rotate function to the rotate button 👇
    rotateButton.addEventListener('click', rotate); 

    //! 🦄 Drag events 
/* -------------------------------------------------------------------------- */
/*                       About the HTML Drag & Drop API                       */
/* 
    We're using DRAGGABLE elements in this project. 
    These elements are provided to us by the HTML Drag and Drop API 

    The API uses the DOM event model - and the drag events available to us are inherited from mouse events 
    * Each even has an associated GLOBAL EVENT HANDLER - below we are using those globally available handlers 
    Assigning them to the interact-able squares 
    ? Learn more here: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
*/
/* -------------------------------------------------------------------------- */

// Adding Event Listeners 
ships.forEach(ship => ship.addEventListener('dragstart', dragStart)); 
userSquares.forEach(square => square.addEventListener('dragstart', dragStart));
userSquares.forEach(square => square.addEventListener('dragover', dragOver));
userSquares.forEach(square => square.addEventListener('dragenter', dragEnter)); 
userSquares.forEach(square => square.addEventListener('dragleave', dragLeave));
userSquares.forEach(square => square.addEventListener('drop', dragDrop));
userSquares.forEach(square => square.addEventListener('dragend', dragEnd));

// First we want to grab the id of the ship INDEX that's currently picked up by the user 
let selectedShipNameWithIndex 
let draggedShip
let draggedShipLength

ships.forEach(ship => ship.addEventListener('mousedown', (e) => {
    // this grabs the id of the square we actually select... so for longer ships that could be 0, 1, 2, 3 etc
    selectedShipNameWithIndex = e.target.id; 
    // testing 
    // console.log(selectedShipNameWithIndex); 
})); 

// * Now that we have that index, we use the build functionality with event handlers below

function dragStart() {
    draggedShip = this;
    draggedShipLength = this.childNodes.length
    // testing
    // console.log('dragged ship:', draggedShip); 
}

function dragOver(e) {
    e.preventDefault(); 
}

function dragEnter(e) {
    e.preventDefault(); 
}

function dragLeave() {
    console.log('drag leave'); 
}

//* Here is where the most stuff is going to happen! 
function dragDrop() {
    let shipNameWithLastId = draggedShip.lastChild.id; 
    // we are slicing the id we just grabbed 👆 
    // so that we can just get "submarine" "carrier" and so on! 
    let shipClass = shipNameWithLastId.slice(0, -2); 
    // Un-comment to see the result 👇
    // console.log('last id slice:', shipClass, shipNameWithLastId); 
    
    // * To make sure that we can place the ship where we are in the grid
    // we have to find what square of the USERGRID the LAST ELEMENT of our DRAGGEDSHIP is going to be in
    // we need to parse the substring we pull from shipNameWithLastId into an integer - so it can be used to place ships in the numbered userGrid
    let lastShipIndex = parseInt(shipNameWithLastId.substr(-1)); 
    let shipLastId = lastShipIndex + parseInt(this.dataset.id); 

    selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1)); 
    // testing - console.log(shipLastId, selectedShipIndex); 
    shipLastId = shipLastId - selectedShipIndex

    if (isHorizontal) {
        for (let i=0; i<draggedShipLength; i++) {
            // handling adding the 'taken' and proper class names to the userGrid when we drop a new ship onto them
            userSquares[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken', shipClass); 
        }
    } else if (!isHorizontal) {
        for (let i=0; i<draggedShipLength; i++) {
            // we're not incrementing by one this time... these ships stack
            // so we increment by TEN - the number we already set in the WIDTH variable - a handy way to remember its purpose 
            userSquares[parseInt(this.dataset.id) - selectedShipIndex + width * i].classList.add('taken', shipClass); 
        }
    } else return; 
    
    // Now that a ship has been moved, we want to remove it from the display grid 👇
    displayGrid.removeChild(draggedShip); 
    }
    //TODO - I need to account for ships running over space and clipping onto the next row. 
    //! But first... to debug my isHorizontal problem

    function dragEnd() {

    }


}); 