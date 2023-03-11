import { ObjectId } from 'mongodb';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import { v4 as uuidv4 } from 'uuid';
import fs from "fs";

class FilesController {
  static async postUpload(req, res) {
    // access the form
    const body = res.body;
    // get the authentication token
    const token = req.get('X-Token');
    // get redis key in redis-server - userId
    const userId = await redisClient.get(`auth_${token}`);
    // get user using the userId
    const user = await dbClient.findUser({ _id: new ObjectId(userId) });
    // list of accepted file type
    const accepted = ["file", "folder", "image"]
    // check if body has elements
    if (!Object.prototype.hasOwnProperty.call(body, 'name')) {
      return res.status(400).send({ error: 'Missing name' });
    }
    if (!Object.prototype.hasOwnProperty.call(body, 'type') || accepted.includes(body.type) === false ) {
      return res.status(400).send({ error: 'Missing type' });
    }
    if (!Object.prototype.hasOwnProperty.call(body, 'data') && body.type !== 'folder') {
      return res.status(400).send({ error: 'Missing data' });
    }

    body.parentId = Object.prototype.hasOwnProperty.call(body, 'parentId') ? body.parentId : 0;
    // get the parent folder from the db
    const parent = dbClient.db.collection('files').findOne({_id: new ObjectId(body.parentId)});
    // check if parent exist in the database
    if (parent === null || parent === undefined) {
      return res.status(400).send({"error": "Parent not found"});
    }
    else if (parent.type !== 'folder') {
      return res.status(400).send({error: "Parent is not a folder"});
    }

    if (body.type === 'folder') {
      const fileObj = {userId: user._id, "name": body.name, "type": body.type, "isPublic": Object.prototype.hasOwnProperty(body, 'isPublic') ? body.isPublic : false, "parentId": new ObjectId(body.parentId)};
      const newFile = dbClient.db.collection('files').insertOne(fileObj);
      return res.status(201).send({"id": newFile._id, "userId": newFile.userId, "name": newFile.name, "file": newFile.name,
      "type": newFile.file, "isPublic": newFile.isPublic, "parentId": newFile.parentId});
    }
    else {
      const relative = process.env.FOLDER_PATH || '/tmp/files_manager';
      const filePath = uuidv4();
      let atob;
      if (typeof atob === 'undefined') {
        // define the atob() function using a polyfill
        atob = (str) => Buffer.from(str, 'base64').toString('binary');
      }
      const data = atob(body.data);
      const absolutePath = `${relative}/${filePath}`;
      let writer = fs.createWriteStream(absolutePath);
      writer.write(data);
      const fileObj = {userId: user._id, "name": body.name, "type": body.type, "isPublic": Object.prototype.hasOwnProperty(body, 'isPublic') ? body.isPublic : false, "parentId": 0, localPath: absolutePath};
      const newFile = dbClient.db.collection('files').insertOne(fileObj);
      res.status(201).send({"id": newFile._id, "userId": newFile.userId, "name": newFile.name, "file": newFile.name,
        "type": newFile.file, "isPublic": newFile.isPublic, "parentId": newFile.parentId});
    }
  }
}

export default FilesController;
