# Blackjack

**URL**: [http://shiiba.github.io/blackjack/blackjack.html](http://shiiba.github.io/blackjack/blackjack.html)

### Description
Final project for Unit 1 of General Assembly's Web Development Immersive. Built after 2 weeks of HTML/CSS, Javascript & JQuery.
Our prompt was to build Blackjack using what we've learned so far with static front-end & JS programming (actual prompt can be found in [blackjack.md](./blackjack.md)).

Before I started building this project, I went through a few different planning steps. You can see the initial planning docs in the Planning folder. After planning out my initial MVP scope and writing user stories, I sketched out the objects I needed to build, and an initial pass at the gameflow & functions necessary to play the game. I then converted the user stories into a non-functional skeleton of pseudo-coded functions with comments describing the desired functionality. Then, I started to code out the MVP.

Overall, I'm pretty happy with how this came out after 2.5 days of work. Below, you can see a list of future features I would have loved to tackle if I had more time.

### Tech used
- HTML / CSS
- Javascript / JQuery
- CSS Sprites
- (All done in memory; no database)

### Features
- Players, Cards & Decks using OOP
- Text prompts & game log to guide user through game flow
- Fisher-Yates Shuffle deck function (w/ casino-style 5 decks)
- Cards displayed through Sprites
- Player Bankroll to keep track of wins/losses
- Ability to input desired bet amount
- Normal play with Hit / Stay / Bust
- Dynamic Ace value optimization
- Payout based on your hand vs. dealers
- Lose the game if your bankroll is cleaned out
- Reshuffle a new deck if shuffled cards run out
- Blackjack check & 3/2 payout
- Ability to double down
- Ability to split (3/4 implemented; payout is still buggy)
- Dealer has one card faced down
- Dealer's face down card isn't inspectable
- Deal card & split hand animations

### Future Features (if time allowed)
- Refactor out the alerts and make the game flow happen fully in-browser
- Error handling for user inputs
- Check so you can't bet more than you have in the bank
- Insurance check function 
- Break out everything into classes, encapsulate functions using more OOP JS
- Some special animation when you win money / get blackjack
- Game stats (win percentage; win/loss tracking)



#### Libraries
- For my playing cards, I used a modified version of [Brandon Ardiente's SVG-Z Cards](http://ardisoft.net/svg-z-cards/), which are in turn modified from [David Bellot's SVG-Cards](http://svg-cards.sourceforge.net/), licensed under LGPL
