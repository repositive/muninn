import * as test from 'tape';
import { Test } from 'tape';
import { stub } from 'sinon';
import init from '../service';
import autocomplete from './redis-autocomplete';

test('Testing autocomplition by title service', (t: Test) => {
  async function _test() {
    const pzrank = stub().returns(Promise.resolve(0));
    const pzrange = stub().returns(Promise.resolve([]));

    t.equals(typeof autocomplete, 'function', 'Module exports a function');
    const zset = 'gods';
    const _autocomplete = autocomplete({pzrank, pzrange, zset});

    t.equals(typeof _autocomplete, 'function', 'autocomplete returns a function');

    const autoResult = _autocomplete('').catch(err => {
      t.notOk(true, 'autocomplete blow up when it should not');
      console.error(err);
    });

    t.ok(autoResult instanceof Promise, 'autocomplete returns a promise');

  }

  _test()
    .then(() => t.end())
    .catch(console.error);
});
