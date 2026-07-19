const fs = require('fs');
const path = require('path');
function walk(dir) {
  let list = fs.readdirSync(dir);
  for (let file of list) {
    file = path.resolve(dir, file);
    let stat = fs.statSync(file);
    if (stat && stat.isDirectory()) walk(file);
    else fs.utimesSync(file, new Date(), new Date());
  }
}
walk('./node_modules');
