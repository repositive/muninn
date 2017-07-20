import redisAutocomplete from './autocomplete';
import updateIndex from './update';
import {promisify} from 'bluebird';
import {createClient} from 'redis';
import * as config from 'config';

export default async function setupRedisAutocomplete({
  _promisify = promisify,
  _createClient = createClient
}:{
  _promisify?: typeof promisify,
  _createClient?: typeof createClient
}) {
  const redisClient = _createClient(<any>{url: config.get<string>('redis.uri') });
  const pzrank = _promisify(redisClient.zrank, {context: redisClient});
  const pzrange = _promisify(redisClient.zrange, {context: redisClient});
  const pzadd = _promisify(redisClient.zadd, {context: redisClient});


  return {
    name: 'redis',
    autocomplete: (zset: string) => redisAutocomplete({pzrank, pzrange, zset}),
    updateIndex: updateIndex({pzrank, pzadd})
  };
}
