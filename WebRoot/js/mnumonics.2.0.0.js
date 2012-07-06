
var slideManger;
function showRandomSlide(){
	var iPeg = getRandom(0, 100);
	showSlide(iPeg);
}

function showSlide(iPeg){
	var areaTrg = document.getElementById("areaSlide");
	var sOut = "<h3>" + iPeg + "</h3>";
	areaTrg.innerHTML = sOut;
}

function Peg(iNumber, sDescription){
	this.number = iNumber;
	this.description = sDescription;
	this.showCount = 0;
	this.rightCount = 0;
	this.toString = function(){
		return "Peggy " + this.number;
	};
	this.isKnownWell = function(){
		if(this.showCount == 0){
			return false;
		}
		return (Math.round(this.rightCount / this.showCount) >= 1);
	};
}

function SlideManager(){
	this.isShuffle = false;
	this.pegs = new Array();
	this.pegsShuffled = new Array();
	this.cursor = 0;
	this.getPegTestResults = function(){
		var asOut = new Array();
		for ( var iPegCounter = 0; iPegCounter < this.pegs.length; iPegCounter++) {
			var pegTemp = this.pegs[iPegCounter];
			if(pegTemp.showCount > 0){
				asOut[asOut.length] = pegTemp.number + "-" + pegTemp.rightCount + "-" + pegTemp.showCount + "";
				var divTrg = document.getElementById("tablePeg_" + pegTemp.number);
				if(divTrg != null){
					var sSetting = "areaTablePegWrong";
					if(pegTemp.isKnownWell()){
						sSetting = "areaTablePegRight";
					}
					divTrg.className = sSetting;
				}
			}
		}
		return asOut;
	};
	this.init = function(){
		var sDataRaw = document.forms[0].txaData.value;
		var asDataRaw = sDataRaw.split("\r").join("\n").split("\n\n").join("\n").split("\n\n").join("\n").split("\n");
		var apegTemp = new Array();
		var sPreviousAnswersFromCookie = "," + getCookie("mnumonics_answers") + ",";
		for(var i = 0; i < asDataRaw.length; i++){
			var sLine = asDataRaw[i];
			sLine = sLine.split("  ").join(" ");
			if(sLine == ""){
				continue;
			}
			var iPosSep = sLine.indexOf(" ");
			var iNr = sLine.substring(0, iPosSep);
			var sDescription = sLine.substring(iPosSep + 1);
			var pegTemp = new Peg(iNr, sDescription);
			var iPos = sPreviousAnswersFromCookie.indexOf("," + iNr + "-");
			if(iPos != -1){
				var sCounts = sPreviousAnswersFromCookie.substring(iPos + 1);
				sCounts = sCounts.substring(0, sCounts.indexOf(","));
				var asCounts = splitToNumber(sCounts, "-");
				pegTemp.rightCount = asCounts[1];
				pegTemp.showCount = asCounts[2];
			}
			apegTemp[apegTemp.length] = pegTemp;
		}
		this.pegs = apegTemp;
		this.pegsShuffled = shuffleArray(apegTemp);
		for ( var iP = 0; iP < this.pegsShuffled.length; iP++) {
			if(this.pegsShuffled[iP].isKnownWell()){
				this.pegsShuffled.splice(iP, 1);
			}
		}
	};
	this.showFirstSlide = function(){
		this.cursor = 0;
		this.showSlide(this.pegsShuffled[this.cursor], false);
	};
	this.showNextSlide = function(){
		this.cursor++;
		if(this.cursor > this.pegsShuffled.length){
			// We have reached the end of the list.
			// Reduce the list to only those that were answered incorrectly.
			for ( var iP = 0; iP < this.pegsShuffled.length; iP++) {
				if(this.pegsShuffled[iP].isWellKnown()){
					this.pegsShuffled.splice(iP, 1);
				}
			}
			this.cursor = 0;
		}
		var pegTemp = this.pegsShuffled[this.cursor];
		this.showSlide(pegTemp, false);
		pegTemp.showCount++;
	};
	this.showSlide = function(pegTemp, isShowAnswer){
		var sNextSlide = "slideManager.showNextSlide();";
		var sOut = "<table class=\"slide-table\" cellpadding=\"0\" cellpadding=\"0\" border=\"0\"><tr>";
		sOut += "<td rowspan=\"2\" class=\"slide-number\">";
		sOut += pegTemp.number;
		//sOut += " (" + pegTemp.rightCount + "/" + pegTemp.showCount + ")";
		sOut += "</td><td onclick=\"";
		if(isShowAnswer){
			sOut += sNextSlide + "\" class=\"slide-answer";
		} else {			
			sOut += "slideManager.answerSlide(true);\" class=\"slide-answer slide-answerTrue";
		}
		sOut += "\">";
		sOut += "Know";
		sOut += "</td></tr><td onclick=\"";
		if(isShowAnswer){
			sOut += sNextSlide + "\" class=\"slide-answer";			
		} else {			
			sOut += "slideManager.answerSlide(false);\" class=\"slide-answer slide-answerFalse";
		}
		sOut += "\">";
		sOut += "Dont know";
		sOut += "</td>";
		sOut += "</tr>";
		sOut += "<tr><td colspan=\"2\"";
		sOut += " onclick=\"";
		if (isShowAnswer) {
			sOut += sNextSlide;
			sOut += "\">";
			sOut += pegTemp.description;
		} else {
			//sOut += sNextSlide;
			sOut += "\">&nbsp;";
		}
		sOut += "</td></tr>";	
		sOut += "<table>";
		sOut += "<span class=\"tiny\">" + this.cursor + "/" + this.pegsShuffled.length + "</span>";
		document.getElementById("areaSlide").innerHTML = sOut;
	};
	this.answerSlide = function(isKnow){
		var pegTemp = this.pegsShuffled[this.cursor];
		if (isKnow) {
			pegTemp.rightCount++;			
		}
		this.showSlide(pegTemp, true);
		this.savePegTestResults();
	};
	this.resetPegTestResults = function(){
		deleteCookie("mnumonics_answers");
		slideManager.showFirstSlide();
		loadTable();
	};
	this.savePegTestResults = function(){
		var sOut = this.getPegTestResults().join(',');
		//document.getElementById('areaInfo').innerHTML = sOut;
		setCookie("mnumonics_answers", sOut);
	};
}

function showMode(sMode){
	var sTableSetting = "none";
	var sTestSetting = "";
	var sHundredsSetting = "none";
	if(sMode == "table"){
		sTableSetting = "";
		sTestSetting = "none";
		sHundredsSetting = "none";
	} else if(sMode == "hundreds"){
		sTableSetting = "none";
		sTestSetting = "none";
		sHundredsSetting = "";
	}
	document.getElementById("content-tableWrapper").style.display = sTableSetting;
	document.getElementById("content-testWrapper").style.display = sTestSetting;
	document.getElementById("content-hundredsWrapper").style.display = sHundredsSetting;
}

function loadTable(){
	var sOut = "<table cellpadding=\"0\" cellpadding=\"0\"><tr><td>";
	for ( var iPeg = 0; iPeg < slideManager.pegs.length; iPeg++) {
		var pegTemp = slideManager.pegs[iPeg];
		if((iPeg != 0) && (iPeg % 20 == 0)){
			sOut += "</td>";
			sOut += "<td>";
		}
		var sCssClass = "";
		if (pegTemp.showCount > 0) {
			sCssClass = " class=\"areaTablePegWrong\"";
			if(pegTemp.isKnownWell()){
				sCssClass = " class=\"areaTablePegRight\"";
			}
		}
		sOut += "<div id=\"tablePeg_" + pegTemp.number + "\"" + sCssClass + ">" + pegTemp.number + "&nbsp;";
		sDebug = " (" + pegTemp.rightCount + "/" + pegTemp.showCount + ")";
		sOut += pegTemp.description.split(" ").join("&nbsp;") + "&nbsp;&nbsp;&nbsp;</div>";
	}
	sOut += "</td></tr></table>";
	document.getElementById("areaTable").innerHTML = sOut;
}

function loadHundreds(){
	var sOut = "<table><tr>";
	for ( var iH = 1; iH < 10; iH++) {
		sOut += "<td style=\"width:102px;height:102px;vertical-align:top;\">";
		sOut += "<div style=\"position:relative;\">";
		sOut += "<div style=\"position:absolute;\">";
		sOut += "<img src=\"img/" + iH + "00.jpg\" style=\"width:102px;\"/>";
		sOut += "</div>";
		sOut += "<div style=\"position:absolute;top:50px;right:40px;color:white;font-size:30pt;opacity:0.6;filter:alpha(opacity=60);\">";
		sOut += "" + iH + "";
		sOut += "</div>";
		sOut += "</div>";
		sOut += "</td>";
		if((iH > 0) && (iH % 3 == 0)){
			sOut += "</tr><tr>";
		}
	}
	sOut += "</tr></table>";
	document.getElementById("areaHundreds").innerHTML = sOut;
}

function doOnLoad(){
	slideManager = new SlideManager();
	slideManager.init();
	slideManager.showFirstSlide();
	loadTable();
	loadHundreds();
	iosFooter.addButton("List", "showMode(\'table\');", "bottomNav", "iosButton-bottomNav", "background-image:url(img/icoList.png);");
	iosFooter.addButton("Game", "showMode(\'test\');", "bottomNav", "iosButton-bottomNav", "background-image:url(img/icoGame.png);");
	iosFooter.addButton("Hundreds", "showMode(\'hundreds\');", "bottomNav", "iosButton-bottomNav", "background-image:url(img/icoHundreds.png);");
	iosFooter.addButton("Settings", "alert(\'not impolemented\');", "bottomNav", "iosButton-bottomNav", "background-image:url(img/icoSettings.png);");
	iosFooter.draw();
}