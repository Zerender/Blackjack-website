var dealerSum = 0; //controls sum of cards
var playerSum = 0;

var dealerAceCount = 0; //checks ace count for overflow + insurace
var playerAceCount = 0;

var hidden;
var deck;

var canHit = true; //must be true to hit

var deckNum = 1; //set the number of decks to play
var stand17 = true; //sets whether to hit or stand on soft 17

var endGame = false;

var message; //message to print when you win/lose

window.onload = function() {
    playGame();
}

function playGame() {
    buildDeck();
    shuffle();
    startGame();
}

function buildDeck() {
    let vals = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
    let suits = ["hearts", "diamonds", "clubs", "spades"];
    deck = [];
    for (let d = 0; d < deckNum; d++) {
        for (let i = 0; i < suits.length; i++) {
            for (let j = 0; j < vals.length; j++) {
                deck.push(vals[j] + "_of_" + suits[i]);
            }
        }
    }
}

function shuffle() {
    for (let i = 0; i< deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // sets j to 0-51
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    dealDealer();
    for (let i = 0; i < 2; i++) {
        dealPlayer();
    }

    if (playerSum == 21 && dealerSum != 21) {
        message = "Blackjack!";
            gameOver();
    }

    if (dealerSum == 21 && playerSum != 21) {
        message = "Dealer Blackjack, You Lose!";
            gameOver();
    }

    if (dealerSum == 21 && playerSum == 21) {
        message = "Tie!";
            gameOver();
    }


    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stand").addEventListener("click", stand);
}

function dealerTurn() {
    if (stand17 == false && dealerAceCount == 1 && dealerSum == 17) {
        dealDealer();
    } 
    while (dealerSum < 17) {
    /*    setTimeout(function () {
            dealDealer();
        }, 1000); 
        */
        dealDealer();
    }

    if (dealerSum > 21) {
        message = "Dealer Busts, You Win!";
        gameOver();
    }

    
}

function dealDealer() {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./Card images/" + card + ".png";
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    if(dealerSum > 21 && dealerAceCount > 0) {
        dealerSum -= 10;
        dealerAceCount--;
    }
    document.getElementById("dealer-cards").append(cardImg);
}

function dealPlayer() {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./Card images/" + card + ".png";
    playerSum += getValue(card);
    playerAceCount += checkAce(card);
    console.log(playerSum);
    console.log(playerAceCount);
    if(playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount--;
    }
    document.getElementById("player-cards").append(cardImg);
    document.getElementById("player-sum").innerText = playerSum;
}

function hit(){
    if(canHit) {
        dealPlayer();
    }

    if (reduceAce(playerSum, playerAceCount) > 21) {
        canHit = false;
        message = "You Bust!";
            gameOver();
    }
}

function stand() {
    canHit = false;
    if(!endGame) {
        dealerTurn();
        document.getElementById("hidden").src = "./Card images/" + hidden + ".png";
        if(dealerSum < 22) {
            if (playerSum > dealerSum) {
                message = "You Win!";
                gameOver();
            } else if (playerSum < dealerSum) {
                message = "You Lose!";
                gameOver();
            } else {
                message = "Tie!";
                gameOver();
            }    
        }
    }
    
}

function gameOver() {
    canHit = false;
    endGame = true;
    document.getElementById("hidden").src = "./Card images/" + hidden + ".png";
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("player-sum").innerText = playerSum;
    document.getElementById("results").innerText = message;
}


function getValue(card) {
    let data = card.split("_");
    let val = data[0];
    if (isNaN(val)) {
        if (val == "ace") {
            return 11;
        }
        return 10;
    }
    return parseInt(val);
}

function checkAce(card) {
    let data = card.split("_");
    let val = data[0];
    if (val == "ace") {
        return 1;
    }
    return 0;
}

function reduceAce(sum, aceCount) {
    while (sum > 21 && aceCount > 0) {
        sum -= 10;
        aceCount -= 1;
    }
    return sum;
}

