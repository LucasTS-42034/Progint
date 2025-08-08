const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Caminho para o arquivo JSON
const sampleDataPath = path.join(__dirname, '../Data/SampleData.json');

// Rota para obter os dados do arquivo JSON
router.get('/data', (req, res) => {
  fs.readFile(sampleDataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao ler o arquivo', error: err });
    }
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao processar os dados', error });
    }
  });
});

module.exports = router;
