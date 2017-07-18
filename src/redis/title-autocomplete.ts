import * as config from 'config';


export default function autocomplete ({pzrank, pzrange}: {pzrank:any, pzrange:any}) {
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
