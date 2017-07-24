/**
 * C stands for cards. This is where we transform a card into an html object
 * including SVG for shape and colors. 
 *
 * RED: e63600, rgba(230, 54, 0, 1)
 * GREEN: 00e43d, rgba(7, 192, 56, 1)
 * VIOLET: 5d199b, rgba(113, 30, 189, 1)
 */

/**
  * SCOREBOARD
  */

// available sets to prompt players to choose sets
function AvailableSetsHTML(parentAvailableSetsTag) {
	this.available = 0;
	this.create = function(){
		let as_html = "";
		as_html += `<div class="t-title">Available Sets</div>`;
		as_html += `<div id="as-count" class="t-big">${this.available}</div>`;
		$(`${parentAvailableSetsTag}`).html(as_html);
	}
	this.update = function(count){
		this.available = count;
		$(`#as-count`).html(this.available);
	}
}
// players' scores to see competition
function PlayersHTML(parentPlayersTag, playerNamesArray) {
	this.players = playerNamesArray;
	let s = [];
	for (var i = 0; i < playerNamesArray.length; i++) {
		// everyone starts with score of 0
		s.push(0);
	}
	this.scores = s;
	this.create = function(){
		let p_html = "";
		p_html += `<div id="p_names">`;
		for (var i = 0; i < this.players.length; i++){
			p_html += `<span class="p_nm" id="p_nm_${this.players[i]}">${this.players[i]}</span>`
		}
		p_html += `</div>`;
		p_html += `<div id="p_scores">`;
		for (var i = 0; i < this.scores.length; i++){
			p_html += `<span class="p_pts" id="p_pts_${this.players[i]}">${this.scores[i]}</span>`
		}
		p_html += `</div>`;
		$(`${parentPlayersTag}`).html(p_html);
	}
	this.updateOne = function(score_add, index){
		this.scores[index] += score_add;
		// ADD SCORES
	}
}
// score board uses both PlayersHTML and AvailableSetsHTML
function ScoreBoard(parentScoreBoardTag, playerNamesArray) {
	this.scores = [];
	this.availableSets = new AvailableSetsHTML("#available_sets");
	this.players = new PlayersHTML("#players", playerNamesArray);
	this.create = function(){
		this.availableSets.create();
		this.players.create();
	}
	this.updateAvailable = function(count){
		this.availableSets.update(count);
	}
	this.updatePlayer = function(score_add, index){
		this.players.updateOne(score_add, index);
	}
}

 /**
  * CARDS
  */
function CardPositions(parentGameTag, scoreBoardObj) {
	this.tag = parentGameTag;
	this.positions = [];
	this.cardsHTML = [];
	this.D = new Deck();
	this.available = 0;
	this.map = {
		0: [0, 0], 1: [0, 1], 2: [0, 2], 3: [1, 0], 4: [1, 1], 5: [1, 2],
		6: [2, 0], 7: [2, 1], 8: [2, 2], 9: [3, 0], 10:[3, 1], 11:[3, 2],
		12:[4, 0], 13:[4, 1], 14:[4, 2], 15:[5, 0], 16:[5, 1], 17:[5, 2]};
	// there cannot be more than 18 cards and have no sets. The min is actually 16. 

	this.sb = scoreBoardObj; // add the score board

	// initialize all 18 slots with $false
	for (var i = 0; i < 6; i++){
		// false means there is no cards in those positions, otherwise there would be a card.
		this.positions.push([false, false, false]);
		this.cardsHTML.push([false, false, false]);
	}
	this.seeValues = function(arrayOfCards){
		var res = [];
		for (var i = 0; i < arrayOfCards.length; i++) {
			res.push(arrayOfCards[i].values());
		}
		return res;
	}
	this.remove = function (i1, i2, i3) {
			/* i stands for index, which is an array of two elements referencing 
			the index of where to remove a card. We always remove 3 cards. */
			this.positions[i1[0]][i1[1]] = false;
			this.cardsHTML[i1[0]][i1[1]] = false;
			this.available -= 1;
			this.positions[i2[0]][i2[1]] = false;
			this.cardsHTML[i2[0]][i2[1]] = false;
			this.available -= 1;
			this.positions[i3[0]][i3[1]] = false;
			this.cardsHTML[i3[0]][i3[1]] = false;
			this.available -= 1;
		}
	this.fill = function() {
			// fills the positions that needs to be filled.

			/* CASE 1: FRESH START OF THE GAME */
			if (this.available == 0) {
				// 0 means we just started with a fresh new deck,
				// so we fill up the first 9 cards
				var set12 = this.D.set(12);
				var c = 0; // c is count, we want to use up all the cards in set12
				for (var i = 0; i < 4; i++){
					for (var j = 0; j < 3; j++){
						this.positions[i][j] = set12[c];
						this.cardsHTML[i][j] = CardToHtml(set12[c]);
						this.available += 1;
						c++;
					}
				}
				var setCounts = this.findSetCount();
				if (setCounts <= 0) {
					this.fill();
				} else {
					// debugging feedback
					console.info("found", setCounts, "sets");
					// score board updates available sets
					this.sb.updateAvailable(setCounts);
					return setCounts;
				}

			/* CASE 2: CONTINUE GAME (happens way more often) */
			} else {
				// this means we have to add 3 cards to the set
				if (!this.D.deck[0].drawn) {
					/* if the first card on top of the deck is not drawn, then it means
					the 3 cards on top aren't drawn because we always draw 3 cards. We
					can always draw 3 cards at this point. */
					var set3 = this.D.set(3);
					// c is count, we want to use up all the cards in set3
					var c = 0; 
					for (var i = 0; i < 6; i++){
						for (var j = 0; j < 3; j++){
							if (this.positions[i][j] === false) {
								// if it's specifically equal to false
								this.positions[i][j] = set3[c];
								this.cardsHTML[i][j] = CardToHtml(set3[c]);
								this.available += 1;
								c++;
							}
						}
						// if we used them all up, then we stop adding stuffs
						if (c == 3) break;
					}
					var setCounts = this.findSetCount();
					if (setCounts == 0) {
						// if we found no sets, we want to fill up the deck again
						this.fill();
					} else {
						// debugging feedback
						console.info("found", setCounts, "sets");
						// score board updates available sets
						this.sb.updateAvailable(setCounts);
						return set3;
					}
				} else {
					/* Because we drew no card since the deck was fully drawn, 
					we swap 3 cards down */
					this.swap();
					// return none because we filled with no new card
					return none;
				}
			}
		}
	this.swap = function() { 
			/* we only swap 3 cards because we perform this action after every turn
			when the user picks 3 cards out of the visible / drawn cards. The number 
			of available cards doesn't change, so don't modify it. */
			var movingCards = [];
			var count = 0;
			// first take 3 cards 
			for (var i = 5; i >= 0; i--){
				for (var j = 2; j >= 0; j--){
					var card = this.positions[i][j];
					if (card !== false) {
						movingCards.push(card);
						this.positions[i][j] = false;
						this.cardsHTML[i][j] = false;
						count++;
					}
					if (count == 3) break;
				}
				if (count == 3) break;
			}

			// swap those 3 cards down
			for (var i = 0; i < 6; i++){
				for (var j = 0; j < 3; j++){
					if (this.positions[i][j] === false) {
						this.positions[i][j] = movingCards.shift();
						this.cardsHTML[i][j] = CardToHtml(this.positions[i][j]);
						count--;
					}
					if (count == 0) break;
				}
				if (count == 0) break;
			}

			// get the set count
			var setCounts = this.findSetCount();
			if (setCounts == 0 && this.D.undrawnCards().length > 2) {
				/* if we found no set, then we must fill up the rows but only if we can
				fill it up, otherwise we would undergo infinite loop back and forth
				between this.fill() and this.swap(). */
				this.fill();
			} else {
				/* Implement, what do we do? Stop the game? Yes. How? Send a stop game
				event listener. */
				// debugging feedback
				console.info("found", setCounts, "sets");
				this.sb.updateAvailable(setCounts);
				console.warn("Other stuffs may need to be implemented in here");
			}
		}
	this.create = function() {
			this.D.shuffle();
			this.fill(); // fill up the cards first

			this.sb.create(); // create the sb (=> scoreboard)
	
			var style_card = `style="margin: 1rem; border: 0.25rem solid rgba(0,0,0,0.05); border-radius: 2rem; 	box-shadow: 0rem 0rem 0.25rem rgba(0,0,0,0.3), 0rem 0rem 0.75rem rgba(0,0,0,0.1), 0rem 0rem 0.9rem rgba(	0,0,0,0.1); transition: box-shadow 150ms, border 150ms;"`;
	
			var GAMETAG = `<div id="game">`;
			for (var i = 0; i < 6; i++){
				GAMETAG += `<div id="_${i}_" class="card-row">`;
				for (var j = 0; j < 3; j++){
					GAMETAG += `<span id="_${i}${j}_" `;
					if (this.cardsHTML[i][j] != false) GAMETAG += `class="card"> ${this.cardsHTML[i][j]}`;
					else GAMETAG += `class="card-nulled">`;
					GAMETAG += '</span>';
				}
				GAMETAG += '</div>';
			}
			GAMETAG += `</div>`;
			$(this.tag).html(GAMETAG);
		}
	this.findSetCount = function() {
			// returns the number of sets in the given set of 9, 12, 15, or 18 cards
			var res = 0;
			var cards = [];
			for (var i = 0; i < this.available; i++){
				cards.push(this.positions[this.map[i][0]][this.map[i][1]]);
			}
			// generate all possible triples sets with @cards
			var triples = combinations(cards, 3);
			for (var i = 0; i < triples.length; i++){
				if (isProperSet(triples[i])) {
					console.log(this.seeValues(triples[i]));
					res++;
				}
			}
			// return res;
			return res; 
		}
	this.update = function() {
			if (this.available < 12) {
				this.fill(); // fill up the cards first
				for (var i = 0; i < 6; i++){
					for (var j = 0; j < 3; j++){
						if (this.cardsHTML[i][j] != false) {
							$(`#_${i}${j}_`).removeClass("card-nulled");
							$(`#_${i}${j}_`).addClass("card");
							$(`#_${i}${j}_`).html(this.cardsHTML[i][j]);
						}
						else {
							$(`#_${i}${j}_`).removeClass("card");
							$(`#_${i}${j}_`).addClass("card-nulled");
							$(`#_${i}${j}_`).html("");
						}
					}
				}
			} else {
				// this means that there used to be more than 12 cards in the 
				// previous term, so swap the extra cards down
				this.swap();
				// perform the update function to update the HTML
				for (var i = 0; i < 6; i++){
					for (var j = 0; j < 3; j++){
						if (this.cardsHTML[i][j] != false) {
							$(`#_${i}${j}_`).removeClass("card-nulled");
							$(`#_${i}${j}_`).addClass("card");
							$(`#_${i}${j}_`).html(this.cardsHTML[i][j]);
						}
						else {
							$(`#_${i}${j}_`).removeClass("card");
							$(`#_${i}${j}_`).addClass("card-nulled");
							$(`#_${i}${j}_`).html("");
						}
					}
				}
			}
		}

}

function CardToHtml(card){
	/* turns a card object into a visible card in html format. Style found in style.css 
	for cards and symbol. */
	var hexColor = card.color.hex; // hex without the "#"
	var shape = HShapes(card.color.value, card.shape.value, card.interior.value, card.number.value);
	var symbol = `<span class="symbol">${shape}</span>`;
	var html_card = `<span>`;
	for (var i = 0; i < card.number.name; i++) {
		html_card += symbol;
	}
	html_card += `</span>`;
	return html_card;
}

function HShapes(color_value, shape_value, interior_value, number_value){
	/* stands for HTML Shapes. This just returns an svg with the given color
	Uses objects and functions from {cards.js}. */
	// find the color
	var __possible__ = ["RED", "VIOLET", "GREEN"];
	var __hex__ = {RED: colorRed, VIOLET: colorViolet, GREEN: colorGreen};
	var colorHex = __hex__[__possible__[color_value]];
	var CARDID =`id${color_value}${shape_value}${interior_value}${number_value}`;

	// designate all svg shapes in variables ${colorHex}
	var svg_00 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 48"><defs><style>.${CARDID}cls-1{fill:none;stroke:#${colorHex};stroke-miterlimit:10;}</style></defs><polygon class="${CARDID}cls-1" points="12 6 2 24 12 42 22 24 12 6"/></svg>`;
	var svg_01 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 48"><defs><style>.${CARDID}cls-1{fill:#${colorHex};}.${CARDID}cls-2{fill:none;stroke:#${colorHex};stroke-miterlimit:10;}</style></defs><g><polygon class="${CARDID}cls-1" points="4.8 18.96 19.2 18.96 18.65 17.98 5.35 17.98 4.8 18.96"/><polygon class="${CARDID}cls-1" points="2.58 22.96 21.42 22.96 20.88 21.98 3.12 21.98 2.58 22.96"/><polygon class="${CARDID}cls-1" points="10.31 38.96 13.69 38.96 14.23 37.98 9.77 37.98 10.31 38.96"/><polygon class="${CARDID}cls-1" points="3.7 20.94 20.3 20.94 19.78 20 4.22 20 3.7 20.94"/><polygon class="${CARDID}cls-1" points="12 42 12.01 41.98 11.99 41.98 12 42"/><polygon class="${CARDID}cls-1" points="11.41 40.94 12.59 40.94 13.11 40 10.89 40 11.41 40.94"/><polygon class="${CARDID}cls-1" points="5.92 16.94 18.08 16.94 17.59 16.06 6.41 16.06 5.92 16.94"/><polygon class="${CARDID}cls-1" points="6.99 15.02 17.01 15.02 16.47 14.04 7.53 14.04 6.99 15.02"/><polygon class="${CARDID}cls-1" points="4.74 28.94 19.26 28.94 19.78 28 4.22 28 4.74 28.94"/><polygon class="${CARDID}cls-1" points="5.87 30.96 18.13 30.96 18.68 29.98 5.32 29.98 5.87 30.96"/><polygon class="${CARDID}cls-1" points="9.19 36.94 14.81 36.94 15.33 36 8.67 36 9.19 36.94"/><polygon class="${CARDID}cls-1" points="3.65 26.96 20.36 26.96 20.9 25.98 3.1 25.98 3.65 26.96"/><polygon class="${CARDID}cls-1" points="8.09 34.96 15.91 34.96 16.46 33.98 7.54 33.98 8.09 34.96"/><polygon class="${CARDID}cls-1" points="2.52 24.94 21.48 24.94 22 24 2 24 2.52 24.94"/><polygon class="${CARDID}cls-1" points="10.33 9 13.67 9 13.15 8.06 10.85 8.06 10.33 9"/><polygon class="${CARDID}cls-1" points="6.96 32.94 17.04 32.94 17.56 32 6.44 32 6.96 32.94"/><polygon class="${CARDID}cls-1" points="9.21 11.02 14.79 11.02 14.24 10.04 9.76 10.04 9.21 11.02"/><polygon class="${CARDID}cls-1" points="11.43 7.02 12.57 7.02 12.02 6.04 11.98 6.04 11.43 7.02"/><polygon class="${CARDID}cls-1" points="8.11 13 15.89 13 15.37 12.06 8.63 12.06 8.11 13"/></g><g><polygon class="${CARDID}cls-2" points="12 6 2 24 12 42 22 24 12 6"/></g></svg>`;
	var svg_02 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 48"><defs><style>.${CARDID}cls-1{fill:#${colorHex};stroke:#${colorHex};stroke-miterlimit:10;}</style></defs><polygon class="${CARDID}cls-1" points="12 6 2 24 12 42 22 24 12 6"/></svg>`;
	var svg_10 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 48"><defs><style>.${CARDID}cls-1{fill:none;stroke:#${colorHex};stroke-miterlimit:10;}</style></defs><path class="${CARDID}cls-1" d="M2,32a10,10,0,0,0,20,0V16A10,10,0,0,0,2,16Z"/></svg>`;
	var svg_11 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 48"><defs><style>.${CARDID}cls-1{fill:#${colorHex};}.${CARDID}cls-2{fill:none;stroke:#${colorHex};stroke-miterlimit:10;}</style></defs><g><path class="${CARDID}cls-1" d="M12,42a10.08,10.08,0,0,0,1.12-.07H10.88A10.08,10.08,0,0,0,12,42Z"/><path class="${CARDID}cls-1" d="M3.28,36.89H20.72a9.94,9.94,0,0,0,.47-.94H2.82A9.94,9.94,0,0,0,3.28,36.89Z"/><path class="${CARDID}cls-1" d="M4.79,38.92H19.21a10,10,0,0,0,.83-1H4A10,10,0,0,0,4.79,38.92Z"/><path class="${CARDID}cls-1" d="M2.44,34.92H21.56a9.94,9.94,0,0,0,.24-1H2.19A9.94,9.94,0,0,0,2.44,34.92Z"/><path class="${CARDID}cls-1" d="M7.44,40.89h9.11A10,10,0,0,0,18,40H6A10,10,0,0,0,7.44,40.89Z"/><path class="${CARDID}cls-1" d="M2,32c0,.3,0,.6,0,.89H22c0-.3,0-.59,0-.89v0H2Z"/><rect class="${CARDID}cls-1" x="2" y="19.96" width="20" height="0.94"/><rect class="${CARDID}cls-1" x="2" y="23.96" width="20" height="0.94"/><rect class="${CARDID}cls-1" x="2" y="21.93" width="20" height="0.98"/><rect class="${CARDID}cls-1" x="2" y="16.02" width="20" height="0.88"/><rect class="${CARDID}cls-1" x="2" y="17.93" width="20" height="0.98"/><path class="${CARDID}cls-1" d="M4.9,9H19.1A10,10,0,0,0,18,8H6A10,10,0,0,0,4.9,9Z"/><path class="${CARDID}cls-1" d="M12,6A9.94,9.94,0,0,0,7.7,7H16.3A9.94,9.94,0,0,0,12,6Z"/><path class="${CARDID}cls-1" d="M2.05,15h19.9q-.05-.5-.15-1H2.2Q2.1,14.48,2.05,15Z"/><path class="${CARDID}cls-1" d="M2.47,13H21.53a9.92,9.92,0,0,0-.35-.94H2.83A9.92,9.92,0,0,0,2.47,13Z"/><path class="${CARDID}cls-1" d="M3.36,11H20.64A10,10,0,0,0,20,10H4A10,10,0,0,0,3.36,11Z"/><rect class="${CARDID}cls-1" x="2" y="29.93" width="20" height="0.98"/><rect class="${CARDID}cls-1" x="2" y="25.93" width="20" height="0.98"/><rect class="${CARDID}cls-1" x="2" y="27.96" width="20" height="0.94"/></g><g id="oval"><path class="${CARDID}cls-2" d="M2,32a10,10,0,0,0,20,0V16A10,10,0,0,0,2,16Z"/></g></svg>`;
	var svg_12 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 48"><defs><style>.${CARDID}cls-1{fill:#${colorHex};stroke:#${colorHex};stroke-miterlimit:10;}</style></defs><path class="${CARDID}cls-1" d="M2,32a10,10,0,0,0,20,0V16A10,10,0,0,0,2,16Z"/></svg>`;
	var svg_20 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 48"><defs><style>.${CARDID}cls-1{fill:none;stroke:#${colorHex};stroke-miterlimit:10;}</style></defs><path class="${CARDID}cls-1" d="M4.5,12.75C4.5,9.5,8.69,6,13.25,6c6.63,0,8.62,3.36,8.62,5.08,0,2.34-4.87,5.08-4.87,12.79,0,4.21,2.58,6.54,2.5,11.13-.06,3.25-4.19,6.75-8.75,6.75-6.62,0-8.62-3.36-8.62-5.08C2.13,34.33,7,31.92,7,23.88,7,19.5,4.5,17.17,4.5,12.75Z"/></svg>`;
	var svg_21 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 48"><defs><style>.${CARDID}cls-1{fill:#${colorHex};}.${CARDID}cls-2{fill:none;stroke:#${colorHex};stroke-miterlimit:10;}</style></defs><g><path class="${CARDID}cls-1" d="M2.92,34.9H19.5c0-.34,0-.67,0-1H3.62C3.36,34.27,3.13,34.59,2.92,34.9Z"/><path class="${CARDID}cls-1" d="M5.45,40.88H15a10,10,0,0,0,1.55-.94H3.91A7.25,7.25,0,0,0,5.45,40.88Z"/><path class="${CARDID}cls-1" d="M2.13,36.79s0,.05,0,.08h17a5,5,0,0,0,.3-.94H2.33A2.2,2.2,0,0,0,2.13,36.79Z"/><path class="${CARDID}cls-1" d="M2.92,38.9H17.7a7.78,7.78,0,0,0,.8-1H2.36A4.5,4.5,0,0,0,2.92,38.9Z"/><path class="${CARDID}cls-1" d="M5.91,18.9H17.83q.18-.51.38-1H5.55Z"/><path class="${CARDID}cls-1" d="M5.19,16.88H18.7q.24-.46.49-.87H4.93C5,16.3,5.1,16.59,5.19,16.88Z"/><path class="${CARDID}cls-1" d="M6.56,20.88H17.3c.06-.32.13-.64.21-.94H6.28C6.38,20.24,6.48,20.56,6.56,20.88Z"/><path class="${CARDID}cls-1" d="M4.7,15H19.84l.67-1h-16Q4.61,14.48,4.7,15Z"/><path class="${CARDID}cls-1" d="M7,24c0,.3,0,.58,0,.87H17c0-.29,0-.58,0-.88,0,0,0,0,0-.06H7S7,24,7,24Z"/><path class="${CARDID}cls-1" d="M6.94,22.9H17c0-.34.06-.66.1-1H6.8Q6.89,22.39,6.94,22.9Z"/><path class="${CARDID}cls-1" d="M5,11H21.85a3.38,3.38,0,0,0-.27-1h-16A6.34,6.34,0,0,0,5,11Z"/><path class="${CARDID}cls-1" d="M13.25,6.13A9.69,9.69,0,0,0,9.38,7H18.2A13.13,13.13,0,0,0,13.25,6.13Z"/><path class="${CARDID}cls-1" d="M4.5,12.88s0,0,0,.06H21.21A5.64,5.64,0,0,0,21.7,12H4.61A4.09,4.09,0,0,0,4.5,12.88Z"/><path class="${CARDID}cls-1" d="M6.43,8.94H21A5.65,5.65,0,0,0,20,8H7.55A9.27,9.27,0,0,0,6.43,8.94Z"/><path class="${CARDID}cls-1" d="M6.76,26.9H17.41c-.09-.32-.16-.65-.22-1H6.89C6.86,26.25,6.82,26.58,6.76,26.9Z"/><path class="${CARDID}cls-1" d="M4.34,32.88h15q-.09-.48-.2-.94H4.93C4.73,32.27,4.54,32.58,4.34,32.88Z"/><path class="${CARDID}cls-1" d="M6.29,28.88H18.08q-.17-.47-.34-.94H6.56C6.48,28.26,6.39,28.57,6.29,28.88Z"/><path class="${CARDID}cls-1" d="M5.49,30.9H18.81q-.16-.5-.34-1H5.93C5.79,30.26,5.64,30.59,5.49,30.9Z"/></g><g><path class="${CARDID}cls-2" d="M4.5,12.75C4.5,9.5,8.69,6,13.25,6c6.63,0,8.62,3.36,8.62,5.08,0,2.34-4.87,5.08-4.87,12.79,0,4.21,2.58,6.54,2.5,11.13-.06,3.25-4.19,6.75-8.75,6.75-6.62,0-8.62-3.36-8.62-5.08C2.13,34.33,7,31.92,7,23.88,7,19.5,4.5,17.17,4.5,12.75Z"/></g></svg>`;
	var svg_22 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 48"><defs><style>.${CARDID}cls-1{fill:#${colorHex};stroke:#${colorHex};stroke-miterlimit:10;}</style></defs><path class="${CARDID}cls-1" d="M4.5,12.75C4.5,9.5,8.69,6,13.25,6c6.63,0,8.62,3.36,8.62,5.08,0,2.34-4.87,5.08-4.87,12.79,0,4.21,2.58,6.54,2.5,11.13-.06,3.25-4.19,6.75-8.75,6.75-6.62,0-8.62-3.36-8.62-5.08C2.13,34.33,7,31.92,7,23.88,7,19.5,4.5,17.17,4.5,12.75Z"/></svg>`;

	var possibles = [
		[svg_00, svg_01, svg_02],
		[svg_10, svg_11, svg_12],
		[svg_20, svg_21, svg_22]
	];

	return possibles[shape_value][interior_value];
}




