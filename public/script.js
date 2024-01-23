function getDiagnosis() {
  const symptomElement = document.getElementById('symptomInput');
  const resultElement = document.getElementById('result');
  const symptom = symptomElement.value;

  // Vérifiez si le champ des symptômes n'est pas vide
  if (!symptom.trim()) {
    resultElement.innerText = 'Veuillez entrer un symptôme.';
    return;
  }

  // Montrez un indicateur de chargement
  resultElement.innerText = 'Chargement...';

  // Encodez le symptôme pour la requête URL
  const encodedSymptom = encodeURIComponent(symptom);
  
  fetch('http://localhost:3000/diagnose?symptom=' + encodedSymptom)
    .then(response => {
      if (!response.ok) {
        throw new Error('Problème de réponse du réseau');
      }
      return response.json();
    })
    .then(data => {
      // Affichez les données de diagnostic
      resultElement.innerText = JSON.stringify(data, null, 2);
    })
    .catch(error => {
      // Affichez les erreurs à l'utilisateur
      console.error('Erreur:', error);
      resultElement.innerText = 'Erreur: ' + error.message;
    });
}
