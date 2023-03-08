import redisClient from '../utils/redis';
import dbClient from '../utils/db';


class AppController {

    // get status
    static getStatus(req, res) {
        res.status(200).send({ "redis": redisClient.isAlive(), "db": dbClient.isAlive() });
    }

    // get stats of database
    static async getStats(req, res) {
        const users = await dbClient.nbUsers();
        const files = await dbClient.nbFiles();
        res.status(200).send({"users": users, "files": files});
    }
}

export default AppController;