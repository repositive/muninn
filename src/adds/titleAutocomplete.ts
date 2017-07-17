import * as config from 'config';
import { createClient as redisClient } from 'redis';
import { get } from 'config';

const redisGods = redisClient(<any>{ url: get<string>('redis.gods') });

function pzrank(zset: string, msg:string) {
  return new Promise( (resolve, reject) => {
    redisGods.zrank('gods', msg, (error:Error, rank: number) => {
      resolve(rank);
    });
  });
}

function pzrange(zset:string, start: number, end: number) {
  return new Promise( (resolve, reject ) => {
    redisGods.zrange(zset, start , end, (error:Error, results:any) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export default async function autocomplete(msg: any, request: any) {
  const zset = 'gods';
  redisGods.on('Error on redisGods', function (err) {
    console.log(err);
  });

  return pzrank(zset, msg)
    .then( (rank:number) => pzrange(zset, rank, -1))
    .then( (results: string[]) => {
      return results.filter((gd: string) => gd.startsWith(msg) && gd.charAt(gd.length -1) === '*')
                    .map((gd: string) => gd.substring(0, gd.length -1));
    });
}
