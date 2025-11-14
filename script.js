const input = document.querySelector("input");
const form = document.querySelector("form");
const div = document.querySelector("div");

// const API_URL = process.env.VITE_API_URL;
// const API_KEY = process.env.VITE_API_KEY;

const API_URL = "https://api.giphy.com/v1/gifs/";
const API_KEY = "ULM22IvnB3y0kJhT7ek6TcQ3oLLETtnW";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const search = input.value.trim();
  if (search === "") return alert("Wpisz frazę do wyszukania");

  showLoadingPopup("Pobieranie danych...");

  try {
    const resp = await fetch(
      `${API_URL}search?api_key=${API_KEY}&q=${encodeURIComponent(search)}&limit=12`,
    );
    if (resp.ok) {
      const data = await resp.json();
      // console.log(data);
      div.innerHTML = data.data.length === 0 ? "Brak wyników" : "";
      data.data.forEach((gif) => {
        div.innerHTML += `<img src="${gif.images.original.url}" alt="${gif.title}" style="display:block"/>`;
      });
    } else if (resp.status === 404) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center">Brak wyników</td></tr>`;
    } else {
      alert("Nie udało się pobrać danych z API.");
    }
  } catch (error) {
    alert(error?.message || "Nieznany błąd.");
  } finally {
    hideLoadingPopup();
  }
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
