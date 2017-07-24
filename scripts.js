var index = 0;
var playerNamesArray = ["P1", "P2", "P3"];
$(document).ready(function(){
	console.log("PLAY SETS!");
	$("#new_game_button").hover(function() {
		let newColor = [colorRed,colorViolet,colorGreen][Math.round(Math.random()*2)];
		$(this).css('color', `#${newColor}`);
	}, function() {
		$(this).css('color', 'white');
	});
});

function Game() {
	var _SCOREBOARD = new ScoreBoard("#score_board", playerNamesArray);
	var _GAME = new CardPositions("#main", _SCOREBOARD);
	_GAME.create();
	var clickedIndexes = [];
	var clickedCount = 0;
	for (var i = 0; i < 6; i++){
		for (var j = 0; j < 3; j++){
			$(`#_${i}${j}_`).click(function() {
				var index = [parseInt(this.id[1]), parseInt(this.id[2])];
				var hasClass = $(`#_${index[0]}${index[1]}_`).hasClass("card-highligted");

				if (hasClass) {
					$(`#_${index[0]}${index[1]}_`).removeClass("card-highligted");
					
					clickedCount--;
					var removeIndex = clickedIndexes.indexOf(index);
					clickedIndexes.splice(removeIndex, 1);
				} else if (clickedCount < 3) {
					$(`#_${index[0]}${index[1]}_`).addClass("card-highligted");

					clickedCount++;
					clickedIndexes.push(index);
					ResultChoices(clickedCount);
				} else {
					console.warn("COUNT CANNOT BE EXCEEDED");
				}
			});
		} 
	}
	function ResultChoices(clickedCount_){
		// rc stands for ResultChoices. This is to avoid any javascript errors
		var rc_c = clickedCount_;
		
		// 
		// 
		// if possible, tell users how many sets are available
		// DO THIS BY ADDING A SET COUNT THAT IS AVAILABLE AND UPDATED EVERY TIME
		// 
		// 
		// 

		if (rc_c == 3) {
			var rc_set = [];
			for (var i = 0; i < clickedIndexes.length; i++){
				var rc_index = clickedIndexes[i];
				console.log(rc_index, _GAME.positions);
				var card = _GAME.positions[rc_index[0]][rc_index[1]];
				rc_set.push(card);
			}
			if (isProperSet(rc_set)) {
				// if the selected items are a proper set, then we remove then and add points to the current user
				_GAME.remove(clickedIndexes[0], clickedIndexes[1], clickedIndexes[2]);
				_GAME.update();

				// add point to current user
				/* N.I.: Ideally, get the user that clicked first, add points to him, and display it. */
			
			} 
			for (var i = 0; i < clickedIndexes.length; i++) {
				// remove the highlighting on the HTML objects
				var rc_index = clickedIndexes[i];
				$(`#_${rc_index[0]}${rc_index[1]}_`).removeClass("card-highligted");
			}
			clickedCount = 0;
			clickedIndexes = []; 
		}
	}
}