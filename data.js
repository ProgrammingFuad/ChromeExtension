var profDB = {};

function makeXMLHttpRequest(url) {
    // make request
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, false);
    xmlhttp.send();

    if (xmlhttp.status === 200) {
      return xmlhttp.responseText;
    }
}

function scaleRating(rating) {
  console.log("rating: " + rating);
  console.log((parseFloat(rating)/5)*122.5);
  return (parseFloat(rating)/5)*122.5;
}

function addScaledRatings(json) {
  var scaled = {};

  // if NaN, set to lowest x value (5.5)
  scaled.helpfulness = isNaN(json.helpfulness) ? 5.5 : scaleRating(json.helpfulness);
  scaled.clarity = isNaN(json.clarity) ? 5.5 : scaleRating(json.clarity);
  scaled.easiness = isNaN(json.easiness) ? 5.5 : scaleRating(json.easiness);

  return scaled;
}

function scrapeProfInfo(link) {
  // send second request for actual profile
  var profileURL = "http://www.ratemyprofessors.com";
  var profileResponse = makeXMLHttpRequest(profileURL + link);

  // return error if bad request
  if ( profileResponse === 'undefined') {
    return { error: "bad profile request" };
  }

  // parse profile response for stats
  var parsingDiv = document.createElement('div');
  parsingDiv.innerHTML = profileResponse;

  var gradeElements = parsingDiv.getElementsByClassName('grade');
  var ratingElements = parsingDiv.querySelectorAll('div.faux-slides div.rating');

  // return error if couldn't find stats
  if ( gradeElements.length === 0 || ratingElements.length === 0){
    return { error: "Professor has not been rated" };
  }

  var overall = gradeElements[0].innerHTML;
  var average = gradeElements[1].innerHTML;
  var helpfulness = ratingElements[0].innerHTML;
  var clarity = ratingElements[1].innerHTML;
  var easiness = ratingElements[2].innerHTML;

  var profJSON = { overall: overall,
                   average: average,
                   helpfulness: helpfulness,
                   clarity: clarity,
                   easiness: easiness
                 };

  profJSON.scaled = addScaledRatings(profJSON);

  console.log(profJSON);
  return profJSON;
}

function searchForProf(prof) {
    console.log("prof: " + prof);

    // create request url
    var searchURL = "http://http://www.ratemyprofessors.com/search.jsp?queryBy=schoolId&schoolName=University+of+North+Dakota&schoolID=1358&query=";
    var query = prof.toLowerCase().replace(" ", "+");
    console.log("query: " + query);

    // make request
    var searchResponse = makeXMLHttpRequest(searchURL + query);

    // return error if bad request
    if ( searchResponse === 'undefined') {
      return "bad search request";
    }

    // parse searchResponse for link to profile
    var profileLinkStub = "/ShowRatings.jsp?tid=";
    var noResultsMsg = "Your search didn't return any results.";
    var link;

    // has link stub and doesn't have "didn't return any"
    if (searchResponse.indexOf(profileLinkStub) !== -1 && searchResponse.indexOf(noResultsMsg) === -1) {
      var templateIndex = searchResponse.indexOf(profileLinkStub);
      var linkStartIndex = searchResponse.indexOf(profileLinkStub, templateIndex+99);
      var linkEndIndex = searchResponse.indexOf('"', linkStartIndex);
      link = searchResponse.substring(linkStartIndex, linkEndIndex);
      console.log("temp index: " + templateIndex);
      console.log("start index: " + linkStartIndex);
      console.log("end index: " + linkEndIndex);
      console.log("link: " + link);

      return link;
    } else {
      return "Professor not found";
    }
}

function getProfJSON(request) {
      // search, will return json if error
      var linkToProfile = searchForProf(request.name);

      // check for error
      if (linkToProfile.indexOf("/ShowRatings") === -1) {
          return { error: linkToProfile };
      }

      console.log("link to profile: " + linkToProfile);
      var responseJSON = scrapeProfInfo(linkToProfile);
      responseJSON.link = linkToProfile;
      responseJSON.name = request.name;

      return responseJSON;
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // check if already stored
        var response = profDB.hasOwnProperty(request.name) ? profDB[request.name] : getProfJSON(request);

        // store response in DB?
        if (!profDB.hasOwnProperty(request.name) && !response.hasOwnProperty("error")) {
          profDB[request.name] = response;
        }

        console.log(profDB);

        sendResponse(response);
    }
);
