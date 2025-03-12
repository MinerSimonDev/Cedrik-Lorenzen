function extractRecipeData() {
  // Zutaten aus JSON-LD extrahieren
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  let ingredients = [];
  for (let script of scripts) {
    try {
      const jsonData = JSON.parse(script.textContent);
      if (jsonData["@type"] === "Recipe") {
        ingredients = jsonData.recipeIngredient || [];
        break; // Bei erstem passenden Rezept abbrechen
      }
    } catch (error) {
      console.error("Error parsing JSON-LD data:", error);
    }
  }
  
  // Directions aus der neuen HTML-Struktur extrahieren
  let directions = "";
  // Suche nach dem Header "Directions" (unabhängig von Groß-/Kleinschreibung)
  const directionsHeader = Array.from(document.querySelectorAll('p.chakra-text'))
    .find(p => p.textContent.trim().toLowerCase() === 'directions');
    
  if (directionsHeader) {
    // Annahme: Der Container mit den Schritten ist das direkt folgende Element
    const container = directionsHeader.nextElementSibling;
    if (container) {
      // In diesem Container befinden sich die eigentlichen Schritt-Textpassagen
      const stepParagraphs = container.querySelectorAll('p.chakra-text.css-69rcb0');
      directions = Array.from(stepParagraphs)
        .map(p => p.textContent.trim())
        .join(" ");
    }
  } else {
    // Fallback: direkt in einem Container mit bekannter Klasse suchen
    const stepParagraphs = document.querySelectorAll('.chakra-stack.css-70kfd8 p.chakra-text.css-69rcb0');
    directions = Array.from(stepParagraphs)
      .map(p => p.textContent.trim())
      .join(" ");
  }
  
  return { ingredients, directions };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractRecipeData") {
    const recipeData = extractRecipeData();
    sendResponse(recipeData);
  }
});
