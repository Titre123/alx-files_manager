import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  // get status
  static async getStatus(req, res) {
    res.status(200).send({ redis: await redisClient.isAlive(), db: dbClient.isAlive() });
  }

  // get stats of database
  static async getStats(req, res) {
    const users = await dbClient.nbUsers();
    const files = await dbClient.nbFiles();
    res.status(200).send({ users, files });
  }
}

export default AppController;
