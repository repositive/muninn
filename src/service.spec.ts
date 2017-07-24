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
    const autocomplete = stub().returns(Promise.resolve({}));
    const updateIndex = stub().returns(Promise.resolve({}));
    const statusReturn = {};
    const statusZsets = stub().returns(Promise.resolve(statusReturn));
    const _redisBackend = stub().returns(Promise.resolve({autocomplete, updateIndex, statusZsets}));

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

    const impResultStatus = statusImp({});
    t.ok(impResultStatus instanceof Promise, 'The implementation of status returns a promise');
    const expectStatus = {version: _pack.version, keys: statusReturn};
    await impResultStatus
      .then((result: any) => {
        t.deepEqual( result, expectStatus, 'The implementation of status returns what is expected');
        t.ok(true, 'Implementation of status does not blow up');
      })
      .catch((err:Error) => {
        console.log(err);
        t.notOk(true, 'Implementation of status should not blow up');
      });


    const diseaseCall = _iris.register.getCall(2);
    const diseaseImp = diseaseCall.args[0].handler;
    t.equal(diseaseCall.args[0].pattern, 'action.disease.autocomplete', 'The service exposes a disease handle');
    const assayCall = _iris.register.getCall(3);
    t.equal(assayCall.args[0].pattern, 'action.assay.autocomplete', 'The service exposes a assay handle');
    const tissueCall = _iris.register.getCall(4);
    t.equal(tissueCall.args[0].pattern, 'action.tissue.autocomplete', 'The service exposes a tissue handle');
    const techCall = _iris.register.getCall(5);
    t.equal(techCall.args[0].pattern, 'action.technology.autocomplete', 'The service exposes a technology handle');
    const autoAllCall = _iris.register.getCall(6);
    const autoAllImp = autoAllCall.args[0].handler;
    t.equal(autoAllCall.args[0].pattern, 'action.autocomplete', 'The service exposes a update handle');

    const createCall = _iris.register.getCall(7);
    const createImp = createCall.args[0].handler;
    t.equal(createCall.args[0].pattern, 'event.dataset.create', 'The service exposes a update handle');

    const promiseImpDisease = diseaseImp({payload:'L'});
    t.ok(promiseImpDisease instanceof Promise, 'The implementation of disease.autocomplete returns a promise');
    await promiseImpDisease.then().catch(console.error);

    const promiseAutoAll = autoAllImp({payload:'T'});
    t.ok(promiseAutoAll instanceof Promise, 'The implementation of action.autocomplete returns a promise');
    await promiseAutoAll.then().catch(console.error);

    const properPayload = {payload:{properties:{attributes:{disease: ['cancer']}}}};
    const promiseCreate = createImp(properPayload);
    t.ok(promiseCreate instanceof Promise, 'The implementation of event.dataset.create returns a promise');
    await promiseCreate.then( (results:any) => {
      t.ok( true, 'The implementation of create do not blows up');
    }).catch( (error:Error) => {
      t.notOk(true, 'The implementation of create should not blow up');
    });

    const noAtri = {payload:{'properties':{'disease': 'cancer'}}};
    await createImp(noAtri).then( (results:any) => {
      t.ok(true, 'Create do not blow up with no atribute field in the payload');
    }).catch ( (error: Error) => {
      t.notOk(true, 'Create with no attributes in the payload should not blow up');
    });


  }
  _test()
    .then(() => t.end())
    .catch(console.error);
});
