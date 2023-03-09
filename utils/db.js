const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    this.DB_HOST = process.env.DB_HOST || 'localhost';
    this.DB_PORT = process.env.DB_PORT || 27017;
    this.DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
    this.client = new MongoClient('mongodb+srv://Tiazzy:Tiazzy123@cluster0.qxccq75.mongodb.net/test', { useUnifiedTopology: true });
    this.connected = false;
    this.client.connect().then((conn) => {
      this.connected = true;
      this.db = conn.db(this.DB_DATABASE);
    }, (err) => {
      console.log(err);
    });
  }

  isAlive() {
    return this.connected;
  }

  async nbUsers() {
    if (this.isAlive() === true) {
      const collection = this.db.collection('users');
      const data = await collection.countDocuments();
      return data;
    }
    return null;
  }

  async nbFiles() {
    if (this.isAlive() === true) {
      const collection = this.db.collection('files');
      const data = await collection.countDocuments();
      return data;
    }
    return null;
  }

  async findUser(query) {
    if (this.isAlive() === true) {
      const collection = this.db.collection('users');
      const data = await collection.findOne(query);
      return data;
    }
    return null;
  }

  async insertUser(user) {
    if (this.isAlive() === true) {
      const collection = this.db.collection('users');
      const data = await collection.insertOne(user);
      return data;
    }
    return null;
  }
}

const dbClient = new DBClient();
export default dbClient;
