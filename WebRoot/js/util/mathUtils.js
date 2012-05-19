
function getRandom(iMin, iMax){
	var iRange = iMax - iMin; // Now starts at zero.
	return iMin + (Math.round(Math.random() * iRange * 1000) % iRange);
}

function parseIntSafe(vIn){
	if(isNaN(vIn)){
		return 0;
	}
	return parseInt(vIn);
}