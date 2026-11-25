const {readSession}=require('./archive.cjs');
function summarize(m){
 const expected=m.mode==='full'?['api-regression','ldc-regression','typecheck','lint','build']:['api-regression','ldc-regression'];
 const names=m.results.map(r=>r.name);
 if(names.length!==expected.length||new Set(names).size!==names.length||expected.some(n=>!names.includes(n)))throw Error('Incomplete or duplicate gate results');
 for(const r of m.results){if((r.status==='PASS'&&r.exitCode!==0)||(r.status==='FAIL'&&(!Number.isInteger(r.exitCode)||r.exitCode===0)))throw Error('Inconsistent gate result');}
 const status=m.results.some(r=>r.status==='FAIL')?'FAIL':m.results.some(r=>r.status==='BLOCKED')?'BLOCKED':'PASS';
 return {sessionId:m.sessionId,version:m.version,mode:m.mode,status,results:m.results.map(({name,status})=>({name,status})),manualAcceptance:'NOT_RUN',liveProvider:'NOT_RUN',releaseReady:false};
}
function render(s){return [`TeachMate AI ${s.version} | ${s.mode} gate: ${s.status}`,...s.results.map(r=>`${r.name}: ${r.status}`),'Manual acceptance: NOT RUN','Live provider: NOT RUN','Release readiness: NOT ESTABLISHED'].join('\n');}
module.exports={summarize,render};
if(require.main===module){try{if(process.argv.length!==3)throw Error();const path=require('node:path');console.log(render(summarize(readSession(path.resolve(__dirname,'../docs/evidence'),process.argv[2]))));}catch{console.error('Monitor blocked: missing, unsafe or inconsistent evidence');process.exitCode=1;}}
