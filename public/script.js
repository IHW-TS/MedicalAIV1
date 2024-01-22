function getDiagnosis() {
    const symptom = document.getElementById('symptomInput').value;
    
    // Remplacez par l'adresse de votre serveur et le chemin de votre endpoint d'API
    fetch('http://localhost:3000/diagnose?symptom=' + symptom)
      .then(response => response.json())
      .then(data => {
        document.getElementById('result').innerText = JSON.stringify(data);
      })
      .catch(error => console.error('Erreur:', error));
  }
  