const fs = require('fs');
const path = require('path');

const files = [
    'frontend/src/pages/SchemeResults.jsx',
    'frontend/src/pages/Home.jsx',
    'frontend/src/pages/Conversation.jsx',
    'frontend/src/pages/AllSchemesList.jsx',
    'frontend/src/components/FloatingChat.jsx'
];

files.forEach(f => {
    const filePath = path.join(__dirname, f);
    let content = fs.readFileSync(filePath, 'utf8');
    // Replace 'http://localhost:5000...' or `http://localhost:5000...` with `http://${window.location.hostname}:5000...`
    content = content.replace(/['"`]http:\/\/localhost:5000(.*?)['"`]/g, '`http://${window.location.hostname}:5000$1`');
    fs.writeFileSync(filePath, content);
});

console.log('Replaced localhost with window.location.hostname in frontend files.');
