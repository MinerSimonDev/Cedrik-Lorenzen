document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "extractRecipeData" }, (response) => {
      const ingredientsDiv = document.getElementById('ingredients');
      const directionsDiv = document.getElementById('directions');
      
      if (response.ingredients && response.ingredients.length > 0) {
        const ingredientList = document.createElement('ul'); // Erstellen Sie eine Liste für die Zutaten
        response.ingredients.forEach((ingredient) => {
          const listItem = document.createElement('li'); // Erstellen Sie ein Listenelement für jede Zutat
          listItem.textContent = ingredient;
          ingredientList.appendChild(listItem); // Fügen Sie das Listenelement der Liste hinzu
        });
        ingredientsDiv.appendChild(ingredientList); // Fügen Sie die Zutatenliste dem Zutaten-Div hinzu
      } else {
        ingredientsDiv.textContent = 'No ingredients found.';
      }

      if (response.directions) {
        const directionsArray = response.directions.split(/(?<=\.)\s/); // Split directions by period followed by space
        directionsArray.forEach((direction) => {
          const p = document.createElement('p');
          p.textContent = direction;
          p.className = 'direction';
          directionsDiv.appendChild(p);
        });
      } else {
        directionsDiv.textContent = 'No directions found.';
      }
    });
  });
});
