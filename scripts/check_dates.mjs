import fs from 'fs';
import path from 'path';

const dir = 'C:\\Users\\shans\\Downloads';
try {
  const files = fs.readdirSync(dir);
  const fileInfos = files.map(f => {
    const p = path.join(dir, f);
    const stat = fs.statSync(p);
    return { name: f, mtime: stat.mtime, size: stat.size };
  });
  // sort by mtime desc
  fileInfos.sort((a, b) => b.mtime - a.mtime);
  console.log('Files in Downloads ordered by newest first:');
  fileInfos.slice(0, 15).forEach(f => {
    console.log(` - ${f.name} (Size: ${(f.size / 1024).toFixed(1)} KB, Modified: ${f.mtime.toISOString()})`);
  });
} catch (err) {
  console.error('Error:', err);
}
