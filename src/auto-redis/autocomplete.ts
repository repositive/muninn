
export default function autocomplete ({pzrank, pzrange, zset}: {pzrank:any, pzrange:any, zset:string }) {
  return async function (payload: any, inc = 128) {
    const prefix = payload.payload.prefix;
    const limit = (payload.payload.limit) ? payload.payload.limit:-1;
    const rank = await pzrank(zset, prefix);
    async function internal(start: number, end: number, acc: string[] = []): Promise<string[]> {
      if(start) {
        const nextPage = await pzrange(zset, start, end);
        const results = [
          ...acc,
          ...nextPage.filter((gd: string) => gd.startsWith(prefix) && gd.charAt(gd.length -1) === '*')
                    .map((gd: string) => gd.substring(0, gd.length -1))
        ];
        const last = nextPage.pop();
        console.log(`Autocomplete ${limit} words by ${results.length} `);
        if (last && last.startsWith(prefix) && results.length < limit) {
          return internal(start + inc, end + inc, results);
        } else {
          results.length = (limit < results.length) ? limit: results.length;
          return results;
        }
      } else {
        return [];
      }
    }
    return internal(rank, rank + inc);
  };
}
