import irisSetup from '@repositive/iris';
import {LibOpts} from '@repositive/iris';
import * as config from 'config';
import {all} from 'bluebird';
import { compose, filterPayload } from './utils/compose';
import redisBackend from './auto-redis';

const pack = require('../package.json');

export default async function init({
  _config = config,
  _irisSetup = irisSetup,
  _pack = pack,
  _redisBackend = redisBackend
}: {
  _config?: typeof config,
  _irisSetup?: typeof irisSetup,
  _pack?: {version: string},
  _redisBackend?: typeof redisBackend
}): Promise<void> {
  const irisOpts = _config.get<LibOpts<any>>('iris');
  const iris = await _irisSetup(irisOpts);
  const backend = await _redisBackend({});
  iris.register({pattern: 'status.muninn', async handler({payload}) {
    return {version: _pack.version};
  }});

  iris.register({
    pattern: 'action.god.autocomplete',
    handler: compose( filterPayload, backend.autocomplete('gods'))
  });

  iris.register({
    pattern: 'action.disease.autocomplete',
    handler: compose( filterPayload, backend.autocomplete('disease'))
  });

  const datasetSet = [
    'disease',
    'assay'
  ];

  iris.register<any, any>({pattern: 'event.dataset.create', async handler({payload}) {
    if(payload && payload.properties && payload.properties.attributes) {
      return all(datasetSet.map( (zset) => {
          const property = payload.properties.attributes[zset];
          if( property ) {
            return all(property.map((value: string) => {
              return backend.updateIndex({zset, value});
            }));
          }
          return Promise.resolve({});
        }));
      }
    }
  });
}
