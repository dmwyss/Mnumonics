
function Try(){
	this.numberId = -1;
	this.count = 0;
	this.right = 0;
	this.pause = 0;
	this.getRating = function(){
		var iOut = Math.round((this.right * 1000) / this.count);
		iOut -= this.getWrong() * 33;
		return iOut;
	};
	this.getWrong = function(){
		return (this.count - this.right);
	};
	this.reset = function(){
		this.count = 0;
		this.right = 0;
		this.pause = 0;
	};
	this.toString = function(){
		return "numberId:["  + this.numberId + "]"
			+ "count:[" + this.count + "]"
			+ "right:[" + this.right + "]"
			+ "pause:[" + this.pause + "]"
			+ "rating:[" + this.getRating() + "]"
			;
	};
}

function Tries(){
	this.data = new Array();
	this.add = function(sIn){
		var tryTemp = new Try();
		var asIn = sIn.split(",");
		var tryTemp = new Try();
		tryTemp.numberId = this.parseInt(asIn[0]);
		tryTemp.count = this.parseInt(asIn[1]);
		tryTemp.right = this.parseInt(asIn[2]);
		tryTemp.pause = this.parseInt(asIn[3]);
		this.data[this.data.length] = tryTemp;
		return tryTemp;
	};
	this.size = function(){
		return this.data.length;
	};
	this.parseInt = function(vIn){
		//if(typeof vIn == "undefined"){
		if(isNaN(parseInt(vIn))){
			alert("cannot parse Tries.parseInt[" + vIn + "]");
			return 0;
		}
		return parseInt(vIn);
	};
}

var tries = new Tries();
