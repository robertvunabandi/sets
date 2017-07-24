function combinations_indexes(array, size){
	/* Generates all possible combinations of size @size from the array @array */

	// get the size of the array and make sure the it's the same or more than @size
	const L = array.length;
	console.assert(size <= L, "Size must be smaller than array length");

	// define variables
	var res = [];
	var resIndex = [];
	for (var i = 0; i < size; i++) resIndex.push(i); // resIndex = [0, 1, 2, ... , size - 1]
	

	// push the initial indexes
	res.push(resIndex.slice(0));

	/* Since order does not matter for combinations, we will generate 
	nCr(@L, @size) indexes for subsets of size @size. At the end, we use 
	those indexes to get the actual combinations in the next functions. */

	var currentIndex = L - 1;

	while (resIndex[0] < L - size + 1) {
		// console.log(resIndex);
		while (resIndex[currentIndex] < L - (size - currentIndex - 1)) {
			// console.log(resIndex, res[res.length - 1]);
			res.push(resIndex.slice(0));
			resIndex[currentIndex] += 1
		}
		currentIndex -= 1;
		for (var i = currentIndex; i < size; i++) {
			resIndex[i] = i == currentIndex ? resIndex[i]+1 : resIndex[i-1]+1;
		}
		while (resIndex[currentIndex+1] < L - (size - currentIndex - 1)) {
			currentIndex++;
			if (currentIndex == size - 1) break;
		}
	}
	// return a copy so that things don't get modified internally
	return res.slice(0); 
}

function combinations(array, size) {
	// get the indexes. This will throw an assertion error if array.length < size
	var indexes = combinations_indexes(array, size);

	// from the indexes, figure out the combinations
	res = [];
	for (var i = 0; i < indexes.length; i++){
		let temp = [], currentIndexes = indexes[i];
		for (var j = 0; j < currentIndexes.length; j++){
			temp.push(array[currentIndexes[j]]);
		}
		res.push(temp.slice(0));
	}
	return res;
}

/**
 * 
 * How this works:
 * ===============
 * 
 * (Just an FYI, I use "@" to reference variables used in functions)
 * 
 * For example, d = combinations(["I", "Love", "Like", "You"], 3) should produce
 * d = [["I","Love","Like"],["I","Love","You"],["I","Like","You"],"Love","Like","You"]]. 
 * 
 * The main part is the @combinations_indexes. This functions comes from the fact that 
 * a combination of things does not need an order. Therefore, if we need to have 
 * combinations of size @size from an array of length @array.length or @L, 
 * we only need the indexes of all the possible combinations. We can find those 
 * combinations by listing all the numbers of length @size that contain uniquely digits 
 * in the range [0-@L-1] (where for each number no digit repeats) in order of growth
 * (Now, this logic may not apply for numbers at index > 10, but the idea is listing
 * the digits in "order of growth". For example: 0 11 22 comes before 0 12 22 which 
 * comes before 10 12 22, which this algorithm does).
 * 
 * Listing all these digits gives all the possible indexes for combinations. Then,
 * we form the combinations based on those indexes. Hope that makes sense. Here's an
 * example to illustrate. 
 * 
 * array = ["I", "Love", "Like", "You"]
 * digitIndexes = [0, 1, 2, 3]
 * List in "order of growth": [012, 013, 023, 123]
 * List in "order of growth" in an array: [[0,1,2],[0,1,3],[0,2,3],[1,2,3]]
 * List corresponding to indexes, which is also the combinations: 
 * * * [["I","Love","Like"],["I","Love","You"],["I","Like","You"],"Love","Like","You"]]
 * 
 * The algorithm written works in a way to add up the numbers just like they would
 * appear in that second list in "order of growth". The way to do it is a bit hard to
 * explain however, so I will leave it to readers to understand.
 *
 * ===================
 * Robert M. Vunabandi
 * ===================
 * 
 */


