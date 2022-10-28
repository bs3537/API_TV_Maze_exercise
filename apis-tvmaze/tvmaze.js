"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");
const input = $(".form-control");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm( /* term */) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let results = await axios.get(`http://api.tvmaze.com/search/shows?q=${input.val()}`);
  let shows = results.data.map(result => ({
    id: result.show.id,
    name: result.show.name,
    summary: result.show.summary,
    image: result.show.image ? result.show.image.medium : "https://tinyurl.com/tv-missing"
  }));
  return shows;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}" 
              alt="Show Image" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
async function getEpisodesOfShow(id) {
  let results = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  let episodes = results.data.map(result => ({
    id: result.id,
    name: result.name,
    season: result.season,
    number: result.number
  }));
  return episodes;
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  $episodesList.empty();
  for (let episode of episodes) {
    const $episode = $(
        `<li>${episode.name} (season ${episode.season}, number ${episode.number})</li>
      `);

    $episodesArea.append($episode);  }
}

/** Handle click on show name: get episodes and display them. */
const episodes_btn = $(".Show-getEpisodes");
$showsList.on("click", ".Show-getEpisodes", async function (evt) {
  const showId = $(evt.target).closest(".Show").data("show-id");
  const episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
  $episodesArea.show();
});

