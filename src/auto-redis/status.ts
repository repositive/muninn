import {all} from 'bluebird';

export default function statusZsets({
  pzcard, pzkeys, pzrange
}: {
  pzcard:any,
  pzkeys:any,
  pzrange:any
}) {
  return async function () {
    const lists = await pzkeys('*');
    const res = await all(lists.map( async (zset:string) => {
      const length = await pzcard(zset);
      const words = await pzrange(zset, 0, -1);
      const filtered = words.filter( (word:string) =>
        word.charAt(word.length -1) === '*'
      );
      return {[zset]: {n_words: filtered.length,sizeOfset: length}};
    }));
    return Object.assign.apply({}, res);
  };
}
