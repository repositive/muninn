import * as test from 'tape';
import { Test } from 'tape';
import { stub } from 'sinon';
import init from '../service';
import updateIndex from './update';

test('Testing redis update of the indez', (t: Test) => {
  async function _test() {
    const pzrank = stub().returns(Promise.resolve(0));
    const pzadd =  stub().returns(Promise.resolve());

    const inc = 5;
    t.equals(typeof updateIndex, 'function', 'Module exports a function');
    const zset = 'gods';
    const value = 'Loki';
    const _updateIndex = updateIndex({pzrank, pzadd});

    t.equals(typeof _updateIndex, 'function', 'autocomplete returns a function');

    const updateResult = _updateIndex({value,zset});
    t.ok(updateResult instanceof Promise, 'updateIndex returns a promise');
    const res = await updateResult;
    t.equals(pzadd.callCount , value.length + 1, 'pzadd is called length + 1 times');

    const pzrankElse = stub().returns(Promise.resolve(1));
    const pzaddElse =  stub().returns(Promise.resolve());
    const _updateIndexElse = updateIndex({pzrank: pzrankElse, pzadd: pzaddElse});

    const updateResultElse = _updateIndexElse({value,zset});
    const resElse = await updateResultElse;
    t.equals(pzaddElse.callCount , 0, 'pzadd is never called times');

  }

  _test()
    .then(() => t.end())
    .catch(console.error);
});
