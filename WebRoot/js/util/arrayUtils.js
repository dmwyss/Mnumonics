
// Requires the mathUtils for splitToNumber().

/**
 * Shuffle the elements of an array. 
 * @param asIn
 * @returns {Array}
 */
function shuffleArray(asIn){
	var asCopy = copyArray(asIn);
	var asOut = new Array();
	var iBrake = 150;
	while((asCopy.length > 0) && (iBrake > 0)){
		iBrake--;
		var iGet = getRandom(0, asCopy.length);
		asOut[asOut.length] = asCopy[iGet];
		asCopy.splice(iGet, 1);
	}
	return asOut;
}

function copyArray(aoIn){
	var aoOut = new Array();
	for ( var iElem = 0; iElem < aoIn.length; iElem++) {
		aoOut[aoOut.length] = aoIn[iElem];
	}
	return aoOut;
}

/**
 * Split a string into an array of numbers.
 */
function splitToNumber(sIn, sSep){
	var asIn = sIn.split(sSep);
	var aiOut = new Array();
	for ( var iElem = 0; iElem < asIn.length; iElem++) {
		aiOut[aiOut.length] = parseIntSafe(asIn[iElem]);
	}
	return aiOut;
}
