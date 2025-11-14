const input = document.querySelector("input");
const form = document.querySelector("form");
const div = document.querySelector("div");

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

const limit = 10;
let offset;
let search;

async function showPaginatedGifs() {
  showLoadingPopup("Pobieranie danych...");
  try {
    const resp = await fetch(
      `${API_URL}search?api_key=${API_KEY}&q=${encodeURIComponent(search)}&limit=${limit + 1}&offset=${offset}`,
    );
    if (resp.ok) {
      const data = await resp.json();
      // console.log(data);
      if (data.data.length === 0) {
        div.innerHTML = "Brak wyników";
      } else {
        div.innerHTML = "";
        data.data.slice(0, limit).forEach((gif) => {
          div.innerHTML += `<img src="${gif.images.original.url}" alt="${gif.title}" width="200"/>`;
        });
        div.innerHTML += `<div>
          <button id="prev" ${offset ? "" : "disabled"}>Poprzednia strona</button>
          <button id="next" ${data.data.length > limit ? "" : "disabled"}>Następna strona</button>
        </div>`;
        document.getElementById("prev").addEventListener("click", () => {
          offset = offset >= limit ? offset - limit : 0;
          showPaginatedGifs();
        });
        document.getElementById("next").addEventListener("click", () => {
          offset += limit;
          showPaginatedGifs();
        });
      }
    } else if (resp.status === 404) {
      div.innerHTML = "Brak wyników";
    } else {
      alert("Nie udało się pobrać danych z API.");
    }
  } catch (error) {
    alert(error?.message || "Nieznany błąd.");
  } finally {
    hideLoadingPopup();
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  search = input.value.trim();
  if (search === "") return alert("Wpisz frazę do wyszukania");

  offset = 0;
  showPaginatedGifs();
});

function showLoadingPopup(title) {
  const popup = document.createElement("div");
  popup.classList.add("loading-popup");
  popup.textContent = title;
  document.body.appendChild(popup);
}

function hideLoadingPopup() {
  const popup = document.querySelector(".loading-popup");
  if (popup) document.body.removeChild(popup);
}
