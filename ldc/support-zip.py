"""Export only validated diagnostic data, never arbitrary project files."""
import argparse
import io
import json
import pathlib
import subprocess
import zipfile


def export(session, destination):
    root = pathlib.Path(__file__).resolve().parent
    # The existing event CLI validates checksum, identity and gate completeness.
    result = subprocess.run(['node', str(root / 'events.cjs'), session], capture_output=True, check=True, timeout=15)
    data = result.stdout
    events = [json.loads(line) for line in data.splitlines()]
    if not events or events[-1]['type'] != 'gate.finished':
        raise ValueError('Incomplete evidence')
    import hashlib
    checksum = hashlib.sha256(data).hexdigest() + '  events.jsonl\n'
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, 'w', zipfile.ZIP_DEFLATED) as archive:
        archive.writestr('events.jsonl', data)
        archive.writestr('events.sha256', checksum)
    with open(destination, 'xb') as output:
        output.write(buffer.getvalue())


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('session')
    parser.add_argument('destination')
    args = parser.parse_args()
    try:
        export(args.session, args.destination)
    except (OSError, ValueError, subprocess.SubprocessError):
        parser.exit(1, 'Support ZIP blocked: invalid evidence or destination\n')