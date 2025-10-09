// redis.service.ts
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { config } from 'src/config/envConfig';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  async onModuleInit() {
    this.client = createClient({
      socket: {
        host: config.REDIS.REDIS_HOST,
        port: config.REDIS.REDIS_PORT,
      },
      password: config.REDIS.REDIS_PASSWORD,
    });

    this.client.on('error', (err) => console.error('Redis Client Error', err));

    await this.client.connect();
    const logging = new Logger();
    logging.log('✅ Redis connected');
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  // Redis bilan ishlash uchun helper metodlar
  async set(key: string, value: any, ttlMinute?: number) {
    const data = typeof value === 'string' ? value : JSON.stringify(value);

    if (ttlMinute) {
      const ttlSeconds = ttlMinute * 60;
      await this.client.set(key, data, { EX: ttlSeconds });
    } else {
      await this.client.set(key, data);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    if (!data) return null;

    if (data.startsWith('{') || data.startsWith('[')) {
      return JSON.parse(data) as T;
    }
    return data as unknown as T;
  }

  async del(key: string) {
    await this.client.del(key);
  }
}
