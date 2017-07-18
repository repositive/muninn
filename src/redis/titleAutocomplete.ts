import * as config from 'config';
import promisify from '../utils/promises';
import { get } from 'config';


export default function autocomplete (redis: any) {
  const pzrank = promisify(redis.zrank, redis);
  const pzrange = promisify(redis.zrange, redis);

  return async function (payload: string) {
    const zset = 'gods';
    return pzrank(zset, payload)
      .then( (rank:number) => pzrange(zset, rank, -1))
      .then( (results: string[]) => {
        return results.filter((gd: string) => gd.startsWith(payload) && gd.charAt(gd.length -1) === '*')
                      .map((gd: string) => gd.substring(0, gd.length -1));
      });
  };
}
