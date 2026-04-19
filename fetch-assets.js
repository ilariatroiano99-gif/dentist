const https = require('https');

https.get('https://www.tanzidentalclinic.it/', (resp) => {
  let data = '';
  resp.on('data', (chunk) => {
    data += chunk;
  });
  resp.on('end', () => {
    const images = data.match(/<img[^>]+src="([^">]+)"/g);
    console.log("Images on Home Page:");
    if (images) {
      images.forEach(img => {
          const match = img.match(/src="([^">]+)"/);
          if (match) console.log(match[1]);
      });
    }
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
