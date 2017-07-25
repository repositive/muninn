import * as test from 'tape';
import { Test } from 'tape';
import { stub } from 'sinon';
import init from '../service';
import setupRedis from '.';

test('Testing Status Handler', (t: Test) => {
  async function _test() {
    const _promisify = stub().returns(Promise.resolve());
    const zcard = stub();
    const zadd = stub();
    const zrange = stub();
    const keys = stub();
    const _createClient = stub().returns({zcard, zadd, zrange, keys});
    const _setupRedis = setupRedis({_promisify, _createClient});

    t.equals(typeof _setupRedis, 'object', 'Module expose a function');

    const redis = await _setupRedis;

    const zset = 'test';
    const _autocomplete = redis.autocomplete(zset);

    t.equals(typeof _autocomplete, 'function','Redis.autocomplete returns a function');
  }
  _test()
    .then(() => t.end())
    .catch(console.error);
});
