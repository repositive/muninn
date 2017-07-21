
export default function autocomplete ({pzrank, pzrange, zset}: {pzrank:any, pzrange:any, zset:string }) {
  return async function (payload: string) {
    const n = await pzrange(zset, 0, -1);

    const rank = await pzrank(zset, payload);
    const inc = 128;
    async function internal(start: number, end: number, acc: string[] = []): Promise<string[]> {
      if(start) {
        const nextPage = await pzrange(zset, start, end);
        const results = [
          ...acc,
          ...nextPage.filter((gd: string) => gd.startsWith(payload) && gd.charAt(gd.length -1) === '*')
                    .map((gd: string) => gd.substring(0, gd.length -1))
        ];
        const last = nextPage.pop();
        if (last && last.startsWith(payload)) {
          return internal(start + inc, end + inc, results);
        } else {
          return results;
        }
      } else {
        return [];
      }
    }
    return internal(rank, rank + inc);
  };
}
