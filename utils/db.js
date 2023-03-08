const { MongoClient } = require('mongodb');

class DBClient {

  constructor () {
    this.DB_HOST = process.env.DB_HOST || 'localhost';
    this.DB_PORT = process.env.DB_PORT || 27017;
    this.DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
    this.client = new MongoClient( `mongodb://${this.DB_HOST}:${this.DB_HOST}`, { useUnifiedTopology: true } );
    this.connected = false
    this.client.connect().then((conn) => {
      this.connected = true;
      this.db = conn.db(this.DB_DATABASE);
    }, (err) => {
      console.log(err);
    })
  }

  isAlive() {
    return this.connected;
  }

  async nbUsers() {
    if (this.isAlive() == true) {
      const collection = this.db.collection("users");
      return await collection.countDocuments();
    }
  }

  async nbFiles() {
    if (this.isAlive() == true) {
      const collection = this.db.collection("files");
      return await collection.countDocuments();
    }
  }

  async findUser(query) {
    if(this.isAlive() == true) {
      const collection = this.db.collection("users");
      return await collection.findOne(query);
    }
  }

  async insertUser(user) {
    if(this.isAlive() == true) {
      const collection = this.db.collection("users");
      return await collection.insertOne(user);
    }
  }
}

const dbClient = new DBClient();
export default dbClient;