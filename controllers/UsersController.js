import dbClient from '../utils/db';
import crypto from "crypto";

class UsersController {

    static async postNew(req, res) {
        const body = req.body;
        // if (!body.hasOwnProperty('email')) {
        //     res.status(400).send({'error': 'Missing email'});
        // }
        // if (!body.hasOwnProperty('password')) {
        //     res.status(400).send({'error': 'Missing password'});
        // }
        // const user = dbClient.findUser('email', body.email);
        // if (user) {
        //     res.status(400).send({'error': 'Already exist'});
        // }
        // body.password = crypto.createHash('sha1').update(body.password).digest('hex');
        // dbClient.insertUser(body);
        // const new_user = dbClient.findUser('email', body.email);
        // res.status(200).send({"id": new_user.id, "email": new_user.email})
        res.send(body);
    }
}

export default UsersController;