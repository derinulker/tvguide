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
								elemPElement.innerHTML = data[show].name;
								
                                elemDiv.appendChild (elemShowImage);
                                elemDiv.appendChild (elemPElement);
								elemMain.appendChild(elemDiv);
								
                              
                            }
                        }
        );

}



async function display_show_details(showId){

	url = "http://api.tvmaze.com/shows/" + showId + "?embed=cast";
	alert (url);


	var temp = document.getElementById("main");
	temp.remove();

	var elemDivBodyMiddle = document.getElementById ("body_bar_middle");
	var elemMain = document.createElement ("div");
	elemMain.classList.add ( "show_details_container");
	elemMain.setAttribute ( "ID",  "main");
	elemDivBodyMiddle.appendChild (elemMain);


	var elemShowDetailsBar = document.createElement ("div");
	elemShowDetailsBar.classList.add ("item_show_details_bar");
	
	elemMain.appendChild (elemShowDetailsBar);
	

	var elemDivTabButton1 = document.createElement ("div");
	elemDivTabButton1.classList.add ("tab_button");
	var buttont1 = document.createElement ("button");
	buttont1.classList.add ("t_button");
	buttont1.classList.add ("w3-red");
	buttont1.setAttribute ("onclick", "openTab(event,'first-tab');");
	buttont1.innerHTML = "Main info";
	elemDivTabButton1.appendChild (buttont1);
	elemShowDetailsBar.appendChild (elemDivTabButton1);

	var elemDivTabButton2 = document.createElement ("div");
	elemDivTabButton2.classList.add ("tab_button");
	var buttont2 = document.createElement ("button");
	buttont2.classList.add ("t_button");
	buttont2.setAttribute ("onclick", "openTab(event,'second-tab');");
	buttont2.innerHTML = "Episodes";
	elemDivTabButton2.appendChild (buttont2);
	elemShowDetailsBar.appendChild (elemDivTabButton2);

	var elemDivTabButton3 = document.createElement ("div");
	elemDivTabButton3.classList.add ("tab_button");
	var buttont3 = document.createElement ("button");
	buttont3.classList.add ("t_button");
	buttont3.setAttribute ("onclick", "openTab(event,'third-tab');");
	buttont3.innerHTML = "Cast";
	elemDivTabButton3.appendChild (buttont3);
	elemShowDetailsBar.appendChild (elemDivTabButton3);

	var elemDivTabButton4 = document.createElement ("div");
	elemDivTabButton4.classList.add ("tab_button");
	var buttont4 = document.createElement ("button");
	buttont4.classList.add ("t_button");
	buttont4.setAttribute ("onclick", "openTab(event,'forth-tab');");
	buttont4.innerHTML = "Crew";
	elemDivTabButton4.appendChild (buttont4);
	elemShowDetailsBar.appendChild (elemDivTabButton4);

	var elemDivTabButton5 = document.createElement ("div");
	elemDivTabButton5.classList.add ("tab_button");
	var buttont5 = document.createElement ("button");
	buttont5.classList.add ("t_button");
	buttont5.setAttribute ("onclick", "openTab(event,'fifth-tab');");
	buttont5.innerHTML = "Further Images";
	elemDivTabButton5.appendChild (buttont5);
	elemShowDetailsBar.appendChild (elemDivTabButton5);
	

	var elemDivtabBodyT1 = document.createElement ("div");
	elemDivtabBodyT1.classList.add ("item_show_details_body");
	elemDivtabBodyT1.setAttribute ("id", "first-tab");
	elemDivtabBodyT1.style.display = "";
	var elemDivTabBodyLeftT1 = document.createElement ("div");
	elemDivTabBodyLeftT1.classList.add ("item_tab_body_left");

	var elemDivTabBodyMiddleT1 = document.createElement ("div");
	elemDivTabBodyMiddleT1.classList.add ("item_tab_body_middle");

	var elemDivTabBodyRightT1 = document.createElement ("div");
	elemDivTabBodyRightT1.classList.add ("item_tab_body_right");

	elemDivtabBodyT1.appendChild (elemDivTabBodyLeftT1);
	elemDivtabBodyT1.appendChild (elemDivTabBodyMiddleT1);
	elemDivtabBodyT1.appendChild (elemDivTabBodyRightT1);

	var elemDivtabBodyT2 = document.createElement ("div");
	elemDivtabBodyT2.classList.add ("item_show_details_body");
	elemDivtabBodyT2.setAttribute ("id", "second-tab");
	elemDivtabBodyT2.style.display = "none";
	var elemDivTabBodyLeftT2 = document.createElement ("div");
	elemDivTabBodyLeftT2.classList.add ("item_tab_body_left");
	elemDivTabBodyLeftT2.innerHTML = "LEFT2";
	var elemDivTabBodyMiddleT2 = document.createElement ("div");
	elemDivTabBodyMiddleT2.classList.add ("item_tab_body_middle");
	elemDivTabBodyMiddleT2.innerHTML = "MIDDLE2";
	var elemDivTabBodyRightT2 = document.createElement ("div");
	elemDivTabBodyRightT2.classList.add ("item_tab_body_right");
	elemDivTabBodyRightT2.innerHTML = "RIGHT2";
	elemDivtabBodyT2.appendChild (elemDivTabBodyLeftT2);
	elemDivtabBodyT2.appendChild (elemDivTabBodyMiddleT2);
	elemDivtabBodyT2.appendChild (elemDivTabBodyRightT2);

	
	var elemDivtabBodyT3 = document.createElement ("div");
	elemDivtabBodyT3.classList.add ("item_show_details_body");
	elemDivtabBodyT3.setAttribute ("id", "third-tab");
	elemDivtabBodyT3.style.display = "none";
	var elemDivTabBodyLeftT3 = document.createElement ("div");
	elemDivTabBodyLeftT3.classList.add ("item_tab_body_left");
	elemDivTabBodyLeftT3.innerHTML = "LEFT3";
	var elemDivTabBodyMiddleT3 = document.createElement ("div");
	elemDivTabBodyMiddleT3.classList.add ("item_tab_body_middle");
	elemDivTabBodyMiddleT3.innerHTML = "MIDDLE3";
	var elemDivTabBodyRightT3 = document.createElement ("div");
	elemDivTabBodyRightT3.classList.add ("item_tab_body_right");
	elemDivTabBodyRightT3.innerHTML = "RIGHT3";
	elemDivtabBodyT3.appendChild (elemDivTabBodyLeftT3);
	elemDivtabBodyT3.appendChild (elemDivTabBodyMiddleT3);
	elemDivtabBodyT3.appendChild (elemDivTabBodyRightT3);


	var elemDivtabBodyT4 = document.createElement ("div");
	elemDivtabBodyT4.classList.add ("item_show_details_body");
	elemDivtabBodyT4.setAttribute ("id", "forth-tab");
	elemDivtabBodyT4.style.display = "none";
	var elemDivTabBodyLeftT4 = document.createElement ("div");
	elemDivTabBodyLeftT4.classList.add ("item_tab_body_left");
	elemDivTabBodyLeftT4.innerHTML = "LEFT4";
	var elemDivTabBodyMiddleT4 = document.createElement ("div");
	elemDivTabBodyMiddleT4.classList.add ("item_tab_body_middle");
	elemDivTabBodyMiddleT4.innerHTML = "MIDDLE4";
	var elemDivTabBodyRightT4 = document.createElement ("div");
	elemDivTabBodyRightT4.classList.add ("item_tab_body_right");
	elemDivTabBodyRightT4.innerHTML = "RIGHT4";
	elemDivtabBodyT4.appendChild (elemDivTabBodyLeftT4);
	elemDivtabBodyT4.appendChild (elemDivTabBodyMiddleT4);
	elemDivtabBodyT4.appendChild (elemDivTabBodyRightT4);


	var elemDivtabBodyT5 = document.createElement ("div");
	elemDivtabBodyT5.classList.add ("item_show_details_body");
	elemDivtabBodyT5.setAttribute ("id", "fifth-tab");
	elemDivtabBodyT5.style.display = "none";
	var elemDivTabBodyLeftT5 = document.createElement ("div");
	elemDivTabBodyLeftT5.classList.add ("item_tab_body_left");
	elemDivTabBodyLeftT5.innerHTML = "LEFT5";
	var elemDivTabBodyMiddleT5 = document.createElement ("div");
	elemDivTabBodyMiddleT5.classList.add ("item_tab_body_middle");
	elemDivTabBodyMiddleT5.innerHTML = "MIDDLE5";
	var elemDivTabBodyRightT5 = document.createElement ("div");
	elemDivTabBodyRightT5.classList.add ("item_tab_body_right");
	elemDivTabBodyRightT5.innerHTML = "RIGHT5";
	elemDivtabBodyT5.appendChild (elemDivTabBodyLeftT5);
	elemDivtabBodyT5.appendChild (elemDivTabBodyMiddleT5);
	elemDivtabBodyT5.appendChild (elemDivTabBodyRightT5);


	elemMain.appendChild (elemDivtabBodyT1);
	elemMain.appendChild (elemDivtabBodyT2);
	elemMain.appendChild (elemDivtabBodyT3);
	elemMain.appendChild (elemDivtabBodyT4);
	elemMain.appendChild (elemDivtabBodyT5);
	







	let response = await fetch(url);
	let show = await response.json();
	
	var elemImage = document.createElement ("img");
	elemImage.src = show.image.medium;
	elemImage.alt = "IMAGE of SHOW";

	
	elemDivTabBodyLeftT1.appendChild (elemImage);
	var tab1_summary = document.createElement ("div");

	tab1_summary.innerHTML = show.summary; 
	elemDivTabBodyMiddleT1.appendChild (tab1_summary);
	var tab1_details = document.createElement ("div");
	tab1_details.innerHTML  = "<p><strong>Genre: </strong>"+ show.genres + "</p>";
	elemDivTabBodyRightT1.appendChild (tab1_details);



	







	console .log ("Show>>>>>>>>>>" + show.name);
	console .log ("Show> embedded>>>>>>>>>" + show._embedded.cast);
	for (i in show._embedded.cast) {
		console.log( show._embedded.cast[i].person.name);
		console.log( show._embedded.cast[i].character.name);

 	}	
}



function openTab(evt, tabName) {
	var i, x, tablinks;
	x = document.getElementsByClassName("item_show_details_body");
	for (i = 0; i < x.length; i++) {
	  x[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("t_button");
	for (i = 0; i < x.length; i++) {
	  tablinks[i].className = tablinks[i].className.replace("w3-red", "");
	}
	document.getElementById(tabName).style.display = "";
	evt.currentTarget.className += " w3-red";
  }




