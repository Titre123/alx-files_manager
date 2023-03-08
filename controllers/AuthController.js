import dbClient from '../utils/db';
import crypto from "crypto";
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';

class AuthController {

    // static method that serves as callback for /connect endpoint
    static async getConnect(req, res) {
        //  get header Authentication
        const authHeader = req.get('Authorization');
        //  destructure authHeader
        const [authType, authCredentials] = authHeader.split(' ');
        if (authType === 'Basic') {
            const [email, password] = atob(authCredentials).split(':');
            //  hash passwrod
            const hashPass = crypto.createHash('sha1').update(password).digest('hex');
            // query dbClient for user
            const user = await dbClient.findUser({email: email, password: hashPass});
            if (user === null) {
                res.status(401).send({"error": "Unauthorized"});
            }
            else {
                const token = uuidv4();
                await redisClient.set(`auth_${token}`, user._id, 86400);
                res.status(200).send({"token": token})
            }
        }
    }

    // static method that serves as callback for /disconnect endpoint
    static async getDisconnect(req, res) {
        const token = req.headers['X-Token'];
        // get redis key in redis-server
        const userId = await redisClient.get(`auth_${token}`);
        const user = await dbClient.findUser({_id: userId});
        if (user === null) {
            res.status(401).send({"error": "Unauthorized"});
        }
        else {
            redisClient.del(`auth_${token}`);
        }
    }
}

export default AuthController;
