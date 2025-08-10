// Get ID from URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch("data.json")
  .then(res => res.json())
  .then(items => {
    const item = items.find(entry => entry.id === id);
    if (item) {
      document.getElementById("name").textContent = item.name;
      document.getElementById("description").textContent = item.description;
      document.getElementById("price").textContent = item.price;
    } else {
      document.querySelector(".container").innerHTML = "<h1>Item Not Found</h1>";
    }
  })
  .catch(err => {
    document.querySelector(".container").innerHTML = "<h1>Error loading data</h1>";
  });
