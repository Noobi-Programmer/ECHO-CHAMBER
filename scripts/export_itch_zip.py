import os
import sys
import shutil
import zipfile
import subprocess

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST_DIR = os.path.join(PROJECT_ROOT, 'dist')
ZIP_OUTPUT = os.path.join(PROJECT_ROOT, 'echo-chamber-itch-html.zip')

print(f"Building ECHO//CHAMBER for itch.io HTML export...")

# 1. Clean dist/
if os.path.exists(DIST_DIR):
    shutil.rmtree(DIST_DIR)

# 2. Run build
cmd = ['npm', 'run', 'build']
res = subprocess.run(cmd, cwd=PROJECT_ROOT, shell=True)
if res.returncode != 0:
    print("Build failed!")
    sys.exit(1)

# 3. Verify index.html exists in dist
index_html = os.path.join(DIST_DIR, 'index.html')
if not os.path.exists(index_html):
    print("Error: dist/index.html not found!")
    sys.exit(1)

# 4. Remove previous zip if exists
if os.path.exists(ZIP_OUTPUT):
    os.remove(ZIP_OUTPUT)

# 5. Create zip containing the CONTENTS of dist/ directly at zip root
print(f"Creating zip at {ZIP_OUTPUT}...")
total_files = 0
total_uncompressed_bytes = 0

with zipfile.ZipFile(ZIP_OUTPUT, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as zipf:
    for root, dirs, files in os.walk(DIST_DIR):
        for f in files:
            full_path = os.path.join(root, f)
            # archive path is relative to dist, so index.html is at root
            arcname = os.path.relpath(full_path, DIST_DIR)
            zipf.write(full_path, arcname)
            total_files += 1
            total_uncompressed_bytes += os.path.getsize(full_path)

zip_size_bytes = os.path.getsize(ZIP_OUTPUT)
zip_size_mb = zip_size_bytes / (1024 * 1024)
uncompressed_mb = total_uncompressed_bytes / (1024 * 1024)

print(f"\n==========================================")
print(f"ITCH.IO HTML EXPORT COMPLETE")
print(f"==========================================")
print(f"Output: {ZIP_OUTPUT}")
print(f"Files archived: {total_files}")
print(f"Uncompressed size: {uncompressed_mb:.2f} MB")
print(f"Compressed zip size: {zip_size_mb:.2f} MB")
print(f"Root contains index.html: {os.path.exists(index_html)}")
print(f"==========================================")
