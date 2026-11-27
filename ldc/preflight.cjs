const dns = require('node:dns').promises;
const { execFileSync } = require('node:child_process');
async function preflight({lookup = dns.lookup, node = process.version, npm = () => execFileSync('npm', ['--version'], {encoding:'utf8', timeout:10000, shell:process.platform==='win32'}).trim()} = {}) {
  const checks = [{name:'node22',status:/^v22\./.test(node)?'PASS':'BLOCKED'}];
  try { const version = npm(); checks.push({name:'npm',status:/^\d+\.\d+\.\d+/.test(version)?'PASS':'BLOCKED'}); } catch { checks.push({name:'npm',status:'BLOCKED'}); }
  try { await lookup('registry.npmjs.org'); checks.push({name:'registry-dns',status:'PASS'}); } catch { checks.push({name:'registry-dns',status:'BLOCKED'}); }
  return {checks, status:checks.every(c=>c.status==='PASS')?'PASS':'BLOCKED', scope:'Preflight only; registry HTTPS, install and runtime not verified'};
}
if(require.main===module) preflight().then(r=>{console.log(JSON.stringify(r,null,2));process.exitCode=r.status==='PASS'?0:1;});
module.exports={preflight};
