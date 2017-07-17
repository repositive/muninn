import irisSetup from '@repositive/iris';
import {LibOpts} from '@repositive/iris';
import * as config from 'config';
import autocomplete from './adds/titleAutocomplete';
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

  iris.register({pattern: 'status.muninn', async handler({payload}) {
    return {
      version: _pack.version
    };
  }});

  iris.register({pattern: 'db.dataset.autocomplete', async handler({payload}: {payload: {msg: string}}) {
    return autocomplete(payload.msg, iris.request);
  }});
}
