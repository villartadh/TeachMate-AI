const path=require('node:path');
const {writeEvidence}=require('./core.cjs');
const {exportZip}=require('./support-zip.cjs');
// Preserve the manifest even when export fails; never report a successful gate in that case.
function finalizeSession(root,manifest,exporter=exportZip){
 const id=manifest.sessionId;
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))throw Error('Invalid session ID');
 const dir=path.join(root,id);
 writeEvidence(dir,manifest);
 const destination=path.join(dir,'support.zip');
 try{exporter(root,id,destination);return {archiveStatus:'PASS',exitCode:manifest.results.every(x=>x.status==='PASS')?0:1};}
 catch{return {archiveStatus:'FAIL',exitCode:1};}
}
module.exports={finalizeSession};
