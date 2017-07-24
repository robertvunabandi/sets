// #Link(to Sets game): http://www.setgame.com/set

/**
 * Each of the four following objects (@Color, @Shape, @Interior, @Number) is
 * is one of the characteristics of a @Card. They all have a value, which is an
 * integer in the range [0-2] (this will make it easy for the computer to test
 * different things on them) and a possible, which is the name of the actual
 * characteristic (see @isProperSet(set) function).
 */

function Color(value){
	/* value is an integer. */
	console.assert(value in [0, 1, 2], "value must be either 0, 1, or 2");
	var possible = ["RED", "VIOLET", "GREEN"];
	var hex = {RED: colorRed, VIOLET: colorViolet, GREEN: colorGreen};

	this.value = value;
	this.name = possible[value];
	this.hex = hex[possible[value]];
}

function Shape(value){
	/* value is an integer. */
	console.assert(value in [0, 1, 2], "value must be either 0, 1, or 2");
	var value = value;
	var possible = ["LOSENGE", "OVAL", "SQUIGGLE"];
	
	this.value = value;
	this.name = possible[value];
}

function Interior(value){
	/* value is an integer. */
	console.assert(value in [0, 1, 2], "value must be either 0, 1, or 2");
	var value = value;
	var possible = ["BLANK", "RAYS", "SOLID"];

	this.value = value;
	this.name = possible[value];
}

function Number(value){
	/* value is an integer. */
	console.assert(value in [0, 1, 2], "value must be either 0, 1, or 2");
	var value = value;
	var possible = [1, 2, 3];

	this.value = value;
	this.name = possible[value];
}

// Following is a Card and then a Deck.

function Card(color_, shape_, interior_, number_) {
	/* Each of color, shape, and interior are integers in the range [0, 1, 2] 
	This will cause an error if the values are different. This is a card that
	has the given values. */
	this.color = new Color(color_);
	this.shape = new Shape(shape_);
	this.interior = new Interior(interior_);
	this.number = new Number(number_);
	this.drawn = false;
	this.values = function(){
		return `${this.color.value}${this.shape.value}${this.interior.value}${this.number.value}`;
	}
}

function Deck() {
	/** 
	 * Returns a deck of 81 cards. c:color, s:shape, i:interior, n:number.
	 * This creates a deck with every possible permutations of values with
	 * certain functions that can be applied to this deck. Check them out.
	 */
	var DECK = [];
	for (var c = 0; c < 3; c++){
		for (var s = 0; s < 3; s++) {
			for (var i = 0; i < 3; i++) {
				for (var n = 0; n < 3; n++) {
					DECK.push(new Card(c, s, i, n));
				}
			}
		}
	}
	var LEN = DECK.length;

	this.length = LEN;
	this.deck = DECK;
	this.draw = function() {
			// picks the card on top of the deck (at index 0), returns it and
			// places it at the end of the deck
			var card = this.deck[0];
			if (card.drawn) {
				console.warn("All cards are drawn");
				return none;
			}
			
			// remove the card at index 0 and place it at the end with drawn set to true
			card.drawn = true;
			this.deck.shift();
			this.deck.push(card);
			return card;
		};
	this.set = function(count){
			// returns a set of @count cards drawn from the top of the deck
			// if the number of cards not drawn is less than @count, returns that number
			// of cards instead
			res = [];
			for (var i = 0; i < count; i++) {
				// console.log(this.deck[0]);
				if (!this.deck[0].drawn) {
					var card = this.deck[0];
					card.drawn = true;
					// remove the card at index 0 and place it at the end with drawn set to true
					this.deck.shift(); this.deck.push(card);
					// add the card to res
					res.push(card);
				} else { break; }
			}
			return res;
		};
	// A set of random functions
	this.random =  {
		cardIndex: function() { return randomIntFromArray(LEN); },
		card: function() {
				// returns a card randomly from the deck whether or not it's been drawn
				return this.deck[randomIntFromArray(LEN)];
			}, 
		set: function(count){
				// returns a set of @count cards picked randomly from the deck
				res = [];
				drawnIndexes = [];
				for (var i = 0; i < count; i++) {
					var index = randomIntFromArray(LEN);
					while (index in drawnIndexes){
						index = randomIntFromArray(LEN);
					}
					var card = this.deck[index];
					// add this card to @res, and add its index to @drawnIndexes 
					// to make sure we pick a different card next
					res.push(card);
					drawnIndexes.push(index);
				}
				return res;
			}
		};
	this.drawnCards = function() {
			// assumes the cards at the bottom of the deck (start from index @LEN and down) 
			// are not drawn. Pick from there, if we reach one of the drawn cards at the bottom, 
			// then we stop.
			var res = [];
			for (var i = LEN - 1; i >= 0; i--) {
				if (this.deck[i].drawn) res.push(this.deck[i]);
				else break;
			}
			return res;
		};
	this.undrawnCards = function() {
			// assumes the cards on top of the deck (start from index 0 and up) are not drawn.
			// Pick from there, if we reach one of the drawn cards at the bottom, then we stop.
			var res = [];
			for (var i = 0; i < LEN; i++) {
				if (!this.deck[i].drawn) res.push(this.deck[i]);
				else break;
			}
			return res;
		};
	this.shuffle = function() {
			/* Shuffles the deck. Makes sure to keep the drawn cards at the bottom. */
			// get the undrawn deck and shuffle it
			var undrawnDeck = [];
			for (var i = 0; i < LEN; i++) {
				if (!this.deck[i].drawn) undrawnDeck.push(this.deck[i]);
				else break;
			}
			// get the drawn deck and shuffle it
			var drawnDeck = [];
			for (var i = LEN - 1; i >= 0; i--) {
				if (this.deck[i].drawn) drawnDeck.push(this.deck[i]);
				else break;
			}
			// shuffle both decks
			undrawnDeck = shuffleArray(undrawnDeck);
			drawnDeck = shuffleArray(drawnDeck);
			// join the two by making sure undrawn comes first (so they can be drawn)
			this.deck = undrawnDeck.concat(drawnDeck);
			return this.deck;
		};
	this.redo = function() {
		// this function makes the deck go back to fresh with no drawn cards and shuffles itself.
		for (var i = this.length; i >= 0; i--) {
			if (this.deck[i].drawn) {
				this.deck[i].drawn = false;
			} else { break; }
		}
		this.shuffle();
		return this.deck;
	}
	this.seeAll = function() {
		// prints out the values of each cards out in the console including drawn status
		for (var i = 0; i < this.length; i++){
			var card = this.deck[i];
			console.log(card.color.value, card.shape.value, card.interior.value, card.number.value, card.drawn);
		}
		return true;
	}
	this.seeDrawnValues = function() {
		/* prints out an array of boolean, true meaning the card was drawn. 
		Expected all trues at the end and all false at the beginning.
		e.g.: [true, true, ..., true, false, false, ..., false] */
		var res = [];
		for (var i = 0; i < this.length; i++) {
			res.push(this.deck[i].drawn);
		}
		return res;
	}
}

/**
 * Functions operating on Objects Cards and Decks
 */

function isProperSet(set){
	/* 

	Set is a set of cards as an array containing Cards. We say that a set of **3** card is a proper set
	if for each of the characteristic in that set (color, shape, interior, number), they are either
	all the same or all different. For example, [(0,0,0,0), (0,0,0,1), (0,0,0,2)] is a set but 
	[(2,0,1,0), (2,0,0,1), (2,0,0,2)] is not a set because the two latter's interiors are the same but
	the first one is different. They either are all different or all the same. 

	- Point: It's always guaranteed that one characteristic is different. While all can be different.
	- Will throw an Assertion Error if the length is not 3. 

	*/
	console.assert(set.length == 3, "The size of the set must be 3 to be a valid set");
	// assume this is a valid set
	var test_color = true, test_shape = true, test_interior = true, test_number = true;
	var color_values = [], shape_values = [], interior_values = [], number_values = [];
	for (var i = 0; i < set.length; i ++) {
		var card = set[i];
		color_values.push(card.color.value);
		shape_values.push(card.shape.value);
		interior_values.push(card.interior.value);
		number_values.push(card.number.value);
	}

	function isRight(values){
		/* there should be 3 values, each of which must be either 0, 1, or 2. if they are all different
		or all the same then return true. Otherwise return false. 
		This function is declared inside this function because it should not be modified and will
		only be called inside. */
		if (values[0] == values[1]) {
			return (values[1] == values[2]);
		} else {
			return (values[1] != values[2]) && (values[0] != values[2]);
		}
	}

	return (isRight(color_values)) && (isRight(shape_values)) && (isRight(interior_values)) && (isRight(number_values));
}

/**
 * Helper functions used in many of the functions and objects above.
 */

function randomIntFromArray(arrayLength) {
	// returns a random integer in the range of [0-(arrayLength-1)]
	return Math.floor(Math.random() * arrayLength);
}

function shuffleArray(array) {
	/**
 	 * Randomize array element order in-place.
 	 * Using Durstenfeld shuffle algorithm.
 	 * #from: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 	 */
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function comb3fromArray(array){
	// generates all combinations of length 3 from the given array
	console.assert(array.length >= 3, "Array must has a length of 3 or more");
	console.log("NOT IMPLEMENTED");
	return false;
}



