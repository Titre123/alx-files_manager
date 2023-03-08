import dbClient from '../utils/db';
import sha1 from "sha1";
import redisClient from '../utils/redis';

class UsersController {

    // static function that servers as callback to the POST /users endpoint
    static async postNew(req, res) {
        const body = req.body;
        if (!body.hasOwnProperty('email')) {
            res.status(400).send({'error': 'Missing email'});
        }
        if (!body.hasOwnProperty('password')) {
            res.status(400).send({'error': 'Missing password'});
        }
        // query dbCLient for a user
        const user = await dbClient.findUser({'email': body.email});
        if (user === null) {
            body.password = sha1(body.password);
            //  insert new user into the database
            await dbClient.insertUser(body);
            //  query dbCLient for a user for the user added
            const new_user = await dbClient.findUser({email: body.email})
            res.status(200).send({"id": new_user._id, "email": new_user.email});
        }
        else {
            res.status(400).send({'error': 'Already exist'});
        }
    }

    //  static method to server as callback for /users/me endpoint
    static async getMe(req, res) {
        const token = req.headers['X-Token'];
        const userId = await redisClient.get(`auth_${token}`)
        const user = await dbClient.findUser({id: userId});
        res.status(200).send({"id": user._id, "email": user.email});
    }
}

export default UsersController;
