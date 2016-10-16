function addTooltip(info, element, hasError) {
		// create/attach tooltip card
    var card = document.createElement("div");
    card.setAttribute("class", "cardContainer");

		// check for erroneous response
		if (hasError) {
		    card.innerHTML = "<div class='card'> <div class='card-content'> <span class='card-title'></span> <p> <span class='cardError'><b>Error:</b> " + info.error + "</p></span> </div> </div>";
		} else {
		    card.innerHTML = "<div class='card'> <div class='card-content'> <span class='card-title'>" + info.name + "</span> <table id='headRatingTable'> <tr id='headRatingLabel'> <td>Overall:</td> <td>Average Grade:</td> </tr> <tr id='headRating'> <td>"+ info.overall +"</td> <td>"+ info.average +"</td> </tr> </table> <table id='subRatingTable'> <tr> <td>Helpfulness:</td> <td><svg width='130px' height='13px' version='1.1'> <g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' sketch:type='MSPage'> <g sketch:type='MSLayerGroup' transform='translate(-106.000000, -144.000000)' stroke-linecap='square' stroke-width='2' fill='#009688'> <g id='sub-Ratings' transform='translate(18.000000, 141.000000)' sketch:type='MSShapeGroup'> <g id='slider' transform='translate(89.000000, 4.000000)'> <path d='M0.5,6 L137.003662,6' id='Line' stroke='#D8D8D8'></path> <circle id='Path' stroke='#009688' cx=" + info.scaled.helpfulness + " cy='5.5' r='5.5'></circle> </g> </g> </g> </g> </svg></td> <td>" + info.helpfulness + "</td> </tr> <tr> <td>Clarity:</td> <td><svg width='130px' height='13px' version='1.1'> <g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' sketch:type='MSPage'> <g sketch:type='MSLayerGroup' transform='translate(-106.000000, -144.000000)' stroke-linecap='square' stroke-width='2' fill='#009688'> <g id='sub-Ratings' transform='translate(18.000000, 141.000000)' sketch:type='MSShapeGroup'> <g id='slider' transform='translate(89.000000, 4.000000)'> <path d='M0.5,6 L137.003662,6' id='Line' stroke='#D8D8D8'></path> <circle id='Path' stroke='#009688' cx=" + info.scaled.clarity + " cy='5.5' r='5.5'></circle> </g> </g> </g> </g> </svg></td> <td>" + info.clarity + "</td> </tr> <tr> <td>Easiness:</td> <td><svg width='130px' height='13px' version='1.1'> <g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' sketch:type='MSPage'> <g sketch:type='MSLayerGroup' transform='translate(-106.000000, -144.000000)' stroke-linecap='square' stroke-width='2' fill='#009688'> <g id='sub-Ratings' transform='translate(18.000000, 141.000000)' sketch:type='MSShapeGroup'> <g id='slider' transform='translate(89.000000, 4.000000)'> <path d='M0.5,6 L137.003662,6' id='Line' stroke='#D8D8D8'></path> <circle id='Path' stroke='#009688' cx=" + info.scaled.easiness + " cy='5.5' r='5.5'></circle> </g> </g> </g> </g> </svg></td> <td>" + info.easiness + "</td> </tr> </table> </div> <div class='card-action'> <a target='_blank' href='http://www.ratemyprofessors.com" + info.link + "'>View Rating</a> <a class='add-btn' target='_blank' href='http://www.ratemyprofessors.com/AddRating.jsp?tid=" + info.link.split('tid=')[1] + "'>Add Rating</a> </div> </div>";
		}
    element.appendChild(card);

    // add event listener to keep card displayed on hover
    var cardContainer = element.getElementsByClassName('cardContainer')[0];
    element.addEventListener("mouseover", function() {
			window.clearTimeout(this.timeoutID);
			cardContainer.style.display = 'block';
    });
    element.addEventListener("mouseout", function() {
			this.timeoutID = window.setTimeout(function() {
				cardContainer.style.display = 'none';
			}, 25);
    });
}

function addRatingTh(row) {
  var headRow = row.parentNode.firstChild;
  var rating = document.createElement("th");
  rating.innerHTML = "Rating";
  headRow.insertBefore(rating, headRow.childNodes[12]);
}

function addRatingColumn(info, element) {
  var cell = element.parentNode.insertCell(6);

  // set corresponding html
  if (info.hasOwnProperty("error")) {
    cell.innerHTML = "<span class='ratingCell errorCell'>N/A</span>";
    addTooltip(info,cell,true);
  } else {
    cell.innerHTML = "<span class='ratingCell'>" + info.overall + "</span>";
    addTooltip(info,cell,false);
  }
}

function getProfInfo (nameText, profElement){

    console.log("Getting prof and formatting...");

    //format json
    if (nameText){
				var request = { name: nameText };
    }
    else{
        return null;
    }

    console.log(request);

    //get possible nicknames
    var firstName = nameText.split([" "])[0].toLowerCase();
    console.log(firstName);
    console.log(nickNames.length);
    var alternateNames = [];
    console.log(nickNames[0].name);
    console.log(nickNames[0].nickName);

    for (var i = 0; i < nickNames.length; i++){

    	if (nickNames[i].name.toLowerCase() == firstName){
    		console.log("Match on " + nickNames[i].name.toLowerCase());
    		var tmpName = nickNames[i].nickName;
    		console.log(tmpName);
    		console.log(tmpName.substring(0,1));
    		tmpName = tmpName.substring(0,1).toUpperCase() + tmpName.slice(1,tmpName.length).toLowerCase();
    		alternateNames.push(tmpName);
    	}
    }

    return requestProf(request, profElement, alternateNames);
}

function requestProf( request, passedElement, nickNameArray){

	console.log(nickNameArray);

	return chrome.runtime.sendMessage( request, function(response) {

    	console.log("response: " + response);

    	if (response.hasOwnProperty("error") && nickNameArray.length > 0){

    		var newFirstName = nickNameArray[0];
    		var lastName = request.name.split([" "])[1];
    		var newRequest = { name: newFirstName + " " + lastName};
    		nickNameArray.splice(0,1);

    		requestProf(newRequest, passedElement, nickNameArray);

    	}
    	else {
    		addRatingColumn(response, passedElement);
    	}
    });

}

function formatName (name) {
    var nameArray = name.split(",");
    if (nameArray[0] && nameArray[1]){

        nameArray[0] = nameArray[0].toLowerCase().trim().replace( /\b\w/g, function (m) {
                return m.toUpperCase();
            });
        nameArray[1] = nameArray[1].toLowerCase().trim().replace( /\b\w/g, function (m) {
                return m.toUpperCase();
            });

				return nameArray[1] + " " + nameArray[0];
    }

    return null;
}

function fillProfs (profRows){

    console.log("getProfs...");

    //check to see if null or undefined
    if (!profRows) {return;}

    // add rating cell to remaining if rating header added
    var addCell = false;
    for (i = 0; i < profRows.length; i++){

        var rowCells = profRows[i].getElementsByTagName("td");

        //check to make sure by act of god somehow there are not enough rows
        if (rowCells.length < 6) {return;}

        var currProf = rowCells[5];
        var currProfText = currProf.textContent;

        if (currProfText.length > 0){
            var profName = formatName(currProfText);
            console.log("prof name: " + profName);

            if (profName){
              if (i == 0) {
                addRatingTh(profRows[0]);
                addCell = true;
              }
                getProfInfo(profName, currProf);
            } else if (addCell) {
                profRows[i].insertCell(6);
            }
        }
    }
}

// specify tableRows element to parse for prof name
var insertDivContent = function(event, isCoursePage){
  if (event.srcElement.parentElement.querySelectorAll("div.cardContainer").length != 0) { return; }

	if (isCoursePage || event.animationName == "nodeInserted") {

    // get the table rows
    var divAdded;
    if (isCoursePage) {
      divAdded = document.querySelectorAll("table.sectionDetailList")[0].getElementsByTagName("tbody")[0];
    } else {
      divAdded = event.target.getElementsByTagName("tbody")[0];
    }

    if (divAdded !== undefined) {
      console.log(divAdded);
      var tableRows = divAdded.getElementsByClassName("detailsClassSection");
      fillProfs(tableRows);
    }
	}
};

var nickNames = [{"name":"ABIGAIL","nickName":"ABBIE"},{"name":"ABIGAIL","nickName":"ABBY"},{"name":"ABRAHAM","nickName":"ABE"},{"name":"ABRAM","nickName":"ABE"},{"name":"ADALINE","nickName":"ADA"},{"name":"ADALINE","nickName":"ADDY"},{"name":"AGATHA","nickName":"AGGY"},{"name":"AGNES","nickName":"AGGY"},{"name":"AUGUSTA","nickName":"AGGY"},{"name":"AUGUSTINA","nickName":"AGGY"},{"name":"ALAN","nickName":"AL"},{"name":"ALBERT","nickName":"AL"},{"name":"ALDO","nickName":"AL"},{"name":"ALEXANDER","nickName":"AL"},{"name":"ALFONSE","nickName":"AL"},{"name":"ALFRED","nickName":"AL"},{"name":"ALLAN","nickName":"AL"},{"name":"ALLEN","nickName":"AL"},{"name":"ALONZO","nickName":"AL"},{"name":"ALEXANDER","nickName":"ALEX"},{"name":"ALEXANDRA","nickName":"ALEX"},{"name":"ALICE","nickName":"ALLIE"},{"name":"ALICIA","nickName":"ALLIE"},{"name":"ALMENA","nickName":"ALLIE"},{"name":"ANDERSON","nickName":"ANDY"},{"name":"ANDREW","nickName":"ANDY"},{"name":"ANTOINETTE","nickName":"ANN"},{"name":"ANTONIA","nickName":"ANN"},{"name":"ROSAENN","nickName":"ANN"},{"name":"ROSAENNA","nickName":"ANN"},{"name":"ROXANNE","nickName":"ANN"},{"name":"ROXANNA","nickName":"ANN"},{"name":"ANN","nickName":"ANNIE"},{"name":"ANNE","nickName":"ANNIE"},{"name":"ARABELLA","nickName":"ARA"},{"name":"ARABELLE","nickName":"ARA"},{"name":"ARCHIBALD","nickName":"ARCHIE"},{"name":"ARLENE","nickName":"ARLY"},{"name":"ARTHUR","nickName":"ART"},{"name":"BARBARA","nickName":"BABS"},{"name":"BARBARA","nickName":"BARBIE"},{"name":"BARNABAS","nickName":"BARNEY"},{"name":"BERNARD","nickName":"BARNEY"},{"name":"BARTHOLOMEW","nickName":"BART"},{"name":"BEATRICE","nickName":"BEA"},{"name":"REBECCA","nickName":"BECCA"},{"name":"REBECCA","nickName":"BECKY"},{"name":"ARABELLA","nickName":"BELLA"},{"name":"ISABELLA","nickName":"BELLA"},{"name":"ROSABELLA","nickName":"BELLA"},{"name":"ARABELLA","nickName":"BELLE"},{"name":"BELINDA","nickName":"BELLE"},{"name":"ISABEL","nickName":"BELLE"},{"name":"ISABELLE","nickName":"BELLE"},{"name":"ROSABEL","nickName":"BELLE"},{"name":"BENEDICT","nickName":"BEN"},{"name":"BENJAMIN","nickName":"BEN"},{"name":"BENJAMIN","nickName":"BENJY"},{"name":"BENEDICT","nickName":"BENNIE"},{"name":"BERNARD","nickName":"BERNY"},{"name":"ALBERT","nickName":"BERT"},{"name":"DELBERT","nickName":"BERT"},{"name":"ELBERT","nickName":"BERT"},{"name":"GILBERT","nickName":"BERT"},{"name":"HERBERT","nickName":"BERT"},{"name":"HUBERT","nickName":"BERT"},{"name":"NORBERT","nickName":"BERT"},{"name":"ELIZABETH","nickName":"BESS"},{"name":"ELIZABETH","nickName":"BETH"},{"name":"ELIZABETH","nickName":"BETSY"},{"name":"ELIZABETH","nickName":"BETTY"},{"name":"ROBERT","nickName":"BILL"},{"name":"WILLIAM","nickName":"BILL"},{"name":"ROBERT","nickName":"BILLY"},{"name":"WILLIAM","nickName":"BILLY"},{"name":"BERTHA","nickName":"BIRDIE"},{"name":"ROBERTA","nickName":"BIRDIE"},{"name":"ROBERTA","nickName":"BIRTIE"},{"name":"ROBERT","nickName":"BOB"},{"name":"BARBARA","nickName":"BOBBIE"},{"name":"ROBERTA","nickName":"BOBBIE"},{"name":"ROBERT","nickName":"BOBBY"},{"name":"BRADFORD","nickName":"BRAD"},{"name":"BRODERICK","nickName":"BRODY"},{"name":"CALVIN","nickName":"CAL"},{"name":"CAMILE","nickName":"CAMMIE"},{"name":"CHARLES","nickName":"CARL"},{"name":"CAROLANN","nickName":"CAROL"},{"name":"CAROLINE","nickName":"CAROL"},{"name":"CAROLINE","nickName":"CASSIE"},{"name":"CASSANDRA","nickName":"CASSIE"},{"name":"CATHERINE","nickName":"CASSIE"},{"name":"CATHLEEN","nickName":"CASSIE"},{"name":"CATHERINE","nickName":"CATHY"},{"name":"CATHLEEN","nickName":"CATHY"},{"name":"CHARLES","nickName":"CHARLIE"},{"name":"CHESTER","nickName":"CHET"},{"name":"CHRISTA","nickName":"CHRIS"},{"name":"CHRISTIAN","nickName":"CHRIS"},{"name":"CHRISTINA","nickName":"CHRIS"},{"name":"CHRISTINE","nickName":"CHRIS"},{"name":"CHRISTOPHER","nickName":"CHRIS"},{"name":"KRISTEN","nickName":"CHRIS"},{"name":"KRISTIN","nickName":"CHRIS"},{"name":"KRISTY","nickName":"CHRIS"},{"name":"CHARLES","nickName":"CHUCK"},{"name":"CINDERLLA","nickName":"CINDY"},{"name":"CYNTHIA","nickName":"CINDY"},{"name":"CLARISSA","nickName":"CLARA"},{"name":"CLIFFORD","nickName":"CLIFF"},{"name":"CLIFTON","nickName":"CLIFF"},{"name":"CONSTANCE","nickName":"CONNIE"},{"name":"CHRINTINA","nickName":"CRISSY"},{"name":"CHRINTINE","nickName":"CRISSY"},{"name":"CURTIS","nickName":"CURT"},{"name":"CYRUS","nickName":"CY"},{"name":"DANIEL","nickName":"DAN"},{"name":"DANIEL","nickName":"DANNY"},{"name":"DAVID","nickName":"DAVE"},{"name":"DAVID","nickName":"DAVEY"},{"name":"DEBORAH","nickName":"DEB"},{"name":"DEBRA","nickName":"DEB"},{"name":"DEBORAH","nickName":"DEBBIE"},{"name":"DEBRA","nickName":"DEBBIE"},{"name":"DELORES","nickName":"DEE"},{"name":"DELBERT","nickName":"DEL"},{"name":"DELORES","nickName":"DELLA"},{"name":"DENNIS","nickName":"DENNIE"},{"name":"DENNISON","nickName":"DENNIS"},{"name":"DENNIS","nickName":"DENNY"},{"name":"RICHARD","nickName":"DICK"},{"name":"DOROTHY","nickName":"DOLLY"},{"name":"DOMENIC","nickName":"DOM"},{"name":"DOMINICO","nickName":"DOM"},{"name":"DONALD","nickName":"DON"},{"name":"DONATO","nickName":"DON"},{"name":"DONALD","nickName":"DONNIE"},{"name":"DONALD","nickName":"DONNY"},{"name":"DOROTHY","nickName":"DORA"},{"name":"ELDORA","nickName":"DORA"},{"name":"ISADORA","nickName":"DORA"},{"name":"DOROTHY","nickName":"DOT"},{"name":"DOROTHY","nickName":"DOTTIE"},{"name":"DOROTHY","nickName":"DOTTY"},{"name":"ANDREW","nickName":"DREW"},{"name":"EDGAR","nickName":"ED"},{"name":"EDMOND","nickName":"ED"},{"name":"EDMUND","nickName":"ED"},{"name":"EDUARDO","nickName":"ED"},{"name":"EDWARD","nickName":"ED"},{"name":"EDWIN","nickName":"ED"},{"name":"EDGAR","nickName":"EDDIE"},{"name":"EDMOND","nickName":"EDDIE"},{"name":"EDMUND","nickName":"EDDIE"},{"name":"EDUARDO","nickName":"EDDIE"},{"name":"EDWARD","nickName":"EDDIE"},{"name":"EDWIN","nickName":"EDDIE"},{"name":"EDGAR","nickName":"EDDY"},{"name":"EDMOND","nickName":"EDDY"},{"name":"EDMUND","nickName":"EDDY"},{"name":"EDUARDO","nickName":"EDDY"},{"name":"EDWARD","nickName":"EDDY"},{"name":"EDWIN","nickName":"EDDY"},{"name":"EDITH","nickName":"EDIE"},{"name":"EDYTH","nickName":"EDIE"},{"name":"EDYTHE","nickName":"EDIE"},{"name":"EDYTH","nickName":"EDYE"},{"name":"EDYTHE","nickName":"EDYE"},{"name":"ELEANOR","nickName":"ELAINE"},{"name":"GABRIELLA","nickName":"ELLA"},{"name":"ELEANOR","nickName":"ELLEN"},{"name":"AMELIA","nickName":"EMILY"},{"name":"EMELINE","nickName":"EMILY"},{"name":"EMELINE","nickName":"EMMA"},{"name":"EMILY","nickName":"EMMA"},{"name":"GENEVIEVE","nickName":"EVE"},{"name":"FAITH","nickName":"FAY"},{"name":"FLORENCE","nickName":"FLO"},{"name":"FLORENCE","nickName":"FLORA"},{"name":"FRANCES","nickName":"FRAN"},{"name":"FRANCINE","nickName":"FRAN"},{"name":"FRANCIS","nickName":"FRAN"},{"name":"FRANCES","nickName":"FRANCIE"},{"name":"FRANCINE","nickName":"FRANCIE"},{"name":"FRANCIS","nickName":"FRANK"},{"name":"FRANKLIN","nickName":"FRANK"},{"name":"FRANCIS","nickName":"FRANKIE"},{"name":"FRANCES","nickName":"FRANNIE"},{"name":"FRANCINE","nickName":"FRANNIE"},{"name":"FRANCES","nickName":"FRANNY"},{"name":"FRANCINE","nickName":"FRANNY"},{"name":"ALFRED","nickName":"FRED"},{"name":"FERDINAND","nickName":"FRED"},{"name":"FREDERICK","nickName":"FRED"},{"name":"FRIEDA","nickName":"FRED"},{"name":"WINNIFRED","nickName":"FRED"},{"name":"ALFREDA","nickName":"FREDA"},{"name":"FREDERICKA","nickName":"FREDA"},{"name":"FERDINAND","nickName":"FREDDIE"},{"name":"FREDERICK","nickName":"FREDDIE"},{"name":"FRIEDA","nickName":"FREDDIE"},{"name":"WINNIFRED","nickName":"FREDDIE"},{"name":"ALFREDA","nickName":"FREDDY"},{"name":"FERDINAND","nickName":"FREDDY"},{"name":"FREDERICK","nickName":"FREDDY"},{"name":"FRIEDA","nickName":"FREDDY"},{"name":"WINNIFRED","nickName":"FREDDY"},{"name":"GABRIELLA","nickName":"GABBY"},{"name":"GABRIELLE","nickName":"GABBY"},{"name":"GABRIEL","nickName":"GABE"},{"name":"ABIGAIL","nickName":"GAIL"},{"name":"EUGENE","nickName":"GENE"},{"name":"GEOFFREY","nickName":"GEOFF"},{"name":"JEFFREY","nickName":"GEOFF"},{"name":"GERALDINE","nickName":"GERRIE"},{"name":"GERALD","nickName":"GERRY"},{"name":"GERALDINE","nickName":"GERRY"},{"name":"GERTRUDE","nickName":"GERTIE"},{"name":"GILBERT","nickName":"GIL"},{"name":"REGINA","nickName":"GINA"},{"name":"MARGARETTA","nickName":"GRETTA"},{"name":"AUGUSTINE","nickName":"GUS"},{"name":"AUGUSTUS","nickName":"GUS"},{"name":"GWENDOLYN","nickName":"GWEN"},{"name":"HAROLD","nickName":"HAL"},{"name":"HENRY","nickName":"HAL"},{"name":"HENRY","nickName":"HANK"},{"name":"JOHANNAH","nickName":"HANNAH"},{"name":"HAROLD","nickName":"HARRY"},{"name":"HENRY","nickName":"HARRY"},{"name":"HARRIET","nickName":"HATTIE"},{"name":"HENRIETTA","nickName":"HENNY"},{"name":"HERBERT","nickName":"HERB"},{"name":"HESTER","nickName":"HETTY"},{"name":"HIPSBIBAH","nickName":"HIPSIE"},{"name":"HUBERT","nickName":"HUGH"},{"name":"IGNATIUS","nickName":"IGGY"},{"name":"ISABEL","nickName":"ISSY"},{"name":"ISABELLA","nickName":"ISSY"},{"name":"ISABELLE","nickName":"ISSY"},{"name":"ISADORA","nickName":"ISSY"},{"name":"ISADORE","nickName":"IZZY"},{"name":"JACOB","nickName":"JAKE"},{"name":"BENJAMIN","nickName":"JAMIE"},{"name":"JAMES","nickName":"JAMIE"},{"name":"JANET","nickName":"JAN"},{"name":"JACOB","nickName":"JAY"},{"name":"GENEVIEVE","nickName":"JEAN"},{"name":"JEBADIAH","nickName":"JEB"},{"name":"GEOFFREY","nickName":"JEFF"},{"name":"JEFFERSON","nickName":"JEFF"},{"name":"JEFFREY","nickName":"JEFF"},{"name":"JENNIFER","nickName":"JENNIE"},{"name":"JENNIFER","nickName":"JENNY"},{"name":"GENEVIEVE","nickName":"JENNY"},{"name":"GERALD","nickName":"JERRY"},{"name":"GERALDINE","nickName":"JERRY"},{"name":"JEREMIAH","nickName":"JERRY"},{"name":"JESSICA","nickName":"JESSIE"},{"name":"JAMES","nickName":"JIM"},{"name":"JAMES","nickName":"JIMMIE"},{"name":"JAMES","nickName":"JIMMY"},{"name":"JOAN","nickName":"JO"},{"name":"JOANN","nickName":"JO"},{"name":"JOANNA","nickName":"JO"},{"name":"JOANNE","nickName":"JO"},{"name":"JOHANNA","nickName":"JO"},{"name":"JOHANNAH","nickName":"JO"},{"name":"JOSOPHINE","nickName":"JO"},{"name":"JOSEPH","nickName":"JODY"},{"name":"JOSEPH","nickName":"JOE"},{"name":"JOSHUA","nickName":"JOE"},{"name":"JOSEPH","nickName":"JOEY"},{"name":"JOSOPHINE","nickName":"JOEY"},{"name":"JOHANN","nickName":"JOHN"},{"name":"JONATHAN","nickName":"JOHN"},{"name":"JONATHAN","nickName":"JON"},{"name":"JOSOPHINE","nickName":"JOSEY"},{"name":"JOSHUA","nickName":"JOSH"},{"name":"JOYCE","nickName":"JOY"},{"name":"JUDITH","nickName":"JUDY"},{"name":"JULIA","nickName":"JULIE"},{"name":"KATELIN","nickName":"KATE"},{"name":"KATELYN","nickName":"KATE"},{"name":"KATHERINE","nickName":"KATE"},{"name":"KATHERINE","nickName":"KATHY"},{"name":"KATHLEEN","nickName":"KATHY"},{"name":"KATHRYN","nickName":"KATHY"},{"name":"KATHERINE","nickName":"KATY"},{"name":"KATHLEEN","nickName":"KATY"},{"name":"KATELIN","nickName":"KAY"},{"name":"KATELYN","nickName":"KAY"},{"name":"KATHERINE","nickName":"KAY"},{"name":"KATELIN","nickName":"KAYE"},{"name":"KATELYN","nickName":"KAYE"},{"name":"KATHERINE","nickName":"KAYE"},{"name":"KENNETH","nickName":"KEN"},{"name":"KENNETH","nickName":"KENNY"},{"name":"KIMBERLEY","nickName":"KIM"},{"name":"KIMBERLY","nickName":"KIM"},{"name":"LAURENCE","nickName":"LARRY"},{"name":"LAWRENCE","nickName":"LARRY"},{"name":"ELIAS","nickName":"LEE"},{"name":"AILEEN","nickName":"LENA"},{"name":"ARLENE","nickName":"LENA"},{"name":"CATHLEEN","nickName":"LENA"},{"name":"DARLENE","nickName":"LENA"},{"name":"KATHLEEN","nickName":"LENA"},{"name":"MAGDELINA","nickName":"LENA"},{"name":"LEONARD","nickName":"LENNY"},{"name":"LEONARD","nickName":"LEO"},{"name":"LEONARD","nickName":"LEON"},{"name":"NAPOLEON","nickName":"LEON"},{"name":"LESTER","nickName":"LES"},{"name":"ELIZABETH","nickName":"LIBBY"},{"name":"LILLIAN","nickName":"LILLY"},{"name":"BELINDA","nickName":"LINDA"},{"name":"MELINDA","nickName":"LINDA"},{"name":"MELISSA","nickName":"LISA"},{"name":"ELIZABETH","nickName":"LIZ"},{"name":"ELIZABETH","nickName":"LIZZIE"},{"name":"LOUISE","nickName":"LOIS"},{"name":"LORETTA","nickName":"LORIE"},{"name":"LORRAINE","nickName":"LORIE"},{"name":"LOUIS","nickName":"LOU"},{"name":"LOUISE","nickName":"LOU"},{"name":"LUCINDA","nickName":"LOU"},{"name":"LUCINDA","nickName":"LUCY"},{"name":"LUCAS","nickName":"LUKE"},{"name":"LUCIAS","nickName":"LUKE"},{"name":"CAROLINE","nickName":"LYNN"},{"name":"CAROLYN","nickName":"LYNN"},{"name":"MADELINE","nickName":"MADDY"},{"name":"MADELYN","nickName":"MADDY"},{"name":"MAGDELINA","nickName":"MADGE"},{"name":"MARGARETTA","nickName":"MADGE"},{"name":"MADELINE","nickName":"MADIE"},{"name":"MADELYN","nickName":"MADIE"},{"name":"MADELINE","nickName":"MAGGIE"},{"name":"MAGDELINA","nickName":"MAGGIE"},{"name":"MARGARET","nickName":"MAGGIE"},{"name":"MARGARET","nickName":"MAGGY"},{"name":"AMANDA","nickName":"MANDY"},{"name":"MARGARET","nickName":"MARGE"},{"name":"MARGARETTA","nickName":"MARGE"},{"name":"MARGARET","nickName":"MARGIE"},{"name":"MARJORIE","nickName":"MARGIE"},{"name":"MARGARET","nickName":"MARGY"},{"name":"MARJORIE","nickName":"MARGY"},{"name":"MARCUS","nickName":"MARK"},{"name":"MARTIN","nickName":"MARTY"},{"name":"MARVIN","nickName":"MARV"},{"name":"MATHEW","nickName":"MATT"},{"name":"MATTHEW","nickName":"MATT"},{"name":"MADELINE","nickName":"MAUD"},{"name":"MELINDA","nickName":"MEL"},{"name":"MELISSA","nickName":"MEL"},{"name":"MERVIN","nickName":"MERV"},{"name":"MICHAEL","nickName":"MICK"},{"name":"MICHAEL","nickName":"MICKEY"},{"name":"MICHAEL","nickName":"MIKE"},{"name":"MELINDA","nickName":"MINDY"},{"name":"WILHELMINA","nickName":"MINNIE"},{"name":"MELISSA","nickName":"MISSY"},{"name":"MITCHELL","nickName":"MITCH"},{"name":"LAMONT","nickName":"MONTY"},{"name":"NATHANIEL","nickName":"NAT"},{"name":"NATHAN","nickName":"NATE"},{"name":"NATHANIEL","nickName":"NATE"},{"name":"JONATHAN","nickName":"NATHAN"},{"name":"CORNELIUS","nickName":"NEIL"},{"name":"NEWTON","nickName":"NEWT"},{"name":"NICHOLAS","nickName":"NICK"},{"name":"NICHOLAS","nickName":"NICKIE"},{"name":"ELEANOR","nickName":"NORA"},{"name":"LENORA","nickName":"NORA"},{"name":"OBEDIAH","nickName":"OBIE"},{"name":"OLIVER","nickName":"OLLIE"},{"name":"OSWALD","nickName":"OZZY"},{"name":"PATRICIA","nickName":"PAT"},{"name":"PATRICK","nickName":"PAT"},{"name":"PATRICIA","nickName":"PATSY"},{"name":"PATRICIA","nickName":"PATTY"},{"name":"MARGARET","nickName":"PEGGY"},{"name":"PENELOPE","nickName":"PENNY"},{"name":"PETER","nickName":"PETE"},{"name":"PHILIP","nickName":"PHIL"},{"name":"PHILLIP","nickName":"PHIL"},{"name":"PAULINA","nickName":"POLLY"},{"name":"PRISCILLA","nickName":"PRISSY"},{"name":"PRUDENCE","nickName":"PRUDY"},{"name":"RANDOLPH","nickName":"RANDY"},{"name":"RAYMOND","nickName":"RAY"},{"name":"REBECCA","nickName":"REBA"},{"name":"REGINALD","nickName":"REGGIE"},{"name":"IRENE","nickName":"RENA"},{"name":"ALDRICH","nickName":"RICH"},{"name":"RICHARD","nickName":"RICH"},{"name":"ALDRICH","nickName":"RICHIE"},{"name":"RICHARD","nickName":"RICHIE"},{"name":"DERICK","nickName":"RICK"},{"name":"RICARDO","nickName":"RICK"},{"name":"RICHARD","nickName":"RICK"},{"name":"BRODERICK","nickName":"RICKY"},{"name":"DERICK","nickName":"RICKY"},{"name":"RICHARD","nickName":"RICKY"},{"name":"ROBERT","nickName":"ROB"},{"name":"ROBERTO","nickName":"ROB"},{"name":"ROBERT","nickName":"ROBBY"},{"name":"BRODERICK","nickName":"ROD"},{"name":"AARON","nickName":"RON"},{"name":"RONALD","nickName":"RON"},{"name":"VERONICA","nickName":"RON"},{"name":"AARON","nickName":"RONNIE"},{"name":"RONALD","nickName":"RONNIE"},{"name":"VERONICA","nickName":"RONNIE"},{"name":"RONALD","nickName":"RONNY"},{"name":"VERONICA","nickName":"RONNY"},{"name":"ROSABEL","nickName":"ROSE"},{"name":"ROSABELLA","nickName":"ROSE"},{"name":"ROSALYN","nickName":"ROSE"},{"name":"ROSEANN","nickName":"ROSE"},{"name":"ROSEANNA","nickName":"ROSE"},{"name":"ROXANNA","nickName":"ROSE"},{"name":"ROXANNE","nickName":"ROSE"},{"name":"ROSABEL","nickName":"ROZ"},{"name":"ROSABELLA","nickName":"ROZ"},{"name":"ROSALYN","nickName":"ROZ"},{"name":"REUBEN","nickName":"RUBE"},{"name":"RUDOLPH","nickName":"RUDY"},{"name":"RUSSELL","nickName":"RUSS"},{"name":"RUSSELL","nickName":"RUSTY"},{"name":"SOLOMON","nickName":"SAL"},{"name":"SAMUEL","nickName":"SAM"},{"name":"SAMUEL","nickName":"SAMMY"},{"name":"CASSANDRA","nickName":"SANDRA"},{"name":"CASSANDRA","nickName":"SANDY"},{"name":"SANDRA","nickName":"SANDY"},{"name":"PRESCOTT","nickName":"SCOTT"},{"name":"PRESCOTT","nickName":"SCOTTY"},{"name":"MICHELLE","nickName":"SHELLY"},{"name":"RACHEL","nickName":"SHELLY"},{"name":"SHELTON","nickName":"SHELLY"},{"name":"SHIRLEY","nickName":"SHERRY"},{"name":"SYLVESTER","nickName":"SLY"},{"name":"ESTELLA","nickName":"STELLA"},{"name":"STEPHEN","nickName":"STEPH"},{"name":"STEVEN","nickName":"STEPH"},{"name":"STEPHEN","nickName":"STEVE"},{"name":"STEVEN","nickName":"STEVE"},{"name":"SUSAN","nickName":"SUE"},{"name":"SUSANNAH","nickName":"SUE"},{"name":"SULLIVAN","nickName":"SULLY"},{"name":"SUSAN","nickName":"SUSIE"},{"name":"SUSANNAH","nickName":"SUSIE"},{"name":"TABITHA","nickName":"TABBY"},{"name":"THEODORE","nickName":"TED"},{"name":"THEODORE","nickName":"TEDDY"},{"name":"TERENCE","nickName":"TERRY"},{"name":"TERESA","nickName":"TESS"},{"name":"THERESA","nickName":"TESS"},{"name":"TERESA","nickName":"TESSA"},{"name":"THERESA","nickName":"TESSA"},{"name":"TERESA","nickName":"TESSIE"},{"name":"THERESA","nickName":"TESSIE"},{"name":"THADDEUS","nickName":"THAD"},{"name":"THEODORE","nickName":"THEO"},{"name":"THOMAS","nickName":"THOM"},{"name":"MATILDA","nickName":"TILLA"},{"name":"TIMOTHY","nickName":"TIM"},{"name":"TIMOTHY","nickName":"TIMMY"},{"name":"AUGUSTINA","nickName":"TINA"},{"name":"CHRISTINA","nickName":"TINA"},{"name":"MARTINA","nickName":"TINA"},{"name":"LATISHA","nickName":"TISH"},{"name":"TISHA","nickName":"TISH"},{"name":"LATISHA","nickName":"TISHA"},{"name":"TOBIAS","nickName":"TOBY"},{"name":"THOM","nickName":"TOM"},{"name":"THOMAS","nickName":"TOM"},{"name":"THOM","nickName":"TOMMY"},{"name":"THOMAS","nickName":"TOMMY"},{"name":"ANTHONY","nickName":"TONY"},{"name":"SHELTON","nickName":"TONY"},{"name":"VICTORIA","nickName":"TORI"},{"name":"VICTORIA","nickName":"TORIE"},{"name":"VICTORIA","nickName":"TORRI"},{"name":"VICTORIA","nickName":"TORRIE"},{"name":"VICTORIA","nickName":"TORY"},{"name":"PATRICIA","nickName":"TRISHA"},{"name":"BEATRICE","nickName":"TRIXIE"},{"name":"GERTRUDE","nickName":"TRUDY"},{"name":"VALERI","nickName":"VAL"},{"name":"VALERIE","nickName":"VAL"},{"name":"SULLIVAN","nickName":"VAN"},{"name":"VANESSA","nickName":"VANNA"},{"name":"VICTOR","nickName":"VIC"},{"name":"VINCENT","nickName":"VIC"},{"name":"VINCENZON","nickName":"VIC"},{"name":"VICTORIA","nickName":"VICKI"},{"name":"VICTORIA","nickName":"VICKIE"},{"name":"VICTORIA","nickName":"VICKY"},{"name":"VINCENT","nickName":"VIN"},{"name":"VINCENZO","nickName":"VIN"},{"name":"VINCENT","nickName":"VINCE"},{"name":"VINSON","nickName":"VINCE"},{"name":"VINCENT","nickName":"VINNIE"},{"name":"VINCENZO","nickName":"VINNIE"},{"name":"OSWALD","nickName":"WALDO"},{"name":"GWENDOLYN","nickName":"WENDY"},{"name":"GILBERT","nickName":"WILBER"},{"name":"WILBUR","nickName":"WILL"},{"name":"WILLIAM","nickName":"WILL"},{"name":"WILSON","nickName":"WILL"},{"name":"WILBUR","nickName":"WILLIE"},{"name":"WILLIAM","nickName":"WILLIE"},{"name":"WILSON","nickName":"WILLIE"},{"name":"WILHELMINA","nickName":"WILMA"},{"name":"WINNIFRED","nickName":"WINNIE"},{"name":"WINNIFRED","nickName":"WINNY"},{"name":"ELWOOD","nickName":"WOODY"},{"name":"ZACHARIAH","nickName":"ZACH"}];

// on node insertion
document.addEventListener("animationstart", insertDivContent, false);

// insert styles into head
function insertStylesToHead() {
  // roboto webfont to html head
  var roboto = document.createElement("link");
  roboto.rel = "stylesheet";
  roboto.type = "text/css";
  roboto.href = "https://fonts.googleapis.com/css?family=Roboto:400,300,700";
  document.head.appendChild(roboto);

  // master style element to html head
  var style = document.createElement("style");
  var ratingCellStyle = ".ratingCell { font-family: Roboto; font-weight: 300; font-size: 0.8rem; color: #fff; background-color: #26a69a; border-radius: 2px; padding: 2px 6px; text-align: center !important; margin: 0 6px; } .errorCell { background-color: #DFDFDF !important; color: #9F9F9F !important; margin: 3px; } ";
  var toolTipStyle = ".cardContainer { display: none; margin: 0; position: absolute; right: 14.5%; } .cardContainer tr { border-style: hidden !important; } .card { line-height: 1.5; font-family: 'Roboto', sans-serif; font-weight: normal; width: 300px; overflow: hidden; margin: 0.5rem 0 1rem 0; background-color: #fff; border-radius: 2px; box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12); transition: box-shadow .25s; } .card .card-content { padding: 20px; border-radius: 0 0 2px 2px; color: rgba(0,0,0,0.54); } .card .card-content p { font-size: 14px; } .card .card-content .card-title { line-height: 28px; color: black; font-size: 24px; font-weight: 400; } .card .card-action { border-top: 1px solid rgba(160, 160, 160, 0.2); padding: 20px; } .card .card-action a { text-decoration: none; font-size: 14.5px; color: #ffab40 !important; margin-right: 20px; transition: color .3s ease; transition-property: color; transition-duration: 0.3s; transition-timing-function: ease; transition-delay: initial; text-transform: uppercase; } .card .card-action a:hover { color: #ffd8a6 !important; text-decoration: none; } a { text-decoration: none; background-color: transparent; } .profRating { font-size: 18px; font-weight: 700; } .card-content table { color: rgba(0,0,0,0.54); width: 100%; } .card-content table td { background-color: white !important; } #headRatingTable { margin-top: 20px; margin-bottom: 15px; text-align: center; height: 48px; } #headRatingTable td { width: 130px; } #headRatingLabel { font-size: 13px; line-height: 13px; } #headRating { font-size: 34px; line-height: 34px; } #subRatingTable { font-size: 14px; line-height: 26.67px; } #subRatingTable tr td:nth-child(1) { } #subRatingTable tr td:nth-child(3) { font-size: 18px; font-weight: 700; text-align: right; } td span.ratingCell, td div.cardContainer { font-style: normal; } .add-btn { float: right; margin-right: 0 !important; }";
  style.innerHTML = ratingCellStyle + toolTipStyle;
  document.head.appendChild(style);
}

if (document.readyState === "complete") {
  insertStylesToHead();

  // handle course pages
  if (window.location.href.indexOf("courseID") > -1) {
    console.log("attempting to insert");
    insertDivContent(null, true);
  }
};
