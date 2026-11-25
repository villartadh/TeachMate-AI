const {spawnSync}=require('node:child_process');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
function runStep(root,step,spawn=spawnSync){
 const start=Date.now();
 const missing=step.required&&!fs.existsSync(path.join(root,step.required));
 // Deliberately do not persist stdout, stderr, environment, or exception text.
 let result=null;
 if(!missing){try{result=spawn(process.execPath,step.args,{cwd:root,encoding:'utf8',timeout:180000,maxBuffer:8*1024*1024,env:{...process.env,OPENAI_API_KEY:'',OPENAI_ADMIN_KEY:'',NEXT_TELEMETRY_DISABLED:'1'}})}catch{}}
 const status=missing||!result||result.error||result.signal?'BLOCKED':result.status===0?'PASS':'FAIL';
 return {name:step.name,status,exitCode:result?.status??null,durationMs:Date.now()-start};
}
function writeEvidence(dir,manifest){
 fs.mkdirSync(dir,{recursive:true});
 const data=JSON.stringify(manifest,null,2)+'\n';
 fs.writeFileSync(path.join(dir,'manifest.json'),data,{flag:'wx'});
 fs.writeFileSync(path.join(dir,'manifest.sha256'),crypto.createHash('sha256').update(data).digest('hex')+'  manifest.json\n',{flag:'wx'});
}
module.exports={runStep,writeEvidence};
