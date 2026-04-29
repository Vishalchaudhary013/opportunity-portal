const fs = require('fs');
const content = fs.readFileSync('d:/internship/frontend/src/components/form/ApplicationFormModal.jsx', 'utf8');

let p = 0, b = 0, s = 0;
let lines = content.split('\n');
for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
  let line = lines[lineIdx];
  for (let charIdx = 0; charIdx < line.length; charIdx++) {
    let char = line[charIdx];
    if (char === '(') p++;
    if (char === ')') p--;
    if (char === '{') b++;
    if (char === '}') b--;
    if (char === '[') s++;
    if (char === ']') s--;
    
    if (p < 0 || b < 0 || s < 0) {
      console.log(`Imbalance at line ${lineIdx + 1}, char ${charIdx + 1}: p=${p}, b=${b}, s=${s}`);
      p = Math.max(0, p);
      b = Math.max(0, b);
      s = Math.max(0, s);
    }
  }
}
console.log(`Final: p=${p}, b=${b}, s=${s}`);
