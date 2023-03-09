import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AuthController {
  // static method that serves as callback for /connect endpoint
  static async getConnect(req, res) {
    //  get header Authentication
    const authHeader = req.get('Authorization');
    let atob;
    if (typeof atob === 'undefined') {
      // define the atob() function using a polyfill
      atob = (str) => Buffer.from(str, 'base64').toString('binary');
    }
    //  destructure authHeader
    const [authType, authCredentials] = authHeader.split(' ');
    if (authType === 'Basic') {
      const [email, password] = atob(authCredentials).split(':');
      console.log(email, password);
      //  hash passwrod
      const hashPass = sha1(password);
      // query dbClient for user
      const user = await dbClient.findUser({ email, password: hashPass });
      if (user === null || user === undefined) {
        res.status(401).send({ "error":"Unauthorized" });
      } else {
        const token = uuidv4();
        await redisClient.set(`auth_${token}`, user._id, 86400);
        res.status(200).send({ token });
      }
    }
  }

  // static method that serves as callback for /disconnect endpoint
  static async getDisconnect(req, res) {
    const token = req.get('X-Token');
    // get redis key in redis-server
    const userId = await redisClient.get(`auth_${token}`);
    const user = await dbClient.findUser({ _id: ObjectId(userId) });
    if (user === null || user === undefined) {
      res.status(401).send({ error: 'Unauthorized' });
    } else {
      await redisClient.del(`auth_${token}`);
    }
  }
}

export default AuthController;
