import hashlib
import pathlib
import subprocess
import tempfile
import unittest
import uuid
import zipfile
import json

ROOT = pathlib.Path(__file__).resolve().parents[1]

class SupportZipTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.id = str(uuid.uuid4())
        self.session = ROOT / 'docs/evidence' / self.id
        self.session.mkdir(parents=True)
        import shutil
        self.addCleanup(shutil.rmtree, self.session)
        manifest = dict(schemaVersion=1, sessionId=self.id, project='TeachMate AI', version='0.1.0-alpha.9', mode='targeted', createdAt='2026-11-26T00:00:00Z', results=[dict(name=n,status='PASS',exitCode=0,durationMs=1,stderr='secret-marker') for n in ['api-regression','ldc-regression']])
        data = json.dumps(manifest).encode()
        (self.session/'manifest.json').write_bytes(data)
        (self.session/'manifest.sha256').write_text(hashlib.sha256(data).hexdigest()+'  manifest.json\n')
        (self.session/'.env').write_text('secret-marker')
        self.dest = pathlib.Path(self.temp.name)/'support.zip'
    def run_export(self, session=None):
        import sys
        return subprocess.run([sys.executable,str(ROOT/'ldc/support-zip.py'),session or self.id,str(self.dest)],capture_output=True)
    def test_allowlist_and_checksum(self):
        self.assertEqual(self.run_export().returncode,0)
        with zipfile.ZipFile(self.dest) as z:
            self.assertEqual(set(z.namelist()),{'events.jsonl','events.sha256'})
            data=z.read('events.jsonl')
            self.assertNotIn(b'secret-marker',data)
            self.assertEqual(z.read('events.sha256').decode(),hashlib.sha256(data).hexdigest()+'  events.jsonl\n')
            self.assertIsNone(z.testzip())
    def test_no_overwrite(self):
        self.dest.write_bytes(b'original')
        self.assertNotEqual(self.run_export().returncode,0)
        self.assertEqual(self.dest.read_bytes(),b'original')
    def test_tamper_and_traversal(self):
        (self.session/'manifest.json').write_text('{}')
        self.assertNotEqual(self.run_export().returncode,0)
        self.assertNotEqual(self.run_export('../secret').returncode,0)
        self.assertFalse(self.dest.exists())

if __name__=='__main__': unittest.main()