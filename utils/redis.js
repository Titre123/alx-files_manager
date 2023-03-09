import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (err) => {
      console.log(err);
    });
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.client.once('ready', () => {
        resolve();
      });

      this.client.once('error', (error) => {
        reject(error);
      });
    });
  }

  async isAlive() {
    if (this.client.connected === true) {
      return true;
    }
    try {
      await this.connect();
      return true;
    } catch (error) {
      console.error('Error connecting to Redis:', error);
      return false;
    }
  }

  async get(key) {
    if (await this.isAlive() === true) {
      const getProm = promisify(this.client.get).bind(this.client);
      const res = await getProm(key);
      return res;
    }
    return null;
  }

  async set(key, value, duration) {
    if (await this.isAlive() === true) {
      const setProm = promisify(this.client.setex).bind(this.client);
      await setProm(key, duration, value);
    }
    return null;
  }

  async del(key) {
    if (await this.isAlive() === true) {
      const delProm = promisify(this.client.del).bind(this.client);
      await (delProm(key));
    }
    return null;
  }
}

const redisClient = new RedisClient();

export default redisClient;