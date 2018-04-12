  var http = require('http'),
      fileSystem = require('fs'),
      path = require('path');

  http.createServer(function(request, response) {
  console.log(request.url);
  if(request.url == "/"){
  var filePath = '/HelloPrince.mp4';
  response.writeHead(200,{"Content-Type": "text/html", "charset":"utf-8"});
  response.write(`<video id="video" controls autoplay=true style="width: 100p%" muted> <source src="${filePath}" type="video/mp4"> </video>`);

  } else if (request.url == "/HelloPrince.mp4") {
    const path1 = path.join(__dirname, 'HelloPrince.mp4');
    const stat = fileSystem.statSync(path1)
    const fileSize = stat.size
    const range = request.headers.range
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize-1
      const chunksize = (end-start)+1
      const file = fileSystem.createReadStream(path1, {start, end})
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }
      response.writeHead(206, head);
      file.pipe(response);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      response.writeHead(200, head)
      fileSystem.createReadStream(path1).pipe(response  )
    }


  }
  })
  .listen(2000);
