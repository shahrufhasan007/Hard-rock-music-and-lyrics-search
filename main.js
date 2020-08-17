const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");

/// api URL ///
const apiURL = "https://api.lyrics.ovh";

/// adding event listeners

form.addEventListener("submit", (e) => {
    e.preventDefault();
    searchValue = search.value.trim();

    if (!searchValue) {
        alert("There is nothing to search");
    } else {
        searchSong(searchValue);
    }
});

//search songs
async function searchSong(searchValue) {
    const searchResult = await fetch(`${apiURL}/suggest/${searchValue}`);
    const data = await searchResult.json();

    showData(data);
}

//display results
function showData(data) {
    result.innerHTML = `
      ${data.data
        .map(
          (song) => `
            <div class="search-result col-md-8 mx-auto py-4">
              <div class="single-result row align-items-center my-3 p-3">
                  <div class="col-md-9">
                    <h3 class="lyrics-name">${song.title}</h3>
                    <p class="author lead">Album By ${song.artist.name}</p> 
                  </div>
              <div class="col-md-3 text-md-right text-center">
                    <span id="result" class="btn btn-success" data-artist="${song.artist.name}" 
                    data-songTitle="${song.title}">get lyrics</span>
              </div>
              </div>
            </div>`
        )
        .join("")}
  `;
}

//event listener to get lyrics button
result.addEventListener("click", (e) => {
  const clickedElement = e.target;

  //checking clicked element is button or not
  if (clickedElement.tagName === "SPAN") {
    const artist = clickedElement.getAttribute("data-artist");
    const songTitle = clickedElement.getAttribute("data-songTitle");

    getLyrics(artist, songTitle);
  }
});

// Get lyrics
async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();

  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");

  result.innerHTML = `<div class="single-lyrics text-center">
                        <h2 class="text-success mb-4">${artist} - ${songTitle}</h2>
                        <p class="lyric text-white">${lyrics}</p>
                      </div>`;
}