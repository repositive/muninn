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


    const  statusCall = _iris.register.getCall(0);
    const statusImp = statusCall.args[0].handler;
    t.equal(statusCall.args[0].pattern, 'status.muninn', 'The service exposes a status handle');

    const diseaseCall = _iris.register.getCall(3);
    const diseaseImp = diseaseCall.args[0].handler;
    t.equal(diseaseCall.args[0].pattern, 'action.disease.autocomplete', 'The service exposes a disease handle');
    const assayCall = _iris.register.getCall(4);
    t.equal(assayCall.args[0].pattern, 'action.assay.autocomplete', 'The service exposes a assay handle');
    const tissueCall = _iris.register.getCall(5);
    t.equal(tissueCall.args[0].pattern, 'action.tissue.autocomplete', 'The service exposes a tissue handle');
    const techCall = _iris.register.getCall(6);
    t.equal(techCall.args[0].pattern, 'action.technology.autocomplete', 'The service exposes a technology handle');
    const autoAllCall = _iris.register.getCall(7);
    const autoAllImp = autoAllCall.args[0].handler;
    t.equal(autoAllCall.args[0].pattern, 'action.autocomplete', 'The service exposes a update handle');

    const createCall = _iris.register.getCall(8);
    const createImp = createCall.args[0].handler;
    t.equal(createCall.args[0].pattern, 'event.dataset.create', 'The service exposes a update handle');


    const impResultStatus = statusImp({});
    t.ok(impResultStatus instanceof Promise, 'The implementation of status returns a promise');

    await impResultStatus
      .then((result: any) => {
        t.deepEqual(_pack, result, 'The implementation returns what we expect');
        t.ok(true, 'Implementation does not blow up');
      })
      .catch(() => {
        t.notOk(true, 'Implementation should not blow up');
      });

    const promiseImpDisease = diseaseImp({payload:'L'});
    t.ok(promiseImpDisease instanceof Promise, 'The implementation of disease.autocomplete returns a promise');

    const promiseAutoAll = autoAllImp({payload:'T'});
    t.ok(promiseAutoAll instanceof Promise, 'The implementation of action.autocomplete returns a promise');

    const promiseAutoAllNo = autoAllImp({});

    const properPayload = {payload:{'properties':{'attributes':{'disease': 'cancer'}}}};
    const noProper = {payload:{'properties':{'attributes':{'god': 'cancer'}}}};
    const noAtri = {payload:{'properties':{'disease': 'cancer'}}};
    const promiseCreate = createImp(properPayload);
    t.ok(promiseCreate instanceof Promise, 'The implementation of event.dataset.create returns a promise');
/*
    await promiseCreate().then( (results:any) => {
      t.ok(true, 'Create do not blow up with correct payload');
      console.log(results);
    }).catch ( (error: Error) => {
      console.log(error);
      t.notOk(true, 'Implementation with correct payload should not blow up');
    });
*/
    await createImp(noProper).then( (results:any) => {
      t.ok(true, 'Create do not blow up with no correct property in the payload');
      console.log(results);
    });
    await createImp(noAtri).then( (results:any) => {
      t.ok(true, 'Create do not blow up with no atribute field in the payload');
      console.log(results);
    });


  }
  _test()
    .then(() => t.end())
    .catch(console.error);
});
