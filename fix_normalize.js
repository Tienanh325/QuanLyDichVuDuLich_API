const fs = require('fs');
const path = require('path');

function fixNormalization(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixNormalization(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = false;

            // Look for `normalizeXxx(response.data, 0)` and replace with `normalizeXxx(response.data?.data ?? response.data, 0)`
            // Wait, response.data could have data property. But sometimes the backend returns the object directly, so we fallback to response.data.
            const regex = /normalize(\w+)\(\s*response\.data\s*,\s*0\s*\)/g;
            if (regex.test(content)) {
                content = content.replace(regex, 'normalize$1(response.data?.data ?? response.data, 0)');
                updated = true;
            }

            // Also check if any `return normalize...` without regex matches
            const regex2 = /normalize(\w+)\(\s*response\.data\.data\s*,\s*0\s*\)/g; // already fixed?
            
            if (updated) {
                fs.writeFileSync(fullPath, content);
                console.log('Fixed', fullPath);
            }
        }
    }
}

fixNormalization(path.join(__dirname, 'Frontend', 'my-react', 'src', 'pages'));
console.log('Normalization fix done.');
