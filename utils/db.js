import MongoClient from "mongodb";

class DBClient {

  constructor () {
    this.DB_HOST = process.env.DB_HOST || 'localhost',
    this.DB_PORT = process.env.DB_PORT || 27017,
    this.DB_DATABASE = process.env.DB_DATABASE || 'files_manager',
    this.client = new MongoClient( `mongodb://${this.DB_HOST}:${this.DB_HOST}` );
  }

  connect () {
    try {
    // Connect the client to the server (optional starting in v4.7)
      client.connect();
    // Establish and verify connection
      client.db("admin").command({ ping: 1 });
      console.log("Connected successfully to server");
    } catch (err) {
      throw new Error(err);
    } finally {
    // Ensures that the client will close when you finish/error
      client.close();
    }
  }

  isAlive() {
    try{
      this.connect();
      return true;
    }
    catch (err) {
      return false;
    }
  }

  async nbUsers() {
    if (this.isAlive() == true) {
      const collection = this.client.db(this.DB_DATABASE).collection("users");
      return await collection.countDocuments();
    }
  }

  async nbFiles() {
    if (this.isAlive() == true) {
      const collection = this.client.db(this.DB_DATABASE).collection("files");
      return await collection.countDocuments();
    }
  }
}

const dbClient = new DBClient();
export default dbClient;