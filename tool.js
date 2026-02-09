const fs = require('fs');
const path = require('path');

const command = process.argv[2];
const filePath = process.argv[3];

if (!filePath || !command) {
  console.error('Usage: node tool.js <command> <filename>');
  process.exit(1);
}

const fullPath = path.resolve(filePath);

fs.readFile(fullPath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err.message}`);
    process.exit(1);
  }

  switch (command) {
    case 'read':
      console.log(`\n📄 File Content:\n${data}`);
      break;

    case 'countWords':
      const wordCount = data.trim().split(/\s+/).length;
      console.log(`\n📝 Word Count: ${wordCount}`);
      break;

    case 'countChars':
      const charCount = data.length;
      console.log(`\n🔢 Character Count: ${charCount}`);
      break;

    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }
});
