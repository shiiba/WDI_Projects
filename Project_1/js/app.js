//////////////////////////
////// GAME OBJECTS //////
//////////////////////////

var player = {
  bankroll: 1000,
  currentHand: [],
  handValue: 0,
  currentBet: null
}

var dealer = {
  currentHand: [],
  handValue: 0,
}

// card objects
// deck objects
// global variable for current shuffled deck

//////////////////////////
/// GAMEPLAY FUNCTIONS ///
//////////////////////////

// createDeck function
// shuffleDeck function

var getPlayerName = function(){   // get player's name 
  return prompt("What is your name?");
}

var resetPlayerBankroll = function(){   // resets player bankroll
  player.bankroll = 1000;
}

var placeBet = function(){
  // should prompt for bet Amount
  // decrement player bankroll by that amount
  // hold bet amount in a variable to be accessed later
}

var dealCards = function(){
  // pop cards off the shuffled deck array and show 2 for each player
  // (*) deal out one card to player, one to dealer face down, one to player, one to dealer
}


//////////////////////////
/////// GAMEPLAY  ////////
//////////////////////////

// - As a player, when I refresh the page, I should be asked to enter my name
getPlayerName();
// - As a player, when I enter my name, I should see my bankroll and a prompt asking me to place a bet
resetPlayerBankroll();
placeBet();
// - As a player, once I've placed a bet, the dealer should deal the cards
dealCards();
// - As a player, when the hands are dealt, I should be prompted to hit or stay ( (*) or split or double down)
hitOrStay();
// - As a player, if I decide to hit, a new card is dealt to me and if I'm over 21, I bust
dealNextCard();
bustCheck();
// - As a player, if I don't bust, I should be prompted to hit or stay again
if(bust === false){
  hitOrStay();
}
// - As a player, if I decide to stay, it's the dealers turn
if(stay === true){
  dealerPlays();
}
// - As a dealer, if my card values add up to less than 17, I should automatically hit
if(dealer.handValue < 17){
  dealNextCard();
  bustCheck();
}
// - As a dealer, if my card equals 17 or higher, I should automatically stay
if(dealer.handValue >= 17){
  dealerStay();
}
// - As a dealer, once I bust or stay, I should compare the hands
if(bustCheck === true || dealerStay === true){
  compareHands();
}
// - As a dealer, if I win, I should take the money the player bet
if(dealerWin === true){
  houseWins(player.currentBet);
}
// - As a dealer, if I lose, I should pay money equal to the player bet
if(dealerWin === false){
  housePays(player.currentBet);
}
// - As a player, after the hand, I am prompted to place a bet again
placeBet();
dealCards();
// - As a player, if I run out of money, I lose the game
// - As a player, if I lose the game, I should be prompted if I want to play again
if(player.bankroll <= 0){
  alert("Game Over.");
  prompt("Play again?") ? gameReset() : endGame();
}



