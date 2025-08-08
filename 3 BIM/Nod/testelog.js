const fs = require('fs');

fs.appendFile('log.txt', 'Nova entrada de log\n', (err) => {
    if (err) throw err;
    console.log('Entrada Salva!');
});