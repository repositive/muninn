import irisSetup from '@repositive/iris';
import {LibOpts} from '@repositive/iris';
import * as config from 'config';
import autocomplete from './redis/titleAutocomplete';
import { createClient as redisClient } from 'redis';
import { compose, filterPayload } from './utils/compose';
const pack = require('../package.json');


export default async function init({
  _config = config,
  _irisSetup = irisSetup,
  _pack = pack
}: {
  _config?: typeof config,
  _irisSetup?: typeof irisSetup,
  _pack?: {version: string}
}): Promise<void> {
  const irisOpts = _config.get<LibOpts<any>>('iris');
  const iris = await _irisSetup(irisOpts);

  const redisGods = redisClient(<any>{ url: _config.get<string>('redis.gods') });
  iris.register({pattern: 'db.dataset.autocomplete', handler: compose( filterPayload, autocomplete(redisGods))});

  //Status
  iris.register({pattern: 'status.muninn', async handler({payload}) {
    return {version: _pack.version};
  }});
}
