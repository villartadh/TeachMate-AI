const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function readSession(root,id){
 if(!uuid.test(id)) throw Error('Invalid session ID');
 const dir=path.join(root,id);
 if(fs.lstatSync(dir).isSymbolicLink()) throw Error('Unsafe session directory');
 const read=name=>{const p=path.join(dir,name);const s=fs.lstatSync(p);if(!s.isFile()||s.size>1048576)throw Error('Unsafe evidence file');return fs.readFileSync(p)};
 const raw=read('manifest.json');
 if(read('manifest.sha256').toString()!==hash(raw)+'  manifest.json\n')throw Error('Evidence checksum mismatch');
 const m=JSON.parse(raw);
 if(m.sessionId!==id||m.schemaVersion!==1||m.project!=='TeachMate AI'||!/^0\.1\.0-alpha\.\d+$/.test(m.version)||!['targeted','full'].includes(m.mode)||!Array.isArray(m.results))throw Error('Invalid manifest');
 const allowed=new Set(['api-regression','ldc-regression','typecheck','lint','build']);
 const results=m.results.map(r=>{if(!allowed.has(r.name)||!['PASS','FAIL','BLOCKED'].includes(r.status)||!(r.exitCode===null||Number.isInteger(r.exitCode))||!Number.isFinite(r.durationMs)||r.durationMs<0)throw Error('Invalid result');return {name:r.name,status:r.status,exitCode:r.exitCode,durationMs:r.durationMs}});
 if(!Number.isFinite(Date.parse(m.createdAt)))throw Error('Invalid timestamp');
 return {schemaVersion:1,sessionId:id,project:'TeachMate AI',version:m.version,mode:m.mode,createdAt:new Date(m.createdAt).toISOString(),results,manualAcceptance:'NOT_RUN',liveProvider:'NOT_RUN'};
}
function archiveSession(root,id,destination){
 const m=readSession(root,id);const data=JSON.stringify(m,null,2)+'\n';
 // Single portable JSON envelope; never include arbitrary session files or raw logs.
 const envelope=JSON.stringify({archiveVersion:1,manifest:m,manifestSha256:hash(data)},null,2)+'\n';
 fs.writeFileSync(destination,envelope,{flag:'wx',mode:0o600});return destination;
}
module.exports={readSession,archiveSession};
if(require.main===module){try{const id=process.argv[2];if(!id||process.argv.length!==3)throw Error('Usage');const root=path.resolve(__dirname,'..');const dest=path.join(root,'docs','evidence',`support-${id}.json`);archiveSession(path.join(root,'docs','evidence'),id,dest);console.log('Support archive created')}catch{console.error('Archive blocked: invalid, missing, unsafe or existing evidence');process.exitCode=1}}