import irisSetup from '@repositive/iris';
import {LibOpts} from '@repositive/iris';
import * as config from 'config';
import autocomplete from './redis/title-autocomplete';
import { createClient as redis } from 'redis';
import { compose, filterPayload } from './utils/compose';
import promisify from './utils/promises';
const pack = require('../package.json');

export default async function init({
  _config = config,
  _irisSetup = irisSetup,
  _pack = pack,
  _redis = redis,
  _promisify = promisify
}: {
  _config?: typeof config,
  _irisSetup?: typeof irisSetup,
  _pack?: {version: string},
  _redis?: typeof redis,
  _promisify?: typeof promisify
}): Promise<void> {
  const irisOpts = _config.get<LibOpts<any>>('iris');
  const iris = await _irisSetup(irisOpts);

  iris.register({pattern: 'status.muninn', async handler({payload}) {
    return {version: _pack.version};
  }});

  const redisGods = _redis(<any>{ url: _config.get<string>('redis.gods') });

  const pzrank = _promisify(redisGods.zrank, redisGods);
  const pzrange = _promisify(redisGods.zrange, redisGods);

  iris.register({pattern: 'db.dataset.autocomplete', handler: compose( filterPayload, autocomplete({pzrank, pzrange}))});

}
