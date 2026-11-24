import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { load, save } from '../src/storage.js';

function createFakeStorage(initial = {}) {
  const store = new Map(Object.entries(initial));
  let writes = 0;
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      writes += 1;
      store.set(key, String(value));
    },
    get raw() {
      return store;
    },
    get writes() {
      return writes;
    },
  };
}

describe('storage (todos.v1)', () => {
  it('saves a list as JSON under key todos.v1 and loads it back equal', () => {
    const storage = createFakeStorage();
    const list = [
      { id: '1', text: 'Buy milk', done: false },
      { id: '2', text: 'Walk dog', done: true },
    ];

    save(storage, list);

    assert.equal(storage.writes, 1);
    assert.deepStrictEqual([...storage.raw.keys()], ['todos.v1']);
    assert.deepStrictEqual(JSON.parse(storage.raw.get('todos.v1')), list);
    assert.deepStrictEqual(load(storage), list);
  });

  it('overwrites an earlier saved list including saving an empty list', () => {
    const storage = createFakeStorage();
    save(storage, [{ id: '1', text: 'First', done: false }]);
    save(storage, []);

    assert.equal(storage.writes, 2);
    assert.deepStrictEqual(load(storage), []);
  });

  it('returns [] when todos.v1 is missing and never writes', () => {
    const empty = createFakeStorage();
    assert.deepStrictEqual(load(empty), []);
    assert.equal(empty.writes, 0);

    const otherKey = createFakeStorage({
      'todos.v0': JSON.stringify([{ id: '1', text: 'Old', done: false }]),
    });
    assert.deepStrictEqual(load(otherKey), []);
    assert.equal(otherKey.writes, 0);

    const undefinedReturn = {
      getItem() {
        return undefined;
      },
      setItem() {
        throw new Error('load must not write');
      },
    };
    assert.deepStrictEqual(load(undefinedReturn), []);
  });

  it('returns [] for corrupt JSON or non-array values and never writes', () => {
    const badValues = [
      '',
      '{not valid json',
      '{"id":"1","text":"obj","done":false}',
      'null',
      '42',
      '"a string"',
      'true',
    ];

    for (const bad of badValues) {
      const storage = createFakeStorage({ 'todos.v1': bad });
      assert.deepStrictEqual(load(storage), [], `expected [] for ${JSON.stringify(bad)}`);
      assert.equal(storage.writes, 0);
    }
  });
});
