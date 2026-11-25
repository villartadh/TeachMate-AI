const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {runStep}=require('./core.cjs');
const {finalizeSession}=require('./session.cjs');
const {steps}=require('./adapters/next.cjs');
const root=path.resolve(__dirname,'..');
const mode=process.argv[2]||'targeted';
if(!['targeted','full'].includes(mode)){console.error('Usage: node ldc/gate.cjs targeted|full');process.exit(2)}
const id=crypto.randomUUID();
const results=steps(mode).map(step=>{const r=runStep(root,step);console.log(`${r.name}: ${r.status}`);return r});
const manifest={schemaVersion:1,sessionId:id,project:'TeachMate AI',version:fs.readFileSync(path.join(root,'VERSION'),'utf8').trim(),mode,createdAt:new Date().toISOString(),results,manualAcceptance:'NOT_RUN',liveProvider:'NOT_RUN'};
const outcome=finalizeSession(path.join(root,'docs','evidence'),manifest);
console.log(`Session: ${id}`);
console.log(`Support ZIP: ${outcome.archiveStatus}`);
process.exitCode=outcome.exitCode;
