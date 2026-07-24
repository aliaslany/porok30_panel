const fs = require('fs');
fetch('https://api.allorigins.win/get?url=https%3A%2F%2Ft.me%2Fs%2FProxyMTProto')
  .then(r => r.json())
  .then(data => {
    fs.writeFileSync('out.html', data.contents);
    console.log("Done");
  });
