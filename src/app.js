require('dotenv').config();
const express = require('express');
const request = require('request');
const CryptoJS = require('crypto-js');
const app = express();

app.use(express.static('public'));

app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});

function getAuthToken() {
  return new Promise((resolve, reject) => {
    const uri = "https://authservice.priaid.ch/login";
    const api_key = process.env.API_USER;
    const secret_key = process.env.API_PASS;
    const computedHash = CryptoJS.HmacMD5(uri, secret_key);
    const computedHashString = computedHash.toString(CryptoJS.enc.Base64);

    const options = {
      method: 'POST',
      url: uri,
      headers: {
        'Authorization': `Bearer ${api_key}:${computedHashString}`
      }
    };

    request(options, function (error, response, body) {
      if (error) {
        reject(new Error(error));
      } else if (response.statusCode !== 200) {
        reject(new Error('Invalid response status: ' + response.statusCode));
      } else {
        try {
          const parsedBody = JSON.parse(body);
          resolve(parsedBody.Token);
        } catch (e) {
          reject(new Error('Failed to parse response body'));
        }
      }
    });
  });
}

app.get('/diagnose', (req, res) => {
  getAuthToken().then(token => {
    const symptom = req.query.symptom;
    const options = {
      method: 'POST',
      url: 'https://healthservice.priaid.ch/diagnosis',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: {
        symptoms: `[${symptom}]`,
        gender: 'male',
        year_of_birth: 1984
      },
      json: true
    };

    request(options, (error, response, body) => {
      if (error) {
        console.error('Erreur lors de la requête:', error);
        return res.status(500).send('Erreur du serveur');
      }
      if (response.headers['content-type'].includes('application/json')) {
        res.send(body);
      } else {
        console.error('Réponse non-JSON reçue:', body);
        return res.status(500).send('Réponse non-JSON reçue');
      }
    });
  }).catch(error => {
    console.error('Erreur lors de l’obtention du token:', error.message);
    res.status(500).send('Erreur du serveur');
  });
});
