// Creating a list to hold the cards

let cardsArr = [
    "fa-diamond",
    "fa-paper-plane-o",
    "fa-anchor",
    "fa-bolt",
    "fa-cube",
    "fa-leaf",
    "fa-bicycle",
    "fa-bomb",
    "fa-diamond",
    "fa-paper-plane-o",
    "fa-anchor",
    "fa-bolt",
    "fa-cube",
    "fa-leaf",
    "fa-bicycle",
    "fa-bomb"
];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */


//Creating and adding the list of cards to the DOM and displaying them

const container = document.querySelector('.container');
const deck = document.querySelector('.deck');
const restart = document.querySelector('.restart');

function handleDisplayCards(array) {
    shuffle(cardsArr);
    clearCards();
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < cardsArr.length; i++) {
        const newList = document.createElement('li');
        newList.classList.add('card');
        const newSpan = document.createElement('span');
        newSpan.classList.add('fa');
        newSpan.classList.add(cardsArr[i]);
        newList.appendChild(newSpan);
        fragment.appendChild(newList);
    }

    deck.appendChild(fragment);
}

handleDisplayCards(cardsArr);

// Shuffle function from http://stackoverflow.com/a/2450976

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//Clear all cards when the user restarts the game or play again

function clearCards() {
    const cardList = document.querySelectorAll('.card');
    for (let i = 0; i < cardList.length; i++) {
        cardList[i].remove();
    }
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


//Setting up the Game Timer

const timer = document.querySelector('#timer');
let interval;

function startTimer(delay) {
    date = new Date();
    interval = setInterval(function() {
        const secondsInDays = 1000 * 60 * 60 * 24;
        const secondsInHours = 1000 * 60 * 60;
        const secondsInMinutes = 1000 * 60;

        let nowTime = new Date().getTime();
        const timeDifference = nowTime - date.getTime();
        const days = Math.floor(timeDifference / secondsInDays);
        const hours = Math.floor((timeDifference % (secondsInDays)) / (secondsInHours));
        const minutes = Math.floor((timeDifference % secondsInHours) / secondsInMinutes);
        const seconds = Math.floor((timeDifference % secondsInMinutes) / 1000);

        timer.textContent = ` ${minutes} : ${seconds}`;
    }, delay);
}


//adding the click event to the deck and starting the timer

let timerOn = false;
let gameEnded = false;

deck.addEventListener('click', function(event) {
    if (!gameEnded) {
        if (!timerOn) {
            startTimer();
            timerOn = true;
        }
        handleClickCard(event);
    }
});

//Handling what will happen the card is clicked

let openedCards = [];
let movesCount = 0;
let cardsCounter = 0;
let moves = document.querySelector('.moves');

function handleClickCard(event) {
    if (event.target.tagName === 'LI' && !event.target.classList.contains('open')) {
        const currentCard = event.target;
        currentCard.classList.add('open', 'show');
        movesCount++;
        moves.textContent = movesCount;
        cardsCounter++;
        openedCards.push(currentCard);
        updateStarsRate();
        if (cardsCounter == 2) {
            cardsCounter = 0;
            handleCheckMatch();
        }
    }
}

// Checking the moves counter to update the stars rating

let starsCount = 3;
const stars = document.querySelectorAll('.fa-star');
const gameModal = document.querySelector('#game-modal');

function updateStarsRate() {
    if (movesCount === 25) {
        stars[0].classList.add('dimmed');
        starsCount--;
    } else if (movesCount === 40) {
        stars[1].classList.add('dimmed');
        starsCount--;
    }
}

// Checking if the cards matched, if not, close them again

let matchCards = [];
let setDelay;
let pausedTime;

function handleCheckMatch() {
    let firstCard = openedCards[0].firstElementChild;
    let secondCard = openedCards[1].firstElementChild;

    if (firstCard.className === secondCard.className) {
        matched();
    } else {
        unmatched();
    }
}

//Matched cards will be marked as matched

function matched() {
    //Adding the animation class to the cards
    openedCards[0].classList.add('match', 'shake');
    openedCards[1].classList.add('match', 'shake');
    setDelay = setTimeout(function() {
        matchCards.push(openedCards[0], openedCards[1]);
        openedCards = [];

        //Checking if all cards are oppened to display the win modal
        if (matchCards.length === 16) {
            pausedTime = timer.textContent.trim();
            clearInterval(interval);
            handleWinGame();
        }
    }, 1000);
}

//Unmatch cards will be closed

function unmatched() {
    //Adding the animation class to the cards
    openedCards[0].classList.add('shake', 'unmatched');
    openedCards[1].classList.add('shake', 'unmatched');
    setDelay = setTimeout(function() {
        openedCards[0].classList.remove('open', 'show', 'shake', 'unmatched');
        openedCards[1].classList.remove('open', 'show', 'shake', 'unmatched');
        openedCards = [];
    }, 1000);
}

// Displaying the Game Modal (the winning pop-up)

const playAgain = document.querySelector('.play-again');
const closeModal = document.querySelector('.fa-close');
const winScore = document.querySelector('.win-score');

function handleWinGame() {

    gameModal.style.display = "block";
    winScore.textContent = `${movesCount} Moves, ${starsCount} Stars and Time Taken ${pausedTime} That's Incredible!`;

    // Calls handleResetAll function and restarting the game
    playAgain.addEventListener('click', function(event) {
        gameModal.style.display = "none";
        handleResetAll();
    });

    closeModal.addEventListener('click', function(event) {
        gameModal.style.display = "none";
        handleResetAll();
    });
}

// Calls handleResetAll function and restarting the game

restart.addEventListener('click', function(event) {
    handleResetAll();
});

// Reset all stars to the default state

function resetStars() {
    stars.forEach(function(star) {
        star.classList.remove('dimmed');
    });
}

// Reset all variables, counters, timers, classes

function handleResetAll() {
    timerOn = false;
    gameEnded = false;
    matchCards = [];
    openedCards = [];
    cardsCounter = 0;
    movesCount = 0;
    moves.textContent = movesCount;
    clearTimeout(setDelay);
    clearInterval(interval);
    timer.textContent = '0 : 0'
    resetStars();
    handleDisplayCards(cardsArr);
}