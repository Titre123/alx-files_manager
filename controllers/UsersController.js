import dbClient from '../utils/db';
import crypto from "crypto";
import redisClient from '../utils/redis';

class UsersController {

    static async postNew(req, res) {
        const body = req.body;
        if (!body.hasOwnProperty('email')) {
            res.status(400).send({'error': 'Missing email'});
        }
        if (!body.hasOwnProperty('password')) {
            res.status(400).send({'error': 'Missing password'});
        }
        const user = await dbClient.findUser({'email': body.email});
        if (user === null) {
            body.password = crypto.createHash('sha1').update(body.password).digest('hex');
            await dbClient.insertUser(body);
            const new_user = await dbClient.findUser({email: body.email})
            res.status(200).send({"id": new_user._id, "email": new_user.email});
        }
        else {
            res.status(400).send({'error': 'Already exist'});
        }
    }

    static async getMe(req, res) {
        const token = req.headers['X-Token'];
        const userId = await redisClient.get(`auth_${token}`)
        const user = await dbClient.findUser({id: userId});
        res.status(200).send({"id": user._id, "email": user.email});
    }
}

export default UsersController;
