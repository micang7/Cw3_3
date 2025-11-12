const button = document.querySelector("button");
const div = document.querySelector("div");

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

button.addEventListener("click", async (e) => {
  e.preventDefault();

  showLoadingPopup("Pobieranie danych...");

  try {
    const resp = await fetch(`${API_URL}random?api_key=${API_KEY}`);
    if (resp.ok) {
      const data = await resp.json();
      console.log(data);
      div.innerHTML = `<img src="${data.data.images.original.url}" alt="random gif"/>`;
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
