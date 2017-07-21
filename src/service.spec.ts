import * as test from 'tape';
import { Test } from 'tape';
import { stub } from 'sinon';
import init from './service';

test('Testing basic service', (t: Test) => {
  async function _test() {

    const _pack = {version: '1'};
    const _iris = {request: stub() as any, register: stub().returns(Promise.resolve()) as any};
    const _irisSetup = stub().returns(Promise.resolve(_iris));
    const irisConfig = {url: 'a', exchange: 'b', namespace: 'c'};
    const _config = { get: stub().returns(irisConfig) } as any;
    const autocomplete = stub();
    const updateIndex = stub();
    const _redisBackend = stub().returns(Promise.resolve({autocomplete, updateIndex}));
    const _promisify = stub().returns(Promise.resolve());

    t.equals(typeof init, 'function', 'Service exports a function');

    const setupResult = init({_pack, _irisSetup, _redisBackend});

    t.ok(setupResult instanceof Promise, 'Service setup must return a promise');

    await setupResult
      .then(() => {
        t.ok(true, 'Yeah, service setup does not blow up');
      })
      .catch(() => {
        t.notOk(true, 'Setup should not blow up at this point');
      });

    t.ok(_iris.register.called, 'Add from iris is called');


    let addCall = _iris.register.getCall(0);
    const statusImp = addCall.args[0].handler;
    t.equal(addCall.args[0].pattern, 'status.muninn', 'The service exposes a status handle');
    addCall = _iris.register.getCall(2);
    t.equal(addCall.args[0].pattern, 'action.disease.autocomplete', 'The service exposes a disease handle');
    addCall = _iris.register.getCall(3);
    t.equal(addCall.args[0].pattern, 'action.assay.autocomplete', 'The service exposes a assay handle');
    addCall = _iris.register.getCall(4);
    t.equal(addCall.args[0].pattern, 'action.tissue.autocomplete', 'The service exposes a tissue handle');
    addCall = _iris.register.getCall(5);
    t.equal(addCall.args[0].pattern, 'action.technology.autocomplete', 'The service exposes a technology handle');

    const impResultP = statusImp({});
    t.ok(impResultP instanceof Promise, 'The implementation of status returns a promise');

    await impResultP
      .then((result: any) => {
        t.deepEqual(_pack, result, 'The implementation returns what we expect');
        t.ok(true, 'Implementation does not blow up');
      })
      .catch(() => {
        t.notOk(true, 'Implementation should not blow up');
      });
  }

  _test()
    .then(() => t.end())
    .catch(console.error);
});
