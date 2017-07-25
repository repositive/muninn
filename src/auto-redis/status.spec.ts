import * as test from 'tape';
import { Test } from 'tape';
import { stub } from 'sinon';
import init from '../service';
import setStatus from './status';

test('Testing Status Handler', (t: Test) => {
  async function _test() {
    const sets = ['disease', 'gods'];
    const diseases = [];
    const gods = ['T','Th', 'Tho', 'Thor', 'Thor*', 'L', 'Lo', 'Lok', 'Lok*'];
    const pzkeys = stub().returns(Promise.resolve(sets));
    const pzrange = stub().onFirstCall().returns(Promise.resolve([]))
                          .onSecondCall().returns(Promise.resolve(gods));
    const pzcard = stub().onFirstCall().returns(Promise.resolve(diseases.length))
                         .onSecondCall().returns(Promise.resolve(gods.length));

    t.equals(typeof setStatus, 'function', 'Module exports a function');
    const zset = 'gods';
    const _setStatus = setStatus({pzcard, pzkeys, pzrange});

    t.equals(typeof _setStatus, 'function', 'status returns a function');

    const statusResult = _setStatus().catch(err => {
      t.notOk(true, 'autocomplete blow up when it should not');
      console.error(err);
    });

    const expectStatus = { [sets[0]]:{n_words: 0, sizeOfset: 0}, [sets[1]]:{n_words: 2, sizeOfset: 9}};

    t.ok(statusResult instanceof Promise, 'Status returns a promise');
    t.deepEquals(await statusResult, expectStatus, 'Status returns proper response');

  }

  _test()
    .then(() => t.end())
    .catch(console.error);
});
