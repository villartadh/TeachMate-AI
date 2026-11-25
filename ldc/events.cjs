// Structured, allowlisted gate events. Never accept subprocess output or arbitrary metadata.
const names=new Set(['api-regression','ldc-regression','typecheck','lint','build']);
const statuses=new Set(['PASS','FAIL','BLOCKED']);
function eventsFor(manifest){
 const {summarize}=require('./monitor.cjs');
 const summary=summarize(manifest);
 if(!/^[0-9a-f-]{36}$/i.test(manifest.sessionId)||!/^0\.1\.0-alpha\.\d+$/.test(manifest.version))throw Error('Invalid event identity');
 const base={schemaVersion:1,sessionId:manifest.sessionId,version:manifest.version};
 const events=[{...base,sequence:0,type:'gate.started',mode:manifest.mode}];
 for(const r of manifest.results){if(!names.has(r.name)||!statuses.has(r.status)||!Number.isFinite(r.durationMs)||r.durationMs<0)throw Error('Invalid event result');events.push({...base,sequence:events.length,type:'step.finished',name:r.name,status:r.status,durationMs:r.durationMs});}
 events.push({...base,sequence:events.length,type:'gate.finished',status:summary.status});return events;
}
function serializeEvents(m){return eventsFor(m).map(e=>JSON.stringify(e)).join('\n')+'\n';}
module.exports={eventsFor,serializeEvents};
if(require.main===module){try{if(process.argv.length!==3)throw Error();const {readSession}=require('./archive.cjs');const path=require('node:path');process.stdout.write(serializeEvents(readSession(path.resolve(__dirname,'../docs/evidence'),process.argv[2])));}catch{console.error('Events blocked: invalid or missing evidence');process.exitCode=1;}}