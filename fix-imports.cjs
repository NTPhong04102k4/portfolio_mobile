const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'styles', 'components');
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.scss')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.replace("@use 'variables' as *;", "");
    fs.writeFileSync(filePath, content);
  }
});
console.log('Fixed imports');
