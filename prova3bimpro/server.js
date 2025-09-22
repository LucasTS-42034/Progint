const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());

const readData = async () => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeData = async (data) => {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
};


app.post('/items', async (req, res) => {
    try {
        const items = await readData();
        const newItem = {
            id: Date.now().toString(),
            ...req.body
        };
        items.push(newItem);
        await writeData(items);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/items', async (req, res) => {
    try {
        const items = await readData();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/items/:id', async (req, res) => {
    try {
        const items = await readData();
        const item = items.find(i => i.id === req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/items/:id', async (req, res) => {
    try {
        const items = await readData();
        const index = items.findIndex(i => i.id === req.params.id);
        if (index === -1) return res.status(404).json({ error: 'Item not found' });
        
        items[index] = { ...items[index], ...req.body };
        await writeData(items);
        res.json(items[index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/items/:id', async (req, res) => {
    try {
        const items = await readData();
        const filteredItems = items.filter(i => i.id !== req.params.id);
        if (items.length === filteredItems.length) {
            return res.status(404).json({ error: 'Item not found' });
        }
        await writeData(filteredItems);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});