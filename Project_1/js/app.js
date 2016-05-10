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

  var resetBets = function(){
    player.currentBet = 0;
  };

  var resetHands = function(){
    player.currentHand = [];
    player.handValue = 0;
    $("#player-hand").empty();
    dealer.currentHand = [];
    dealer.handValue = 0;
    $("#dealer-hand").empty();
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
    hitOrStay();
  };

  var setHandValue = function(person){   // run each time a new card is dealt to set the handValue
    var pointsArray = person.currentHand.map(function(e){return e.points});   // grab the point value of all cards in currentHand
    person.handValue = pointsArray.reduce(function(a,b){return a+b});   // add them together and set to handValue
  }

  var hitOrStay = function(){   // prompt user to hit or stay
    var inputVal = prompt("Hit (h), Stay (s) or e(x)it?");   // (*) [use buttons for choosing later?]
    if(inputVal === "h"){   // if hit, run dealNextCard() and if they don't bust, ask to hit or stay again
      dealNextCard(player);
      bustCheckPlayer();
    } else if(inputVal === "s"){   // if stay, run dealerPlays();
      dealerPlays();
    } else if (inputVal === "x"){   // [remove later]
      return false;
    }
  };

  var dealNextCard = function(person){
    var card = shuffledDeck.pop();   // pops off next card in the shuffled deck array
    person.currentHand.push(card);
    setHandValue(person);
    printCard(person,card);
  };

  var bustCheckPlayer = function(){   // check if player has busted
    // if(aceInHand){
    //   // if there's an ace in the hand, optimizeAce(), which checks for highest value of Ace that doesn't bust
    // }
    if(player.handValue > 21){
      alert("You BUSTED!!");
      someoneBusted = true;
      houseWins(player.currentBet);
    } else {
      hitOrStay();
    }
  };

  var dealerPlays = function(){
    if(dealer.handValue < 17){
      console.log("Dealer Hits!")
      dealNextCard(dealer); 
      bustCheckDealer();
    } else if(dealer.handValue >=17 && dealer.handValue <= 21){
      console.log("Dealer Stays");
      dealerStay();
    }
  };

  var bustCheckDealer = function(){   // check if dealer has busted
    // if there's an ace in the hand, optimizeAce(), which checks for highest value of Ace that doesn't bust
    if(dealer.handValue > 21){   // if bust, set someoneBusted to true; housePays(player.currentBet);
      alert("Dealer has BUSTED!!");
      someoneBusted = true;
      housePays(player.currentBet);
    } else {
      dealerPlays();
    }
  };

  var optimizeAce = function(hand){
    // checks for highest value of the Ace that doesn't bust
    // sets ace to that value
  };

  var dealerStay = function(){
    compareHands(player.handValue, dealer.handValue);
  };

  var compareHands = function(playerHand, dealerHand){
    // optimizeAce(playerHand);
    // optimizeAce(dealerHand);
    if(playerHand === dealerHand){
      console.log("PUSH");
      pushHands();
    } else if(playerHand > dealerHand){
      console.log("PLAYER WINS!!!");
      housePays(player.currentBet);
    } else if(playerHand < dealerHand){
      console.log("Dealer Wins.");
      houseWins();
    }
  };

  var houseWins = function(){
    player.currentBet = 0;   // sets players currentBet to zero
    console.log("Player's bankroll is " + player.bankroll);
    if(bankrollCheck()){
      redeal();
    }
  };

  var housePays = function(bet){
    console.log("House pays player " + bet*2);
    player.bankroll += (bet * 2)   // player's bankroll increases by double their currentBet amount
    console.log("Player's bankroll is " + player.bankroll);
    redeal();
  };

  var pushHands = function(){
    player.bankroll += player.currentBet;   // add player's currentBet back to their bankroll
    console.log("Player's bankroll is " + player.bankroll);
    redeal();
  }

  var redeal = function(){
    resetHands();   // clear player and dealer currentHand
    resetBets();   // clear player currentBet
    placeBet();   // prompt for bets
    dealCards();   // deal cards again
  }

  var bankrollCheck = function(){
    if(player.bankroll <= 0){
      gameOver();
    }
  }

  var gameOver = function(){
    alert("GAME OVER.");   // game over message
    var replayYN = prompt("Do you want to play again? (y/n)") // replay() prompt
    if(replayYN === "y"){
      replay();
    } else  {
      return false;
    }
  }

  var replay = function(){
    // getPlayerName();
    // resetBankroll();
  }

  //////////////////////////
  /////// GAMEPLAY  ////////
  //////////////////////////

  getPlayerName();
  // initializeGameplay(); // HOW SHOULD THIS WORK?
  var unshuffledDeck = createDeck(1);
  var shuffledDeck = shuffleDeck(unshuffledDeck);
  resetBankroll();
  placeBet();
  dealCards();

// });
