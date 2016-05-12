// $(function(){

  //////////////////////////
  ////// GAME OBJECTS //////
  //////////////////////////

  // player objects
  function Player(name) {
    this.name = name,
    this.bankroll = 1000,
    this.currentBet = 0,
    this.currentHand = [],
    this.handValue = 0,
    this.hasAce = false,
    this.handDiv = "#player-hand",
    this.scoreDiv = "#player-score"
  };

  var dealer = {
    name: "Dealer",
    currentHand: [],
    handValue: 0,
    hasAce: false,
    handDiv: "#dealer-hand",
    scoreDiv: "#dealer-score"
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

  // set global card variables
  var unshuffledDeck;
  var shuffledDeck;

  //////////////////////////
  //// EVENT LISTENERS /////
  //////////////////////////

  // global control button event listeners
  $("#hit").on("click",function(){
    $(".control").addClass("hidden");
    printGamePrompt(player.name + " hits.");
    dealNextCard(player);
    bustCheckPlayer();
  });
  $("#stay").on("click",function(){
    $(".control").addClass("hidden");
    printGamePrompt(player.name + " stays.");
    dealerPlays();
  });
  // $("#split").on("click",function(){
  //   $(".control").addClass("hidden");
  //   splitCards();
  // });

  //////////////////////////
  /// GAMEPLAY FUNCTIONS ///
  //////////////////////////

  var start = function(){
    unshuffledDeck = createDeck(5);   // casino style with 5 decks
    shuffledDeck = shuffleDeck(unshuffledDeck);
    console.log("======== START GAME ========")
    printBankroll();
    placeBet();
    dealCards();
  };

  var getPlayerName = function(){   // get player's name 
    return prompt("What is your name?", "Name");
  };

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
          card.class = (valuePoints[j].value.toLowerCase() + "-" + suits[i].toLowerCase());
          deck.push(card);
        }
      }
    }
    return deck;
  };

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

// PRINT FUNCTIONS (display things in DOM)
  var printPlayerName = function(){   // print player name on screen
    $("#player-name").html(nameInput);
  }

  var printCurrentHand = function(person){   // visually print out deck to check if it is shuffled
    for(var i=0;i<person.currentHand.length;i++){
      var $handDiv = $(person.handDiv);
      var $cardDiv = $("<div></div>").addClass(person.currentHand[i].class + " card");
      $handDiv.append($cardDiv);
    }
  };

  var printCard = function(person,dealtCard){
    var $handDiv = $(person.handDiv);
    var $cardDiv = $("<div></div>").addClass(dealtCard.class + " card");
    $handDiv.append($cardDiv);
  };

  var printScore = function(person){
    var $scoreDiv = $(person.scoreDiv);
    $scoreDiv.empty();
    var $score = $("<div></div>").html("Hand Value: " + person.handValue);
    $scoreDiv.append($score);
  };

  var printGamePrompt = function(prompt){
    var $promptDiv = $("#game-prompts")
    if($promptDiv.children().length > 7){
      $promptDiv.children().last().remove();
    }
    var $promptMsg = $("<p></p").addClass("prompt").html(prompt);
    $promptDiv.prepend($promptMsg);
  }

  var printBankroll = function(){
    var $bankDiv = $("#bank-vault");
    $bankDiv.empty();
    var $bet = $("<div id='current-bet'></div>").html("Current Bet: " + player.currentBet);
    var $money = $("<div></div>").html("Bankroll: " + player.bankroll);
    $bankDiv.append($bet, $money);
  }


// GAMEPLAY FUNCTIONS
  var placeBet = function(){
    console.log("placeBet()");
    var betString = prompt("How much would you like to bet?","100");   // should prompt for bet Amount
    var playerBet = parseInt(betString);   // convert to number
    player.currentBet = playerBet;   // set player currentBet to the input amount
    player.bankroll -= playerBet;   // decrement player bankroll by that amount
    printBankroll();
    printGamePrompt(player.name + " bets " + playerBet);
  };

  var dealCards = function(){   // pop cards off the shuffled deck array and show 2 for each player
    console.log("dealCards()");
    player.currentHand.push(shuffledDeck.pop());
    dealer.currentHand.push(shuffledDeck.pop());   // (*) this should be face down
    player.currentHand.push(shuffledDeck.pop());
    dealer.currentHand.push(shuffledDeck.pop());
    // (*) [for now, just display cards all at once; later animate one at a time]
    printCurrentHand(player);
    printCurrentHand(dealer);
    setHasAce(player);
    setHasAce(dealer);
    setHandValue(player);
    setHandValue(dealer);
    printScore(player);
    if(blackjackCheck()){
      blackjackWin(player.handValue,dealer.handValue);
    // } else if (splitCheck()){
    //   splitShow();
    } else {
      hitOrStay();
    }
  };

  var hitOrStay = function(){   // prompt user to hit or stay
    console.log("hitOrStay()");
    $(".hitstay").removeClass("hidden");
  };

  // var splitShow = function(){
  //   console.log("splitShow()");
  //   $(".hitstay").removeClass("hidden");
  //   $("#split").removeClass("hidden");
  // }

  var dealNextCard = function(person){
    console.log("dealNextCard()");
    var card = shuffledDeck.pop();   // pops off next card in the shuffled deck array
    person.currentHand.push(card);
    printGamePrompt(person.name + " was dealt a " + card.value);
    setHasAce(person);
    setHandValue(person);
    printGamePrompt(person.name + "'s hand is equal to " + person.handValue);
    printCard(person,card);
    printScore(person);
  };

  var dealerPlays = function(){
    console.log("dealerPlays()");
    printScore(dealer);
    if(dealer.handValue < 17){
      printGamePrompt("Dealer Hits!");
      dealNextCard(dealer); 
      bustCheckDealer();
    } else if(dealer.handValue >=17 && dealer.handValue <= 21){
      printGamePrompt("Dealer stays.");
      dealerStay();
    }
  };

  var dealerStay = function(){
    console.log("dealerStay()");
    compareHands(player.handValue, dealer.handValue);
  };

// SET, BUST & COMPARE FUNCTIONS
  var setHasAce = function(person){   // checks if there's an ace in the hand, if yes, the flags it in a boolean
    console.log("setHasAce()");
    for(var i=0;i<person.currentHand.length;i++){
      if(person.currentHand[i].value === "Ace"){
        person.hasAce = true;
      }
    }
  };

  var setHandValue = function(person){   // run each time a new card is dealt to set the handValue
    console.log("setHandValue()");
    var pointsArray = person.currentHand.map(function(e){return e.points});   // grab the point value of all cards in currentHand
    person.handValue = pointsArray.reduce(function(a,b){return a+b});   // add them together and set to handValue
    if(person.hasAce === true){   // if there's an ace in the hand, optimizeAce()
      optimizeAce(person);
    }
  };

  var bustCheckPlayer = function(){   // check if player has busted
    console.log("bustCheckPlayer()");
    if(player.handValue > 21){
      printGamePrompt("You BUSTED!! (" + player.handValue + ")");
      alert("You BUSTED!! (" + player.handValue + ")");
      houseWins(player.currentBet);
    } else {
      hitOrStay();
    }
  };

  var bustCheckDealer = function(){   // check if dealer has busted
    console.log("bustCheckDealer()");
    if(dealer.handValue > 21){   // if bust, housePays(), else dealerPlays();
      printGamePrompt("Dealer has BUSTED!! (" + dealer.handValue + ")");
      alert("Dealer has BUSTED!! (" + dealer.handValue + ")");
      housePays(player.currentBet);
    } else {
      dealerPlays();
    }
  };

  var blackjackCheck = function(){
    if(player.handValue === 21 && dealer.handValue === 21){
      return true;
    } else if(player.handValue === 21) {
      return true;
    } else if(dealer.handValue === 21) {
      return true;
    }
  };

  // var splitCheck = function(){   // prompt user to hit or stay
  //   console.log("splitCheck()");
  //   if(player.currentHand[0].value === player.currentHand[1].value){
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  var optimizeAce = function(player){   // checks for highest value of the Ace that doesn't bust
    console.log("optimizeAce()");
    if(player.handValue < 12){
      player.handValue += 10;
    }
  };

  var compareHands = function(playerHand, dealerHand){
    console.log("compareHands()");
    if(playerHand === dealerHand){
      printGamePrompt("Push - " + player.name + " (" + playerHand + ") Dealer (" + dealerHand + ")");
      alert("Push - " + player.name + " (" + playerHand + ") Dealer (" + dealerHand + ")");
      pushHands();
    } else if(playerHand > dealerHand){
      printGamePrompt(player.name + "(" + playerHand + ") WINS vs. "  + "Dealer (" + dealerHand + ")");
      alert(player.name + "(" + playerHand + ") WINS vs. "  + "Dealer (" + dealerHand + ")");
      housePays(player.currentBet);
    } else if(playerHand < dealerHand){
      printGamePrompt("Dealer (" + dealerHand + ") wins vs. " + player.name + "(" + playerHand + ")");
      alert("Dealer (" + dealerHand + ") wins vs. " + player.name + "(" + playerHand + ")");
      houseWins();
    }
  };

  var blackjackWin = function(playerHand, dealerHand){
    console.log("blackjackWin()");
    if(playerHand === dealerHand){
      printGamePrompt("Blackjack PUSH");
      pushHands();
    } else if(playerHand > dealerHand){
      printGamePrompt(player.name + " WINS WITH BLACKJACK!!!");
      alert("YOU GOT BLACKJACK!!");
      blackjackPay(player.currentBet);
    } else if(playerHand < dealerHand){
      printGamePrompt("Dealer Wins with Blackjack.");
      alert("Dealer Wins with Blackjack.");
      houseWins();
    }
  };

// PAY FUNCTIONS
  var houseWins = function(){
    console.log("houseWins()");
    player.currentBet = 0;   // sets players currentBet to zero
    printBankroll();
    if(bankrollCheck()){
      redeal();
    }
  };

  var housePays = function(bet){
    console.log("housePays()");
    printGamePrompt("Dealer pays player " + bet*2);
    player.bankroll += (bet * 2)   // player's bankroll increases by double their currentBet amount
    printBankroll();
    redeal();
  };

  var blackjackPay = function(bet){
    console.log("blackjackPay()");
    printGamePrompt("Dealer pays player " + (Math.round(bet*3/2)));
    player.bankroll += (Math.round(bet*3/2))   // player's bankroll increases by double their currentBet amount
    printBankroll();
    redeal();
  }

  var pushHands = function(){
    console.log("pushHands()");
    player.bankroll += player.currentBet;   // add player's currentBet back to their bankroll
    printBankroll();
    redeal();
  }

// REDEAL & RESET FUNCTIONS
  var redeal = function(){
    console.log("redeal()");
    resetHands();   // clear player and dealer currentHand
    resetBets();   // clear player currentBet
    console.log("Deck has " + shuffledDeck.length + " cards left");
    reshuffleCheck();   // check if deck needs reshuffling
    console.log("========= NEW HAND =========");
    placeBet();   // prompt for bets
    dealCards();   // deal cards again
  }

  var resetBankroll = function(){   // resets player bankroll
    player.bankroll = 1000;
  };

  var resetBets = function(){
    console.log("resetBets()");
    player.currentBet = 0;
  };

  var resetHands = function(){
    console.log("resetHands()");
    player.currentHand = [];
    player.handValue = 0;
    player.hasAce = false;
    $("#player-hand").empty();
    $("#player-score").empty();
    dealer.currentHand = [];
    dealer.handValue = 0;
    dealer.hasAce = false;
    $("#dealer-hand").empty();
    $("#dealer-score").empty();
  };

  var bankrollCheck = function(){
    console.log("bankrollCheck()");
    if(player.bankroll <= 0){
      gameOver();
    } else {
      return true;
    }
  }

  var reshuffleCheck = function(){   // reshuffle if deck runs out
    if(shuffledDeck.length <= 10){
      printGamePrompt("Reshuffling card decks...");
      alert("Running low on cards... reshuffling...");
      unshuffledDeck = createDeck(5);
      shuffledDeck = shuffleDeck(unshuffledDeck);
    }
  };

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
    resetHands();
    resetBets();
    resetBankroll();
    printGamePrompt("Deck has " + shuffledDeck.length + " cards left");
    start();
  }

  //////////////////////////
  /////// GAMEPLAY  ////////
  //////////////////////////

  var nameInput = getPlayerName();
  var player = new Player(nameInput);
  printPlayerName();
  start();

// });

  //////////////////////////
  /////// GRAVEYARD  ///////
  //////////////////////////


// old hitOrStay() function

    // var inputVal = prompt("Hit (h), Stay (s) or e(x)it?");   // (*) [use buttons for choosing later?]
    // if(inputVal === "h"){   // if hit, run dealNextCard() and if they don't bust, ask to hit or stay again
    //   // console.log("Player Hits.")
    //   dealNextCard(player);
    //   bustCheckPlayer();
    // } else if(inputVal === "s"){   // if stay, run dealerPlays();
    //   // console.log("Player Stays.")
    //   dealerPlays();
    // } else if (inputVal === "x"){   // [remove later]
    //   return false;
    // }

