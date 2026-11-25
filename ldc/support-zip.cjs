// Minimal ZIP32 STORE writer for two fixed, validated diagnostic entries.
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {readSession}=require('./archive.cjs');
const {serializeEvents}=require('./events.cjs');
function crc32(data){let c=0xffffffff;for(const b of data){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;}
function exportZip(root,id,destination){
 const data=Buffer.from(serializeEvents(readSession(root,id)));
 const entries=[['events.jsonl',data],['events.sha256',Buffer.from(crypto.createHash('sha256').update(data).digest('hex')+'  events.jsonl\n')]];
 const local=[],central=[];let offset=0;
 for(const [name,body] of entries){const n=Buffer.from(name),crc=crc32(body),h=Buffer.alloc(30),c=Buffer.alloc(46);
 h.writeUInt32LE(0x04034b50);h.writeUInt16LE(20,4);h.writeUInt16LE(33,12);h.writeUInt32LE(crc,14);h.writeUInt32LE(body.length,18);h.writeUInt32LE(body.length,22);h.writeUInt16LE(n.length,26);
 c.writeUInt32LE(0x02014b50);c.writeUInt16LE(20,4);c.writeUInt16LE(20,6);c.writeUInt16LE(33,14);c.writeUInt32LE(crc,16);c.writeUInt32LE(body.length,20);c.writeUInt32LE(body.length,24);c.writeUInt16LE(n.length,28);c.writeUInt32LE(offset,42);
 local.push(h,n,body);central.push(c,n);offset+=h.length+n.length+body.length;
 }
 const directory=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(entries.length,8);end.writeUInt16LE(entries.length,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);
 fs.writeFileSync(destination,Buffer.concat([...local,directory,end]),{flag:'wx',mode:0o600});
}
module.exports={exportZip,crc32};
if(require.main===module){try{if(process.argv.length!==4)throw Error();exportZip(path.resolve(__dirname,'../docs/evidence'),process.argv[2],process.argv[3]);}catch{console.error('Support ZIP blocked: invalid evidence or destination');process.exitCode=1;}}