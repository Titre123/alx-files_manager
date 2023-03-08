import dbClient from '../utils/db';
import crypto from "crypto";
import redisClient from '../utils/redis';

class UsersController {

    static postNew(req, res) {
        const body = req.body;
        if (!body.hasOwnProperty('email')) {
            res.status(400).send({'error': 'Missing email'});
        }
        if (!body.hasOwnProperty('password')) {
            res.status(400).send({'error': 'Missing password'});
        }
        const user = dbClient.findUser({'email': body.email});
        if (user != {} || user != undefined) {
            res.status(400).send({'error': 'Already exist'});
        }
        else {
            body.password = crypto.createHash('sha1').update(body.password).digest('hex');
            dbClient.insertUser(body);
            const new_user = dbClient.findUser({'email': body.email, 'password': body.password});
            res.status(200).send({"id": new_user.id, "email": new_user.email});
        }
    }

    static getMe(req, res) {
        const token = req.headers['X-Token'];
        const userId = redisClient.get(`auth_${token}`)
        const user = dbClient.findUser({id: userId});
        res.status(200).send({"id": user.id, "email": user.email});
    }
}

export default UsersController;
