const fs = require('fs');
const content = fs.readFileSync('d:/internship/frontend/src/components/form/ApplicationFormModal.jsx', 'utf8');

let p = 0, b = 0, s = 0;
for (let i = 0; i < content.length; i++) {
  if (content[i] === '(') p++;
  if (content[i] === ')') p--;
  if (content[i] === '{') b++;
  if (content[i] === '}') b--;
  if (content[i] === '[') s++;
  if (content[i] === ']') s--;
  
  if (p < 0 || b < 0 || s < 0) {
    console.log(`Imbalance at index ${i}, line ${content.substring(0, i).split('\n').length}: p=${p}, b=${b}, s=${s}`);
    // break;
  }
}
console.log(`Final: p=${p}, b=${b}, s=${s}`);
