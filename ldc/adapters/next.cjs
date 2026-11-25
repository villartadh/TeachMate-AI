function steps(mode){
 const list=[{name:'api-regression',args:['--test','tests/route.test.cjs']},{name:'ldc-regression',args:['--test','tests/ldc.test.cjs']}];
 if(mode==='full') for(const [name,required,...args] of [['typecheck','node_modules/typescript/bin/tsc','--noEmit'],['lint','node_modules/eslint/bin/eslint.js','.'],['build','node_modules/next/dist/bin/next','build']]) list.push({name,required,args:[required,...args]});
 return list;
}
module.exports={steps};