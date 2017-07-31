import * as test from 'tape';
import { Test } from 'tape';
import { stub } from 'sinon';
import init from '../service';
import autocomplete from './autocomplete';

test('Testing autocompletion handler', (t: Test) => {
  async function _test() {
    const pzrank = stub().returns(Promise.resolve());
    const pzrange =  stub().returns(Promise.resolve(['T','Th', 'Tho', 'Thor', 'Thor*']));

    const inc = 5;
    t.equals(typeof autocomplete, 'function', 'Module exports a function');
    const zset = 'gods';
    const _autocomplete = autocomplete({pzrank, pzrange, zset});

    t.equals(typeof _autocomplete, 'function', 'Autocomplete returns a function');

    const autoResult = _autocomplete('').catch(err => {
      t.notOk(true, 'Autocomplete blow up on empty when it should not');
      console.error(err);
    });

    t.ok(autoResult instanceof Promise, 'Autocomplete returns a promise');
    t.deepEquals(await autoResult, {}, 'Should return empty object');

    const pzrankIn = stub().returns(Promise.resolve(1));
    const pzrangePage = stub().onFirstCall().returns(Promise.resolve(['T','Th', 'Tho', 'Thor', 'Thor*']))
                          .onSecondCall().returns(Promise.resolve([ 'L', 'Lo', 'Lok', 'Lok*']));
    const _autocompletePage = autocomplete({pzrank: pzrankIn, pzrange: pzrangePage, zset});

    const iterationRes = await _autocompletePage({'prefix':'T'}, 5).catch(err => {
      t.notOk(true, 'Paginated Autocomplete blow up when it should not');
      console.error(err);
    });

    t.deepEquals(iterationRes, ['Thor'], 'Should not return empty object');

  }

  _test()
    .then(() => t.end())
    .catch(console.error);
});
