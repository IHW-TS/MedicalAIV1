
require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.static('public'));

app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});

const request = require('request');

app.get('/diagnose', (req, res) => {
  const symptom = req.query.symptom;
  const options = {
    method: 'POST',
    url: 'https://healthservice.priaid.ch/diagnosis', 
    // Vous devez ajouter vos paramètres d'authentification ici
    headers: {
      'Authorization': 'Bearer VOTRE_TOKEN'
    },
    body: {
      'symptoms': `[${symptom}]`,
      'gender': 'male',
      'year_of_birth': '1984'
    },
    json: true
  };
  
  request(options, (error, response, body) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.send(body);
  });
});

const options = {
  method: 'POST',
  url: 'https://authservice.priaid.ch/login',
  auth: {
    user: process.env.API_USER,
    pass: process.env.API_PASS,
    sendImmediately: true
  }
};