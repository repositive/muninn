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
  const redisGods = _createClient(<any>{url: config.get<string>('redis.gods') });
  const pzrank = _promisify(redisGods.zrank, {context: redisGods});
  const pzrange = _promisify(redisGods.zrange, {context: redisGods});
  const pzadd = _promisify(redisGods.zadd, {context: redisGods});

  return {
    name: 'redis',
    autocomplete: (zset: string) => redisAutocomplete({pzrank, pzrange, zset}),
    updateIndex: updateIndex({pzrank, pzadd})
  };
}
