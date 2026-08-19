const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/offline_db.json');

// Ensure data folder and offline_db.json file exist
const initStorage = () => {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    const initialData = {
      users: [],
      products: [],
      orders: [],
      community: [],
      reviews: []
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
  }
};

initStorage();

const readData = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading offline JSON database:', err);
    return { users: [], products: [], orders: [], community: [], reviews: [] };
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing offline JSON database:', err);
  }
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
};

const offlineDb = {
  getCollection: (collectionName) => {
    const db = readData();
    return db[collectionName] || [];
  },

  insert: (collectionName, document) => {
    const db = readData();
    if (!db[collectionName]) db[collectionName] = [];
    const docWithId = {
      _id: generateId(),
      ...document,
      createdAt: document.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db[collectionName].push(docWithId);
    writeData(db);
    return docWithId;
  },

  findOne: (collectionName, query) => {
    const items = offlineDb.getCollection(collectionName);
    return items.find(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  },

  findById: (collectionName, id) => {
    const items = offlineDb.getCollection(collectionName);
    return items.find(item => item._id.toString() === id.toString());
  },

  updateById: (collectionName, id, updateData) => {
    const db = readData();
    const items = db[collectionName] || [];
    const index = items.findIndex(item => item._id.toString() === id.toString());
    if (index !== -1) {
      items[index] = {
        ...items[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      writeData(db);
      return items[index];
    }
    return null;
  },

  deleteById: (collectionName, id) => {
    const db = readData();
    const items = db[collectionName] || [];
    const filtered = items.filter(item => item._id.toString() !== id.toString());
    db[collectionName] = filtered;
    writeData(db);
    return true;
  }
};

module.exports = offlineDb;
