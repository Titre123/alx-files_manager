import { ObjectId } from 'mongodb';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class FilesController {

    static async postUpload() {
        const token = req.get('X-Token');
        // get redis key in redis-server
        const userId = await redisClient.get(`auth_${token}`);
        const user = await dbClient.findUser({ _id: ObjectId(userId) });
    }
}

export default FilesController;