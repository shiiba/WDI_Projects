// $(function(){

  //////////////////////////
  ////// GAME OBJECTS //////
  //////////////////////////

  // player objects
  var player = {
    bankroll: 1000,
    currentHand: [],
    handValue: 0,
    currentBet: null,
    handDiv: "player-hand"
  };

  var dealer = {
    currentHand: [],
    handValue: 0,
    handDiv: "dealer-hand"
  };

  // card objects
  var suits = ["Clubs", "Diamonds", "Hearts", "Spades"];

  var valuePoints = [
    {value: "Ace", points: 1},
    {value: "Two", points: 2},
    {value: "Three", points: 3},
    {value: "Four", points: 4},
    {value: "Five", points: 5},
    {value: "Six", points: 6},
    {value: "Seven", points: 7},
    {value: "Eight", points: 8},
    {value: "Nine", points: 9},
    {value: "Ten", points: 10},
    {value: "Jack", points: 10},
    {value: "Queen", points: 10},
    {value: "King", points: 10}
  ];

  var someoneBusted = false;  // [do i need this for a while condition?]

  //////////////////////////
  /// GAMEPLAY FUNCTIONS ///
  //////////////////////////

  var createDeck = function(numDecks){   // take in the number of decks and generate an unshuffled deck array
    var deck = [];
    for(var d=0;d<numDecks;d++){
      for(var i=0;i<suits.length;i++){
        for(var j=0;j<valuePoints.length;j++){
          var card = {};
          card.name = (valuePoints[j].value + " of " + suits[i]);
          card.value = valuePoints[j].value;
          card.suit = suits[i];
          card.points = valuePoints[j].points;
          deck.push(card);
        }
      }
    }
    return deck;
  };

  var printCurrentHand = function(player){   // visually print out deck to check if it is shuffled
    for(var i=0;i<player.currentHand.length;i++){
      var deckDiv = document.getElementById(player.handDiv);
      var card = document.createElement("p")
      card.innerHTML = player.currentHand[i].name;
      deckDiv.appendChild(card);
    }
  };

  var printCard = function(player,dealtCard){
    var deckDiv = document.getElementById(player.handDiv);
    var card = document.createElement("p")
    card.innerHTML = dealtCard.name;
    deckDiv.appendChild(card);
  }

  var shuffleDeck = function(unshuffled){   // trying to shuffle using a modern Fisher-Yates algorithm
    var shuffled = [];
    var numTimes = unshuffled.length;
    for(var i=0;i<numTimes;i++){
      var j = Math.floor(Math.random()*unshuffled.length);
      var k = (unshuffled.length-1);
      shuffled.push(unshuffled[j]);
      unshuffled[j] = unshuffled[k];
      unshuffled.pop();
    }
    return shuffled;
  };

  var getPlayerName = function(){   // get player's name 
    return prompt("What is your name?", "Name");
  };

  var resetBankroll = function(){   // resets player bankroll
    player.bankroll = 1000;
  };

  var placeBet = function(){
    var betString = prompt("How much would you like to bet?","10");   // should prompt for bet Amount
    var playerBet = parseInt(betString);   // convert to number
    player.currentBet = playerBet;   // set player currentBet to the input amount
    player.bankroll -= playerBet;   // decrement player bankroll by that amount
  };

  var dealCards = function(){   // pop cards off the shuffled deck array and show 2 for each player
    player.currentHand.push(shuffledDeck.pop());
    dealer.currentHand.push(shuffledDeck.pop());   // (*) this should be face down
    player.currentHand.push(shuffledDeck.pop());
    dealer.currentHand.push(shuffledDeck.pop());
    console.log("Deck has " + shuffledDeck.length + " cards left");
    // (*) [for now, just display cards all at once; later animate one at a time]
    printCurrentHand(player);
    printCurrentHand(dealer);
    setHandValue(player);
    setHandValue(dealer);
  };

  var setHandValue = function(person){   // run each time a new card is dealt to set the handValue
    var pointsArray = person.currentHand.map(function(e){return e.points});   // grab the point value of all cards in currentHand
    person.handValue = pointsArray.reduce(function(a,b){return a+b});   // add them together and set to handValue
  }

  var hitOrStay = function(){   // prompt user to hit or stay
    var inputVal = prompt("Hit (h) or Stay (s)?");   // (*) [use buttons for choosing later?]
    if(inputVal === "h"){   // if hit, run dealNextCard() and if they don't bust, ask to hit or stay again
      dealNextCard(player);
      bustCheckPlayer();
      hitOrStay();
    } else if(inputVal === "s"){   // if stay, run dealerPlays();
      dealerPlays();
    }
  };

  var dealNextCard = function(person){
    var card = shuffledDeck.pop();   // pops off next card in the shuffled deck array
    person.currentHand.push(card);
    setHandValue(person);
    printCard(person,card);
  };

  var bustCheckPlayer = function(){
    // check if player has busted
    // if there's an ace in the hand, optimizeAce(), which checks for highest value of Ace that doesn't bust
    // if not bust, run hitOrStay();
    // if bust, set someoneBusted to true; houseWins(player.currentBet);
  };

  var dealerPlays = function(){
    // if(dealer.handValue < 17){dealNextCard(); bustCheckDealer();}
    // if(dealer.handValue >=17 && <=21){dealerStay();}
  };

  var bustCheckDealer = function(){
    // check if dealer has busted
    // if there's an ace in the hand, optimizeAce(), which checks for highest value of Ace that doesn't bust
    // if bust, set someoneBusted to true; housePays(player.currentBet * 2);
  };

  var optimizeAce = function(hand){
    // checks for highest value of the Ace that doesn't bust
    // sets ace to that value
  };

  var dealerStay = function(){
    // compareHands();
  };

  var compareHands = function(playerHand, dealerHand){
    // optimizeAce(playerHand);
    // optimizeAce(dealerHand);
    // either houseWins(); or housePays(); or pushHands();
  };

  var houseWins = function(){
    // takes player's currentBet
    // sets players currentBet to zero
    // bankrollCheck();
    // redeal();
  };

  var housePays = function(){
    // player's bankroll increases by double their currentBet amount
    // bankrollCheck();
    // redeal();
  };

  var pushHands = function(){
    // add player's currentBet back to their bankroll
    // redeal();
  }

  var redeal = function(){
    // clear player and dealer currentHand
    // placeBet();
    // dealCards();
  }

  var bankrollCheck = function(){
    // if player bankroll <= 0, 
  }

  var gameOver = function(){
    // game over message
    // replay() prompt
  }

  var replay = function(){
    // getPlayerName();
    // resetBankroll();
  }

  //////////////////////////
  /////// GAMEPLAY  ////////
  //////////////////////////

  // - As a player, when I refresh the page, I should be asked to enter my name
  getPlayerName();

  // - As a player, when I enter my name, I should see my bankroll and a prompt asking me to place a bet
  // initializeGameplay(); // HOW SHOULD THIS WORK?
  var unshuffledDeck = createDeck(1);
  var shuffledDeck = shuffleDeck(unshuffledDeck);
  // printDeck(shuffled);
  // console.log(shuffledDeck);
  // console.log(shuffledDeck.length);

  resetBankroll();
  placeBet();

  // - As a player, once I've placed a bet, the dealer should deal the cards
  dealCards();

  // // - As a player, when the hands are dealt, I should be prompted to hit or stay ( (*) or split or double down)
  hitOrStay();

  // // - As a player, if I decide to hit, a new card is dealt to me and if I'm over 21, I bust
  // dealNextCard();
  // bustCheckPlayer();

  // // - As a player, if I don't bust, I should be prompted to hit or stay again
  // if(bustCheckPlayer === false){
  //   hitOrStay();
  // }

  // // - As a player, if I decide to stay, it's the dealers turn
  // // if(stay === true){
  //   dealerPlays();
  // // }

  // // - As a dealer, if my card values add up to less than 17, I should automatically hit
  // if(dealer.handValue < 17){
  //   dealNextCard();
  //   bustCheckDealer();
  // }

  // // - As a dealer, if my card equals 17 or higher, I should automatically stay
  // if(dealer.handValue >= 17 && dealer.handValue <= 21){
  //   dealerStay();
  // }

  // // - As a dealer, once I bust or stay, I should compare the hands
  // if(bustCheckDealer === false && dealerStay === true){
  //   compareHands() && optimizeAce();
  // }

  // // - As a dealer, if I win, I should take the money the player bet
  // if(dealerWin === true){
  //   houseWins(player.currentBet);
  // }

  // // - As a dealer, if I lose, I should pay money equal to the player bet
  // if(dealerWin === false){
  //   housePays(player.currentBet);
  // }

  // // - As a player, after the hand, I am prompted to place a bet again
  // placeBet();
  // dealCards();

  // // - As a player, if I run out of money, I lose the game
  // // - As a player, if I lose the game, I should be prompted if I want to play again
  // if(player.bankroll <= 0){
  //   alert("Game Over.");
  //   prompt("Play again?") ? gameReset() : endGame();
  // }

// });
