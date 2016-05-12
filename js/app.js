// $(function(){

  //////////////////////////
  ////// GAME OBJECTS //////
  //////////////////////////

  // player objects
     // tried my hand out at a constructor function.
     // the complexity of this object skyrocketed once i tried tackling the split logic
  function Player(name) {   
    this.name = name,
    this.bankroll = 1000,
    this.currentBet = 0,
    this.currentHand = [],
    this.handValue = 0,
    this.hasAce = false,
    this.handDiv = "#player-hand",
    this.scoreDiv = "#player-score",
    this.justDealt = false,
    this.split = false,
    this.splitHand = "left";
    this.leftSplit = {
      name: name,
      currentHand: [],
      handValue: 0,
      hasAce: false,
      handDiv: "#split-left",
      busted: false
    }
    this.rightSplit = {
      name: name,
      currentHand: [],
      handValue: 0,
      hasAce: false,
      handDiv: "#split-right",
      busted: false
    }
};

  var dealer = {
    name: "Dealer",
    currentHand: [],
    handValue: 0,
    hasAce: false,
    handDiv: "#dealer-hand",
    scoreDiv: "#dealer-score",
    hiddenCard: null,
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
    $(".control").addClass("hidden");   // hides buttons until you can hit again
    if(player.split === true && player.splitHand === "left"){   // split functionality for left hand
      printGamePrompt(player.name + " hits left.");
      splitDeal(player.leftSplit);
    } else if(player.split === true && player.splitHand === "right"){   // split functionality for right hand
      printGamePrompt(player.name + " hits right.");
      splitDeal(player.rightSplit);
    } else {
      printGamePrompt(player.name + " hits.");
      dealNextCard(player);
      bustCheckPlayer();
    }
  });

  $("#stay").on("click",function(){
    if(player.split === true && player.splitHand === "left"){   // split functionality for left hand
      printGamePrompt(player.name + " stays left.");
      player.splitHand = "right";
      $("#split-left").removeClass("highlight");
      $("#split-right").addClass("highlight");   // highlight right side with CSS
    } else if(player.split === true && player.splitHand === "right"){   // split functionality for right hand
      printGamePrompt(player.name + " stays right.");
      dealerPlays();
    } else {
      $(".control").addClass("hidden");
      printGamePrompt(player.name + " stays.");
      dealerPlays();
    }
  });

  $("#double-down").on("click",function(){
    $(".control").addClass("hidden");
    doubleDown();
  });

  $("#split").on("click",function(){
    $("#split").addClass("hidden");
    $("#player-score").addClass("hidden");
    player.split = true;
    splitCardDivs();
    if(player.splitHand === "left"){
      $("#split-left").addClass("highlight");   // highlight left side with CSS
    }
  });

  //////////////////////////
  /// GAMEPLAY FUNCTIONS ///
  //////////////////////////

  var start = function(){
    unshuffledDeck = createDeck(5);   // casino style with 5 decks
    shuffledDeck = shuffleDeck(unshuffledDeck);
    console.log("======== START GAME ========")   // i was using console.logs as a gameflow check of all the functions running
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

  var shuffleDeck = function(unshuffled){   // shuffle using a modern Fisher-Yates algorithm
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
    if(person.name === "Dealer"){
      var $first = $("#dealer-hand").children().first();
      $first.attr("class","card-back card");
    }
  };

  var printCard = function(person,dealtCard){   // print out one card at a time
    var $handDiv = $(person.handDiv);
    var $cardDiv = $("<div></div>").addClass(dealtCard.class + " card");
    $handDiv.append($cardDiv);
  };

  var printScore = function(person){   // print out the player's score
    var $scoreDiv = $(person.scoreDiv);
    $scoreDiv.empty();
    var $score = $("<div></div>").html("Hand Value: " + person.handValue);
    $scoreDiv.append($score);
  };

  var printGamePrompt = function(prompt){   // print out the game log actions
    var $promptDiv = $("#game-prompts")
    if($promptDiv.children().length > 7){
      $promptDiv.children().last().remove();
    }
    var $promptMsg = $("<p></p").addClass("prompt").html(prompt);
    $promptDiv.prepend($promptMsg);
  }

  var printBankroll = function(){   // refresh the bankroll after a bet is placed
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
    var dealerHidden = shuffledDeck.pop()   // (*) this card should be face down
    dealer.hiddenCard = dealerHidden;   // set hidden card object in dealer object
    dealer.currentHand.push(dealerHidden);
    player.currentHand.push(shuffledDeck.pop());
    dealer.currentHand.push(shuffledDeck.pop());
    // (*) [for now, just display cards all at once; later try animate one at a time]
    printCurrentHand(player);   // displays hands
    printCurrentHand(dealer);
    setHasAce(player);   // flags if they have an ace
    setHasAce(dealer);
    setHandValue(player);   // sets the value of each hand
    setHandValue(dealer);
    printScore(player);   // displays the player's score
    player.justDealt = true;
    if(blackjackCheck()){   // checks for blackjack
      blackjackWin(player.handValue,dealer.handValue);
    } else if (splitCheck()){   // checks for same cards to show split button
      splitShow();
    } else {   // normal hit or stay options
      hitOrStay();
    }
  };

  var hitOrStay = function(){   // prompt user to hit or stay
    console.log("hitOrStay()");
    if(player.justDealt === true){
      $(".first").removeClass("hidden");
    } else {
      $(".hitstay").removeClass("hidden");
    }
  };

  var splitShow = function(){   // display split buttons
    console.log("splitShow()");
    $(".first").removeClass("hidden");
    $("#split").removeClass("hidden");
  }

  var dealNextCard = function(person){   // deals another card to a player & prints new DOM values
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

  var dealerPlays = function(){   // dealer starts playing
    console.log("dealerPlays()");
    var $first = $("#dealer-hand").children().first();
    $first.removeClass("card-back");
    $first.addClass(dealer.hiddenCard.class);   // reveals the facedown card
    printScore(dealer); // displays dealer's score
    if(dealer.handValue < 17){   // dealer automated hit/stay logic
      printGamePrompt("Dealer Hits!");
      dealNextCard(dealer); 
      bustCheckDealer();
    } else if(dealer.handValue >=17 && dealer.handValue <= 21){
      printGamePrompt("Dealer stays.");
      dealerStay();
    }
  };

  var dealerStay = function(){   // compares hands once the dealer stays
    console.log("dealerStay()");
    if(player.split === true){
      compareHandsSplit(player.leftSplit.handValue, player.rightSplit.handValue, dealer.handValue);
    } else {
      compareHands(player.handValue, dealer.handValue);
    }
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

  var bustCheckPlayer = function(hand){   // check if player has busted; alternating hitting hands if the player has split
    console.log("bustCheckPlayer()");
    player.justDealt = false;
    if(player.split === true && player.splitHand === "left" && hand.handValue > 21){
      printGamePrompt("You BUSTED!! (" + hand.handValue + ")");
      alert("You BUSTED!! (" + hand.handValue + ")");
      player.leftSplit.busted = true;
      player.splitHand = "right";
      $("#split-left").removeClass("highlight");
      $("#split-right").addClass("highlight");
      $(".hitstay").removeClass("hidden");
    } else if(player.split === true && player.splitHand === "right" && hand.handValue > 21){
      printGamePrompt("You BUSTED!! (" + hand.handValue + ")");
      alert("You BUSTED!! (" + hand.handValue + ")");
      $("#split-right").removeClass("highlight")
      player.rightSplit.busted = true;
      if(player.leftSplit.busted === true){
        houseWins(player.currentBet);
      } else {
        dealerPlays();
      }
    } else {
      if(player.handValue > 21){
        printGamePrompt("You BUSTED!! (" + player.handValue + ")");
        alert("You BUSTED!! (" + player.handValue + ")");
        houseWins(player.currentBet);
      } else {
        hitOrStay();
      }
    }
  };

  var bustCheckDealer = function(){   // check if dealer has busted
    console.log("bustCheckDealer()");
    if(dealer.handValue > 21){   // if bust, housePays(), else dealerPlays();
      printGamePrompt("Dealer has BUSTED!! (" + dealer.handValue + ")");
      alert("Dealer has BUSTED!! (" + dealer.handValue + ")");
      if(player.split === true){
        housePays((!player.leftSplit.busted * player.currentBet/2)+(!player.rightSplit.busted * player.currentBet/2));
      } else {
        housePays(player.currentBet);
      }
    } else {
      dealerPlays();
    }
  };

  var blackjackCheck = function(){   // returns true if someone has a blackjack
    console.log("blackjackCheck()");
    if(player.handValue === 21 && dealer.handValue === 21){
      return true;
    } else if(player.handValue === 21) {
      return true;
    } else if(dealer.handValue === 21) {
      return true;
    }
  };

  var doubleDown = function(){   // doubles down by only allowing for one more card & doubling the currentBet
    console.log("doubleDown()");
    printGamePrompt(player.name + " is doubling down...");
    player.bankroll -= player.currentBet;
    player.currentBet *= 2;
    printBankroll();
    dealNextCard(player);
    dealerPlays();
  };

  var splitCheck = function(){   // only show split button if cards match
    console.log("splitCheck()");
    if(player.currentHand[0].value === player.currentHand[1].value){
      return true;
    } else {
      return false;
    }
  };

  var splitCardDivs = function(){   // shows the split in the DOM & update visuals
    console.log("splitCardDivs()");
    $("#player-hand").append("<div id='split-left'></div>");
    $("#player-hand").append("<div id='split-right'></div>");
    player.leftSplit.currentHand.push(player.currentHand.shift());
    player.rightSplit.currentHand.push(player.currentHand.shift());
    $("#player-hand .card").remove();
    printCurrentHand(player.leftSplit);
    printCurrentHand(player.rightSplit);
    player.bankroll -= player.currentBet;
    player.currentBet *= 2;
    printBankroll();
    printGamePrompt(player.name + "splits and doubles bet to " + player.currentBet);
  };

  var splitDeal = function(hand){   // deals an individual hand
    console.log("splitDeal()");
    dealNextCard(hand);
    bustCheckPlayer(hand);
  };

  var optimizeAce = function(player){   // checks for highest value of the Ace that doesn't bust
    console.log("optimizeAce()");
    if(player.handValue < 12){
      player.handValue += 10;
    }
  };

  var compareHands = function(playerHand, dealerHand){   // compares hands and logs result in alerts and game log
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

// OK so this function doesn't fully work. I'm getting too lost in the 3-dimensional contingent logic, and I don't have enough time to fix & debug this. Sad face :(. if I had more time, I think I would totally refactor the way compare hands works so that they don't immediately call payment functions, so that I could pass in combinations of hands to check wins, tally up wins, and pay out at the end.
  var compareHandsSplit = function(leftHand, rightHand, dealerHand){
    console.log("compareHandsSplit()");
    if(leftHand.busted === false && rightHand.busted === false){
      if(leftHand > dealerHand && rightHand > dealerHand){
        printGamePrompt("Won both hands!!");
        alert("Won both hands!!");
        housePays(player.currentBet);
      } else if (dealerHand === leftHand && dealerhand === rightHand){
        printGamePrompt("Push both.");
        alert("Push both.");
        pushHands();
      } else if (dealerHand > leftHand || dealerhand > rightHand){
        printGamePrompt("Won one hand!!");
        alert("Won one hand!!");
        housePays(player.currentBet/2);
      }
    } else {
      if((leftHand.busted === false && leftHand > dealerHand) || (rightHand.busted === false && rightHand > dealerHand)){
        printGamePrompt("Won one hand!!");
        alert("Won one hand!!");
        housePays(player.currentBet/2);
      } else if((leftHand.busted === false && leftHand === dealerHand) || (rightHand.busted === false && rightHand === dealerHand)){
        printGamePrompt("Push.");
        alert("Push.");
        pushHands();
      } else {
        printGamePrompt("Dealer wins both.");
        alert("Dealer wins both");
        houseWins();
      }
    }
  };

  var blackjackWin = function(playerHand, dealerHand){   // pays out if someone has blackjack (does not work for split hands yet)
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
  var houseWins = function(){   // takes all the moneyz
    console.log("houseWins()");
    player.currentBet = 0;   // sets players currentBet to zero
    printBankroll();
    if(bankrollCheck()){
      redeal();
    }
  };

  var housePays = function(bet){   // doubles the currentBet
    console.log("housePays()");
    printGamePrompt("Dealer pays player " + bet*2);
    player.bankroll += (bet * 2)   // player's bankroll increases by double their currentBet amount
    printBankroll();
    redeal();
  };

  var blackjackPay = function(bet){   // pays out using blackjack pay rules
    console.log("blackjackPay()");
    printGamePrompt("Dealer pays player " + (Math.round(bet*3/2)));
    player.bankroll += (Math.round(bet*3/2))   // player's bankroll increases by double their currentBet amount
    printBankroll();
    redeal();
  }

  var pushHands = function(){   // bet is returned
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

  var resetBets = function(){   // resets current bet
    console.log("resetBets()");
    player.currentBet = 0;
  };

  // I realize this function is ridonkulously long. There are definitely much better ways to refactor this, but I didn't anticipate how long it would get once I started the split functionality. Unfortunately, I ran out of time.
  var resetHands = function(){
    console.log("resetHands()");
    player.currentHand = [];
    player.handValue = 0;
    player.hasAce = false;
    player.split = false;
    player.splitHand = "left";
    player.leftSplit.currentHand = [];
    player.leftSplit.handValue = 0;
    player.leftSplit.hasAce = false;
    player.leftSplit.busted = false;
    player.rightSplit.currentHand = [];
    player.rightSplit.handValue = 0;
    player.rightSplit.hasAce = false;
    player.rightSplit.busted = false;
    $("#player-hand").empty();
    $("#player-score").empty();
    $("#player-score").removeClass("hidden");
    dealer.currentHand = [];
    dealer.handValue = 0;
    dealer.hasAce = false;
    dealer.hiddenCard = null;
    $("#dealer-hand").empty();
    $("#dealer-score").empty();
  };

  var bankrollCheck = function(){   // if player runs out of money, game over
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

  var replay = function(){  // fully replay
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

