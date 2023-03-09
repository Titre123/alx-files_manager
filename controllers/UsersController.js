import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  // static function that servers as callback to the POST /users endpoint
  static async postNew(req, res) {
    const { body } = req;
    if (!Object.prototype.hasOwnProperty.call(body, 'email')) {
      return res.status(400).send({ error: 'Missing email' });
    }
    if (!Object.prototype.hasOwnProperty.call(body, 'password')) {
      return res.status(400).send({ error: 'Missing password' });
    }
    // query dbCLient for a user
    const user = await dbClient.findUser({ email: body.email });
    console.log(user);
    if (user === null || user === undefined) {
      body.password = sha1(body.password);
      //  insert new user into the database
      await dbClient.insertUser(body);
      //  query dbCLient for a user for the user added
      const newUser = await dbClient.findUser({ email: body.email });
      res.status(200).send({ id: newUser._id, email: newUser.email });
    } else {
      res.status(400).send({ error: 'Already exist' });
    }
  }

  //  static method to server as callback for /users/me endpoint
  static async getMe(req, res) {
    const token = req.get('X-Token');
    const userId = await redisClient.get(`auth_${token}`);
    const user = await dbClient.findUser({ _id: new ObjectId(userId) });
    if (user === null || user === undefined) {
      res.status(401).send({ error: 'Unauthorized' });
    } else {
      res.status(200).send({ id: user._id, email: user.email });
    }
  }
}

export default UsersController;
