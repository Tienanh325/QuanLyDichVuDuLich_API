const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('<Space direction="vertical"')) {
                content = content.replace(/<Space direction="vertical"/g, '<Space orientation="vertical"');
                fs.writeFileSync(fullPath, content);
                console.log('Updated', fullPath);
            }
        }
    }
}

replaceInDir(path.join(__dirname, 'Frontend', 'my-react', 'src'));
console.log('Done replacing Space direction.');
