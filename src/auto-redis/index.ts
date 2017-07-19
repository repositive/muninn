import redisAutocomplete from './redis-autocomplete';
import updateIndex from './create-index';
import promisify from '../utils/promises';
import {createClient} from 'redis';
import * as config from 'config';

export default async function setupRedisAutocomplete({
  _promisify = promisify,
  _createClient = createClient
}:{
  _promisify?: typeof promisify,
  _createClient?: typeof createClient
}) {
  const redisGods = _createClient(<any>{url: config.get<string>('redis.gods') });
  const pzrank = _promisify(redisGods.zrank, redisGods);
  const pzrange = _promisify(redisGods.zrange, redisGods);
  const pzadd = _promisify(redisGods.zadd, redisGods);

  return {
    name: 'redis',
    autocomplete: (zset: string) => redisAutocomplete({pzrank, pzrange, zset}),
    updateIndex: updateIndex({pzrank, pzadd})
  };
}
