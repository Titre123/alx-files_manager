import dbClient from '../utils/db';
import crypto from "crypto";
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';

class AuthController {

    static getConnect(req, res) {
        const authHeader = req.headers['Authorization'];
        const data = authHeader.split(" ")[1]
        const decodedData = atob(data);
        const email = decodedData.split(':')[0];
        const password = (decodedData.split(':')[1]);
        const hashPass = crypto.createHash('sha1').update(password).digest('hex');
        const user = dbClient.findUser({email: email, password: hashPass});
        if (user == {} || user == undefined) {
            res.status(401).send({"error": "Unauthorized"});
        }
        const token = uuidv4();
        redisClient.set(`auth_${token}`, user.id, 86400);
        res.status(200).send({"token": token})
    }

    static getDisconnect(req, res) {
        const token = req.headers['X-Token'];
        const userId = redisClient.get(`auth_${token}`)
        const user = dbClient.findUser({id: userId});
        if (user == {} || user == undefined) {
            res.status(401).send({"error": "Unauthorized"});
        }
        redisClient.del(`auth_${token}`);
    }
}

export default AuthController;
