import * as fs from 'fs';
import * as config from 'config';
import { createClient as redisClient } from 'redis';
import { get } from 'config';


function prefix(str: string, acc: string[] = []): string[] {
 if (str.length === 0) {
   return acc;
 } else {
   acc.push(str);
   return prefix(str.substring(0,str.length - 1),acc);
 }
}

const path = `${__dirname}/../gods.txt`;
const redisGods = redisClient();
fs.readFile(path, (err: Error, data: Buffer) => {
  if (err) throw err;
  const list = data.toString().split('\n').reduce(
    (acc, word) => {
      const ngrams = prefix(word).reduce( (ng, ngram) => ({...ng, [ngram]: true}), {});
      return {...acc, ...ngrams, [`${word}*`]: true};
    },
    {}
  );
  redisGods.on('error', function (error) {
    console.log(error);
  });

  // redisGods.del('gods');
  Object.keys(list).forEach( (god) => {
     redisGods.zadd('gods', 0, god.toString());
  });
});
