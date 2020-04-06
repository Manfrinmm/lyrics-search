const form = document.querySelector("#form");
const searchInput = document.querySelector("#search");
const songsContainer = document.querySelector("#songs-container");
const prevAndNextContainer = document.querySelector("#prev-and-next-container");

const apiURL = "https://api.lyrics.ovh";

const insertSongsToPage = (songsInfo) => {
  songsContainer.innerHTML = songsInfo
    .map(
      (song) => `
        <li class="song">
          <span class="song-artist"> <strong>${song.artist.name}</strong> - ${song.title} </span>
          <button class="btn" data-artist="${song.artist.name}" data-song-title="${song.title}"> Ver letra</button>
        </li>`
    )
    .join("");
};

const fetchSongs = async (term) => {
  songsContainer.innerHTML = `
    <li class='warning-message'>Buscando os dados.</>`;

  try {
    // const response = await fetch(`${apiURL}/suggest/${term}`);
    // const data = await response.json();
    const data = [
      {
        title: "Maquina de sexo",
        artist: {
          name: "Maria do bairro",
        },
      },
    ];

    insertSongsToPage(data);
  } catch (error) {
    console.log(error);
    return (songsContainer.innerHTML = `
      <li class='warning-message'>Falha ao buscar os dados.</>
    `);
  }
};

const onSubmit = (e) => {
  e.preventDefault();

  const searchTerm = searchInput.value.trim();

  // if (!searchTerm) {
  //   return (songsContainer.innerHTML =
  //     "<li class='warning-message'>Por favor, digite um termo válido.</>");
  // }

  fetchSongs(searchTerm);
};

form.addEventListener("submit", onSubmit);
