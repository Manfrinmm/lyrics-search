const form = document.querySelector("#form");
const searchInput = document.querySelector("#search");
const songsContainer = document.querySelector("#songs-container");
const prevAndNextContainer = document.querySelector("#prev-and-next-container");

const apiURL = "https://api.lyrics.ovh";
const corsHeroku = "https://cors-anywhere.herokuapp.com";

var lastRequestFatch = "";

const fetchData = async (
  url,
  options = {
    cache: true,
  }
) => {
  const response = await fetch(url);

  if (options.cache) {
    lastRequestFatch = url;
  }

  return await response.json();
};

const getMoreSongs = async (url) => {
  try {
    const data = await fetchData(`${corsHeroku}/${url}`);

    insertSongsToPage(data);
  } catch (error) {
    console.log(error);

    prevAndNextContainer.innerHTML = "";

    songsContainer.innerHTML = `
      <li class='warning-message'>Falha ao buscar os dados.</>
    `;
  }
};

const insertLyricsIntoPage = ({ songPreview, artist, songTitle, lyrics }) => {
  songsContainer.innerHTML = `
    <li class="lyrics-container song">
      <audio src="${songPreview}" controls></audio>
    </li>
    <li class="lyrics-container">
      <h2>${artist} - <strong>${songTitle}</strong></h2>

      <p class="lyrics">${
        lyrics || "Infelizmente não encontrei essa letra :C"
      }</p>
    </li>
  `;

  prevAndNextContainer.innerHTML = `
  <button class="btn" onClick="getMoreSongs('${lastRequestFatch}')"> Voltar </button>
`;
};

const fetchLyrics = async ({ artist, songTitle, songPreview }) => {
  const data = await fetchData(`${apiURL}/v1/${artist}/${songTitle}`, {
    cache: false,
  });

  const lyrics = data.lyrics
    ? data.lyrics.replace(/(\r\n|\r|\n)/g, "<br/>")
    : null;

  insertLyricsIntoPage({ artist, songTitle, songPreview, lyrics });
};

const insertPrevAndNextButtonsToPage = ({ prev, next }) => {
  return (prevAndNextContainer.innerHTML = `
    ${
      prev
        ? `<button class="btn" onClick="getMoreSongs('${prev}')">Anteriores</button>`
        : ""
    }
    ${
      next
        ? ` <button class="btn" onClick="getMoreSongs('${next}')" class="btn">Próximas</button> `
        : ""
    }`);
};

const insertSongsToPage = (songsInfo) => {
  songsContainer.innerHTML = songsInfo.data
    .map(
      (song) => `
        <li class="song">
          <span class="song-artist"> <strong>${song.artist.name}</strong> - ${song.title} </span>
          <button
            class="btn"
            data-artist="${song.artist.name}"
            data-song-title="${song.title}"
            data-song-preview="${song.preview}"
          >
           Ver letra
          </button>
        </li>`
    )
    .join("");

  if (songsInfo.prev || songsInfo.next) {
    insertPrevAndNextButtonsToPage(songsInfo);

    return;
  }

  prevAndNextContainer.innerHTML = "";
};

const fetchSongs = async (term) => {
  songsContainer.innerHTML = `
    <li class='warning-message'>Buscando os dados.</>`;

  try {
    const data = await fetchData(`${apiURL}/suggest/${term}`);

    insertSongsToPage(data);
  } catch (error) {
    console.log(error);
    return (songsContainer.innerHTML = `
      <li class='warning-message'>Falha ao buscar os dados.</>
    `);
  }
};

const handleFormSubmit = (e) => {
  e.preventDefault();

  prevAndNextContainer.innerHTML = "";

  const searchTerm = searchInput.value.trim();
  searchInput.value = "";
  searchInput.focus();

  if (!searchTerm) {
    return (songsContainer.innerHTML =
      "<li class='warning-message'>Por favor, digite um termo válido.</>");
  }

  fetchSongs(searchTerm);
};

form.addEventListener("submit", handleFormSubmit);

const handleSongsContainerClick = (event) => {
  const clickedElement = event.target;

  if (clickedElement.tagName === "BUTTON") {
    clickedElement.style.cursor = "wait";

    const artist = clickedElement.getAttribute("data-artist");
    const songTitle = clickedElement.getAttribute("data-song-title");
    const songPreview = clickedElement.getAttribute("data-song-preview");

    fetchLyrics({ artist, songTitle, songPreview }, clickedElement);
  }
};

songsContainer.addEventListener("click", handleSongsContainerClick);

const handlePrevAndNextContainerClicl = (event) => {
  const clickedElement = event.target;

  if (clickedElement.tagName === "BUTTON") {
    clickedElement.style.cursor = "wait";
  }
};

prevAndNextContainer.addEventListener("click", handlePrevAndNextContainerClicl);
