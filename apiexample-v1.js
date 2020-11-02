var showCounter = 0;


// initialize variables after page loads
window.onload = function () {
	closeLightBox();

} // window.onload


// get data from TV Maze
function fetchData() {
	document.getElementById("main").innerHTML = "";

	var search = document.getElementById("search_input").value;

	fetch('http://api.tvmaze.com/search/shows?q=' + search)
		.then(response => response.json())
		.then(data => updatePage(data));
} // window.onload 


// change the activity displayed 
function updatePage(data) {
	console.log("Update page : ");
	console.log(data);
	

	var tvshow;
	for (tvshow in data) {

		createTVShow(data[tvshow]);
	} // for

} // updatePage

// returns a string of formatted genres
function showGenres(genres) {
	var g;
	var output = "";
	for (g in genres) {
		output += genres[g] + ", ";
	}

	return output;
} // showGenres

// constructs one TV show entry on homepage
function createTVShow(tvshowJSON) {

	var elemMain = document.getElementById("main");
	elemMain.classList.add("result_container"); // add a class to apply css

	var elemDiv_portrait = document.createElement("div");
	elemDiv_portrait.classList.add("portrait_container"); // add a class to apply css

	var elemImage = document.createElement("img");

	var elemDivSummary = document.createElement("div");
	elemDivSummary.classList.add("show_summary"); // add a class to apply css

	var elemDivInfo = document.createElement("div");
	elemDivInfo.classList.add("show_info"); // add a class to apply css

	var elemShowTitle = document.createElement("h2");
	elemShowTitle.classList.add("show_title"); // add a class to apply css

	var elemSummaryText = document.createElement("div");
	elemSummaryText.classList.add("summary_text"); // add a class to apply css


	var elemSummaryEpisode = document.createElement("div");
	elemSummaryEpisode.classList.add("episode_container"); // add a class to apply css

	var elemSummaryInfoTitle = document.createElement("h2");
	elemSummaryInfoTitle.classList.add("summary_info_title"); // add a class to apply css

	var elemNetwork = document.createElement("h5");
	var elemSchedule = document.createElement("h5");
	var elemGenre = document.createElement("h5");
	var elemRating = document.createElement("h5");
	var elemOfficialSite = document.createElement("h5");









	// add JSON data to elements
	try {
		elemImage.src = tvshowJSON.show.image.medium;
		elemImage.alt = "IMAGE_OF_SHOW"
	}
	catch (err) {
		elemImage.src = "no-img-portrait-text.png";
		elemImage.alt = "IMAGE_OF_SHOW"
	}

	elemShowTitle.innerHTML = tvshowJSON.show.name;

	try {
		elemNetwork.innerHTML = "Network: " + tvshowJSON.show.network.name ;
	}
	catch (err) {
		elemNetwork.innerHTML = "Network: " + "n/a" + "";
	}

	elemSchedule.innerHTML = "Schedule: " + tvshowJSON.show.schedule.days + " @" + tvshowJSON.show.schedule.time ;
	elemGenre.innerHTML = "Genre:  " + tvshowJSON.show.genres ;
	elemRating.innerHTML = "Raiting: " + tvshowJSON.show.rating.average ;

	try {
		elemOfficialSite.innerHTML = "Official Site:  <a href=\"" + tvshowJSON.show.officialSite + "\">" + tvshowJSON.show.officialSite ;
	} catch (error) {
		elemOfficialSite.innerHTML = "Official Site: n/a ";
	}
	
	
	
	elemSummaryInfoTitle.innerHTML = "What's it about? "

	try {
		elemSummaryText.innerHTML = tvshowJSON.show.summary;
	}
	catch (err) {
		elemSummaryText.innerHTML = "Unfortunately	there is not any summary info available yet !"
	}



	// add elements to the div tag
	elemDivInfo.appendChild(elemShowTitle);
	elemDivInfo.appendChild(elemNetwork);
	elemDivInfo.appendChild(elemSchedule);
	elemDivInfo.appendChild(elemGenre);
	elemDivInfo.appendChild(elemRating);
	elemDivInfo.appendChild(elemOfficialSite);


	elemDivSummary.appendChild(elemSummaryInfoTitle);
	elemDivSummary.appendChild(elemSummaryText);

	elemDiv_portrait.appendChild(elemImage);




	//get id of show and add episode list
	var showId = tvshowJSON.show.id;
	fetchEpisodes(showId, elemSummaryEpisode);
	elemDivSummary.appendChild(elemSummaryEpisode);



	elemMain.appendChild(elemDiv_portrait);
	elemMain.appendChild(elemDivSummary);
	elemMain.appendChild(elemDivInfo);








} // createTVShow

// fetch episodes for a given tv show id
function fetchEpisodes(showId, elemSummaryEpisode) {

	fetch('http://api.tvmaze.com/shows/' + showId + '/episodes')
		.then(response => response.json())
		.then(data => showEpisodes(data, elemSummaryEpisode));

} // fetch episodes


// show episodes
function showEpisodes(data, elemSummaryEpisode) {
	console.log("Episodes: ");
	console.log(data);


	var epsElemButton = document.createElement("button");
	epsElemButton.classList.add("collapsible"); //add a class to apply css
	epsElemButton.innerHTML = "EPISODES";
	epsElemButton.type = "button";
	epsElemButton.addEventListener("click", function () {
		this.classList.toggle("active");
		var content = this.nextElementSibling;
		if (content.style.display === "block") {
			content.style.display = "none";
		} else {
			content.style.display = "block";
		}
	});



	var elemDivCollapse = document.createElement("div");
	elemDivCollapse.classList.add("collapse_content"); // add a class to apply css

	var eps_id = "-9999";
	var eps_name = "n/a";
	var eps_season;
	var eps_number;
	var eps_summary = "n/a";
	var eps_img_url = "no-img-portrait-text.png";




	var output = "";
	for (episode in data) {

		try { eps_id = data[episode].id; } catch (error) { eps_id = -9999; }
		try { eps_name = str_replace(data[episode].name); } catch (error) { eps_name = "n/a"; }
		try { eps_season = data[episode].season; } catch (error) { eps_season = "n/a"; }
		try { eps_number = data[episode].number; } catch (error) { eps_number = "n/a"; }
		try { eps_summary = str_replace(data[episode].summary); } catch (error) { eps_summary = "n/a"; }
		try { eps_img_url = data[episode].image.medium; } catch (error) { eps_img_url = "no-img-portrait-text.png" }



		output += "<li><a href='javascript:showLightBox(`" + eps_id + "`,`" + eps_name + "`,`" + eps_season + "`,`" + eps_number + "`,`" + eps_summary + "`,`" + eps_img_url + "`)'> " + eps_name + "</a></li>";


	}
	output = "<ol>" + output + "</ol>";


	elemDivCollapse.innerHTML = output;

	elemSummaryEpisode.appendChild(epsElemButton);
	elemSummaryEpisode.appendChild(elemDivCollapse);





} // showEpisodes


function showLightBox(l_id, l_name, l_season, l_number, l_summary, l_img_url) {
	var elemLbTitle = document.createElement("h3");
	elemLbTitle.classList.add("lightbox_title"); // add a class to apply css

	var elemLbEpisodeSeason = document.createElement("h3");
	elemLbEpisodeSeason.classList.add("lightbox_episode_season"); // add a class to apply css

	var elemLbText = document.createElement("h3");
	elemLbText.classList.add("lightbox_text"); // add a class to apply css






	elemLbTitle.innerHTML = l_name;
	elemLbEpisodeSeason.innerHTML = " (Season: " + l_season + " / Episode number: " + l_number + ")";
	elemLbText.innerHTML = l_summary;

	document.getElementById("M_RIGHT").innerHTML = "";
	var elemLbRight = document.getElementById("M_RIGHT");




	document.getElementById("lightbox").style.display = "block";
	//document.getElementById("message").innerHTML = l_id + l_name + l_season + l_number + l_summary +"<img src=" + l_img_url + ">" + "</img>";  

	document.getElementById("M_LEFT").innerHTML = "<img src= " + l_img_url + "></img>";
	elemLbRight.appendChild(elemLbTitle);
	elemLbRight.appendChild(elemLbEpisodeSeason);
	elemLbRight.appendChild(elemLbText);


} // showLightBox

// close the lightbox
function closeLightBox() {
	document.getElementById("lightbox").style.display = "none";
} // closeLightBox 





function str_replace(s) {
	var t = "";
	t = s;
	t = t.replace(/'/g, "&rsquo;");
	t = t.replace(/"/g, "&quot;");

	return t;

}


function display_shows (){

       
    fetch('http://api.tvmaze.com/shows?page=1')
		.then(response => response.json())
        .then(function(data) {
          
            var show;
            var temp = document.getElementById("main");
			temp.remove();

			var elemDivBodyMiddle = document.getElementById ("body_bar_middle");

			
			var elemMain = document.createElement ("div");
			elemMain.classList.add ( "shows_container");
			elemMain.setAttribute ( "ID",  "main");
            elemDivBodyMiddle.appendChild (elemMain);
                       
                        for (show in data) 
                            {
                    
								                             
                                var elemDiv = document.createElement ("div");
                                var elemPElement = document.createElement ("p");

                                var elemShowImage = document.createElement("img");
                                elemShowImage.src = data[show].image.medium;
								elemShowImage.alt = "IMAGE_OF_SHOW";
								elemShowImage.setAttribute ("onclick", "display_show_details("+data[show].id+ ");");
								//elemShowImage.addEventListener ("click", display_show_details(data[show].id));
								//elemShowImage.onclick ="lllll";
								
                                elemPElement.innerHTML = data[show].name;

                                elemDiv.appendChild (elemShowImage);
                                elemDiv.appendChild (elemPElement);
								elemMain.appendChild(elemDiv);
								
                              
                                
    
                            }
                        }
        );

}



function display_show_details(showId){

	alert ("Details of the show");

}


