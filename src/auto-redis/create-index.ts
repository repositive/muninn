import * as fs from 'fs';
import * as config from 'config';
import { createClient as redisClient } from 'redis';
import { get } from 'config';
import promisify from '../utils/promises';
import {all} from 'bluebird';

function prefix(str: string, acc: string[] = []): string[] {
   if (str.length === 0) {
     return acc;
   } else {
     acc.push(str);
     return prefix(str.substring(0,str.length - 1),acc);
   }
  }


export default function updateIndex({
  pzrank, pzadd
}: {
  pzrank: any, pzadd: any
}) {
  return async function ({value, zset}:{value: string, zset: string}) {
    const rank = await pzrank(zset, value);
    if(!rank) {
      const list = prefix(value);
      await all(list.map( (d) => {
        return pzadd(zset, 0, d);
      }));
      const last = `${value}*`;
      await pzadd(zset, 0, `${value}*`);
    }
  };
}
