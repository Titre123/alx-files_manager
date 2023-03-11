import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { promisify } from 'util';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class FilesController {
  static async postUpload(req, res) {
    // access the form
    const { body } = req;
    // get the authentication token
    const token = req.get('X-Token');
    // get redis key in redis-server - userId
    const userId = await redisClient.get(`auth_${token}`);
    // get user using the userId
    const user = await dbClient.findUser({ _id: new ObjectId(userId) });
    if (user === null || user === undefined) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    // list of accepted file type
    const accepted = ['file', 'folder', 'image'];
    // check if body has elements
    if (!Object.prototype.hasOwnProperty.call(body, 'name')) {
      return res.status(400).send({ error: 'Missing name' });
    }
    if (!Object.prototype.hasOwnProperty.call(body, 'type') || accepted.includes(body.type) === false) {
      return res.status(400).send({ error: 'Missing type' });
    }
    if (!Object.prototype.hasOwnProperty.call(body, 'data') && body.type !== 'folder') {
      return res.status(400).send({ error: 'Missing data' });
    }

    // get the parent folder from the db
    const parent = await dbClient.findFile({ _id: new ObjectId(body.parentId) });
    // set body parentId
    body.parentId = Object.prototype.hasOwnProperty.call(body, 'parentId') ? body.parentId : 0;
    // check if parent exist in the database
    if (body.parentId && (parent === null || parent === undefined)) {
      return res.status(400).send({ error: 'Parent not found' });
    }
    if (body.parentId && parent.type !== 'folder') {
      return res.status(400).send({ error: 'Parent is not a folder' });
    }

    if (body.type === 'folder') {
      const fileObj = {
        userId: user._id, name: body.name, type: body.type, isPublic: Object.prototype.hasOwnProperty.call(body, 'isPublic') ? body.isPublic : false, parentId: body.parentId === 0 ? 0 : new ObjectId(body.parentId),
      };
      console.log(body.parentId);
      const response = await dbClient.insertFile(fileObj);
      const [newFile] = response.ops;
      return res.status(201).send({
        id: newFile._id,
        userId: newFile.userId,
        name: newFile.name,
        type: newFile.type,
        isPublic: newFile.isPublic,
        parentId: newFile.parentId,
      });
    }

    const relative = process.env.FOLDER_PATH || '/tmp/files_manager';
    const filePath = uuidv4();
    let atob;
    if (typeof atob === 'undefined') {
      // define the atob() function using a polyfill
      atob = (str) => Buffer.from(str, 'base64').toString('binary');
    }
    const data = atob(body.data);
    const absolutePath = `${relative}/${filePath}`;
    const writer = promisify(fs.writeFile);
    await writer(absolutePath, data);
    const fileObj = {
      userId: user._id, name: body.name, type: body.type, isPublic: Object.prototype.hasOwnProperty.call(body, 'isPublic') ? body.isPublic : false, parentId: body.parentId === 0 ? 0 : new ObjectId(body.parentId), localPath: absolutePath,
    };
    const response = await dbClient.insertFile(fileObj);
    const [newFile] = response.ops;
    res.status(201).send({
      id: newFile._id,
      userId: newFile.userId,
      name: newFile.name,
      type: newFile.type,
      isPublic: newFile.isPublic,
      parentId: newFile.parentId,
    });
    return null;
  }
}

export default FilesController;
