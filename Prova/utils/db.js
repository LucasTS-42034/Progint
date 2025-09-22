// src/utils/fileStorage.js
const fs = require('fs').promises;
const path = require('path');

class FileStorage {
    constructor(filename) {
        this.filePath = path.join(__dirname, '../data', filename);
    }

    async readData() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return []; // Retorna array vazio se arquivo não existir
        }
    }

    async writeData(data) {
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    }

    async findById(id) {
        const items = await this.readData();
        return items.find(item => item.id === id);
    }

    async save(item) {
        const items = await this.readData();
        items.push(item);
        await this.writeData(items);
        return item;
    }
}

module.exports = FileStorage;