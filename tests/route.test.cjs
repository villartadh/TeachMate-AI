const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
function load(path, deps={}, env={}) {
 const js=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
 const exports={}; vm.runInNewContext(js,{exports,require:id=>{if(!(id in deps))throw Error(id);return deps[id]},Response,process:{env},console:{error(){}}}); return exports;
}
const parser=load('lib/lesson-plan.ts');
const route=load('app/api/generate-lesson/route.ts',{'openai':class {constructor(){throw Error('Must not initialize without credentials')}},'@/lib/lesson-plan':parser});
const post=body=>route.POST(new Request('http://localhost/api/generate-lesson',{method:'POST',body}));
test('malformed JSON returns 400',async()=>assert.equal((await post('{')).status,400));
test('missing fields returns 400',async()=>assert.equal((await post('{}')).status,400));
test('valid request without key returns safe 503',async()=>{const r=await post(JSON.stringify({gradeLevel:'5',subject:'Math',topic:'Fractions',competency:'Add fractions',format:'DLL'}));assert.equal(r.status,503);assert.equal((await r.json()).success,false)});

const valid={gradeLevel:'5',subject:'Math',topic:'Fractions',competency:'Add fractions',format:'DLL'};
const plan=Object.fromEntries(['learningCompetency','learnerContext','preLesson','learningExperience','guidedPractice','independentPractice','assessment','assignment','remediation','enrichment'].map(k=>[k,'Sample']));
plan.objectives=['Objective'];plan.materials=['Paper'];
function mockPost(create,body=valid){const mock=load('app/api/generate-lesson/route.ts',{'openai':class {responses={create}},'@/lib/lesson-plan':parser},{OPENAI_API_KEY:'mock-only'});return mock.POST(new Request('http://localhost/api/generate-lesson',{method:'POST',body:JSON.stringify(body)}));}
test('mock provider valid response returns structured plan',async()=>{const r=await mockPost(async input=>{assert.equal(input.text.format.strict,true);return {output_text:JSON.stringify(plan)}});assert.equal(r.status,200);assert.deepEqual((await r.json()).lessonPlan,plan)});
test('mock provider malformed output returns 502',async()=>assert.equal((await mockPost(async()=>({output_text:'invalid'}))).status,502));
test('mock provider wrong schema returns 502',async()=>assert.equal((await mockPost(async()=>({output_text:JSON.stringify({...plan,materials:[123]})}))).status,502));
test('provider exception does not leak secret',async()=>{const r=await mockPost(async()=>{throw Error('private-token')});assert.equal(r.status,500);assert.doesNotMatch(await r.text(),/private-token/)});
test('blank input rejected before provider',async()=>assert.equal((await mockPost(async()=>{throw Error('unexpected call')},{...valid,topic:'  '})).status,400));
