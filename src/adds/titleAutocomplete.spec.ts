import * as test from 'tape';
import { Test } from 'tape';
import { stub } from 'sinon';
import init from '../service';

test('Testing autocomplition by title service', (t: Test) => {
  async function _test() {

    const _iris = {request: stub().returns({}) as any, register: stub().returns(Promise.resolve()) as any};
    const _irisSetup = stub().returns(Promise.resolve(_iris));
    const irisConfig = {url: 'a', exchange: 'b', namespace: 'c'};
    const _config = { get: stub().returns(irisConfig) } as any;

    t.equals(typeof init, 'function', 'Service exports a function');

    const setupResult = init({ _irisSetup, _config});

    t.ok(setupResult instanceof Promise, 'Service setup must return a promise');

    await setupResult
      .then(() => {
        t.ok(true, 'Yeah, service setup does not blow up');
      })
      .catch(() => {
        t.notOk(true, 'Setup should not blow up at this point');
      });

    t.ok(_iris.register.called, 'Add from iris is called');

    const addCall = _iris.register.getCall(1);

    t.equal(addCall.args[0].pattern, 'db.dataset.autocomplete', 'The service exposes a status handle');

    const statusImp = addCall.args[0].handler;

    const impResultP = statusImp({payload: {msg: ''}});

    t.ok(impResultP instanceof Promise, 'The implementation of status returns a promise');

    await impResultP
      .then((result: any) => {
        t.deepEqual(result, {}, 'It returns the expected result');
        t.ok(true, 'Implementation does not blow up');
      })
      .catch((error: Error) => {
        console.error(error);
        t.notOk(true, 'Implementation should not blow up');
      });
  }

  _test()
    .then(() => t.end())
    .catch(console.error);
});
