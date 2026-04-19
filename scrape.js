const https = require('https');
const fs = require('fs');

const urls = [
  'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/odontoiatria-conservativa',
  'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/endodonzia',
  'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/pedodonzia',
  'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/ortodonzia',
  'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/ortodonzia-invisibile',
  'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/protesi',
  'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/chirurgia-orale',
  'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/chirurgia-maxillo-facciale',
  'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/implantologia',
  'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/igiene-orale',
  'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/sbiancamento-dentale',
  'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/gnatologia',
  'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/disturbi-del-sonno-apnee-notturne',
  'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/diagnostica-per-immagini',
  'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/parodontologia',
  'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/odontologia-forense',
  'https://www.tanzidentalclinic.it/staff-dentistico/dott-vito-giuseppe-tanzi',
  'https://www.tanzidentalclinic.it/staff-dentistico/dott-ssa-caterina-tanzi',
  'https://www.tanzidentalclinic.it/staff-dentistico/dott-angelo-raffaele-sodano',
  'https://www.tanzidentalclinic.it/staff-dentistico/dott-ssa-franca-de-gregorio',
  'https://www.tanzidentalclinic.it/clinica-odontoiatrica'
];

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (resp) => {
      let data = '';
      if (resp.statusCode === 301 || resp.statusCode === 302) {
         return resolve(fetchUrl(resp.headers.location));
      }
      resp.on('data', (chunk) => { data += chunk; });
      resp.on('end', () => { resolve({url, html: data}); });
    }).on("error", (err) => { reject(err); });
  });
}

async function scrapeAll() {
  const allData = {};
  for (const url of urls) {
    try {
      const res = await fetchUrl(url);
      
      // extremely basic parsing
      const titleMatch = res.html.match(/<title>([^<]*)<\/title>/);
      const title = titleMatch ? titleMatch[1] : '';
      
      // remove header/footer nav to focus on content
      let bodyText = res.html.replace(/<nav[\s\S]*?<\/nav>/gi, '');
      bodyText = bodyText.replace(/<footer[\s\S]*?<\/footer>/gi, '');
      
      // Match main h1
      const h1Match = res.html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
      const h1 = h1Match ? h1Match[1].trim() : '';

      // we just want to know if it succeeds. 
      // We will parse out text content more dynamically later or just use boilerplate templates 
      // since user said "ridimensiona i testi perchè tanto info alle persone che navinao non servono" 
      // i.e., I can just keep them minimal.
      
      const slugMatch = url.match(/\/([^\/]+)$/);
      const slug = slugMatch ? slugMatch[1] : url;

      allData[slug] = { title, h1 };
      console.log(`Scraped: ${slug}`);
    } catch(err) {
      console.log(`Error scraping ${url}: ${err.message}`);
    }
  }
  fs.writeFileSync('site-data.json', JSON.stringify(allData, null, 2));
  console.log('Done!');
}

scrapeAll();
