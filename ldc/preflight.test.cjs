const {test}=require('node:test');
const assert=require('node:assert/strict');
const {preflight}=require('./preflight.cjs');
const good={node:'v22.16.0',npm:()=> '10.9.2',lookup:async()=>({address:'127.0.0.1'})};
test('successful preflight is not runtime certification',async()=>{const r=await preflight(good);assert.equal(r.status,'PASS');assert.match(r.scope,/not verified/)});
test('DNS failure is blocked and sanitized',async()=>{const r=await preflight({...good,lookup:async()=>{throw Error('secret')}});assert.equal(r.status,'BLOCKED');assert.doesNotMatch(JSON.stringify(r),/secret/)});
test('unsupported Node or missing npm blocks',async()=>{assert.equal((await preflight({...good,node:'v20.0.0'})).status,'BLOCKED');assert.equal((await preflight({...good,npm:()=>{throw Error('secret')}})).status,'BLOCKED')});
