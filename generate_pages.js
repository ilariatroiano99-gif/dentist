const https = require('https');
const fs = require('fs');

const pages = [
  { slug: 'odontoiatria-conservativa.html', url: 'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/odontoiatria-conservativa' },
  { slug: 'endodonzia.html', url: 'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/endodonzia' },
  { slug: 'pedodonzia.html', url: 'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/pedodonzia' },
  { slug: 'ortodonzia.html', url: 'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/ortodonzia' },
  { slug: 'ortodonzia-invisibile.html', url: 'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/ortodonzia-invisibile' },
  { slug: 'protesi.html', url: 'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/protesi' },
  { slug: 'chirurgia-orale.html', url: 'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/chirurgia-orale' },
  { slug: 'chirurgia-maxillo-facciale.html', url: 'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/chirurgia-maxillo-facciale' },
  { slug: 'implantologia.html', url: 'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/implantologia' },
  { slug: 'igiene-orale.html', url: 'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/igiene-orale' },
  { slug: 'sbiancamento-dentale.html', url: 'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/sbiancamento-dentale' },
  { slug: 'gnatologia.html', url: 'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/gnatologia' },
  { slug: 'disturbi-sonno.html', url: 'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/disturbi-del-sonno-apnee-notturne' },
  { slug: 'diagnostica-immagini.html', url: 'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/diagnostica-per-immagini' },
  { slug: 'parodontologia.html', url: 'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/parodontologia' },
  { slug: 'odontologia-forense.html', url: 'https://www.tanzidentalclinic.it/specializzazioni-odontoiatriche/odontologia-forense' },
  { slug: 'dott-vito-tanzi.html', url: 'https://www.tanzidentalclinic.it/staff-dentistico/dott-vito-giuseppe-tanzi' },
  { slug: 'dottssa-caterina-tanzi.html', url: 'https://www.tanzidentalclinic.it/staff-dentistico/dott-ssa-caterina-tanzi' },
  { slug: 'dott-angelo-sodano.html', url: 'https://www.tanzidentalclinic.it/staff-dentistico/dott-angelo-raffaele-sodano' },
  { slug: 'dottssa-franca-de-gregorio.html', url: 'https://www.tanzidentalclinic.it/staff-dentistico/dott-ssa-franca-de-gregorio' },
  { slug: 'staff.html', url: 'https://www.tanzidentalclinic.it/staff' },
  { slug: 'clinica.html', url: 'https://www.tanzidentalclinic.it/clinica-odontoiatrica' }
];

const templateCSS = `
    <style>
        :root { --logo-verde: #8cc63f; --dark-verde: #264c15; --text: #1A1A1A; --light-bg: #F8FBFA; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Montserrat', sans-serif; color: var(--text); background: var(--light-bg); line-height: 1.8; overflow-x: hidden;}
        nav { display: flex; justify-content: space-between; align-items: center; padding: 15px 8%; background: white; box-shadow: 0 4px 20px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 100;}
        .logo-img { height: 50px; }
        .hero-page { background: linear-gradient(135deg, #112211, var(--dark-verde)); padding: 100px 8%; color: white; text-align: center; }
        .hero-page h1 { font-family: 'Prata', serif; font-size: clamp(2rem, 5vw, 4rem); margin-bottom: 20px; text-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .page-content { display: grid; grid-template-columns: 2fr 1fr; gap: 60px; max-width: 1200px; margin: -50px auto 100px auto; padding: 0 8%; position: relative; z-index: 10;}
        .main-text { background: white; padding: 50px; border-radius: 12px; box-shadow: 0 20px 50px rgba(0,0,0,0.08); font-size: 1.1rem; color: #444; word-wrap: break-word; }
        .main-text p { margin-bottom: 25px; }
        .sidebar { position: sticky; top: 120px; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 20px 50px rgba(0,0,0,0.08); text-align: center; border-top: 5px solid var(--logo-verde); max-height: 350px;}
        .sidebar h3 { font-family: 'Prata', serif; font-size: 1.5rem; color: var(--dark-verde); margin-bottom: 20px;}
        .sidebar p { font-size: 0.95rem; color: #666; margin-bottom: 30px;}
        
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(140, 198, 63, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(140, 198, 63, 0); } 100% { box-shadow: 0 0 0 0 rgba(140, 198, 63, 0); } }
        .btn-pulse { animation: pulse 2s infinite; display: block; width: 100%; padding: 15px; background: var(--logo-verde); color: white; text-decoration: none; border-radius: 4px; font-weight: 700; font-size: 1rem; text-transform: uppercase; transition: 0.3s; }
        .btn-pulse:hover { background: var(--dark-verde); transform: translateY(-3px); }
        .back-btn { display: inline-block; margin-top: 30px; color: var(--text); font-weight: 700; text-decoration: none; font-size: 0.9rem; text-transform: uppercase; transition: 0.3s; }
        .back-btn:hover { color: var(--logo-verde); }
        
        @media (max-width: 900px) { 
            .page-content { grid-template-columns: 1fr; margin-top: 20px; gap: 30px; padding: 0 5%;} 
            .sidebar { position: relative; top: 0; padding: 30px 20px; } 
            .main-text { padding: 30px 20px; }
            .hero-page { padding: 60px 5%; }
            nav { padding: 15px 5%; }
        }
    </style>
`;

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (resp) => {
      let data = '';
      if (resp.statusCode === 301 || resp.statusCode === 302) {
         return resolve(fetchUrl(resp.headers.location));
      }
      resp.on('data', (chunk) => { data += chunk; });
      resp.on('end', () => { resolve(data); });
    }).on("error", (err) => { reject(err); });
  });
}

function extractContent(html) {
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const h1 = h1Match ? h1Match[1].trim().replace(/<[^>]+>/g, '') : 'Tanzi Dental Clinic';
  
  // Extract paragraphs (very basic). We'll take the first 2-3 paragraphs.
  const paragraphs = [];
  const pRegex = /<p>([\s\S]*?)<\/p>/g;
  let match;
  while ((match = pRegex.exec(html)) !== null && paragraphs.length < 3) {
      let text = match[1].replace(/<[^>]+>/g, '').trim();
      if(text.length > 20) paragraphs.push(text);
  }
  
  return { h1, p: paragraphs };
}

async function generate() {
  for (const page of pages) {
    try {
      console.log('Generating: ' + page.slug);
      const html = await fetchUrl(page.url);
      const content = extractContent(html);
      
      let backUrl = "index.html#specializzazioni";
      let backLabel = "Torna alle Categorie";
      let shortLabel = "Struttura e Categorie";
      
      if (page.url.includes("staff")) {
          backUrl = "index.html#team";
          backLabel = "Torna agli Specialisti";
          shortLabel = "I Nostri Specialisti";
      } else if (page.url.includes("clinica")) {
          backUrl = "index.html#clinica";
          backLabel = "Torna alla Struttura";
          shortLabel = "La Clinica";
      }

      const pageHtml = '<!DOCTYPE html>\n' +
'<html lang="it">\n' +
'<head>\n' +
'    <meta charset="UTF-8">\n' +
'    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
'    <title>' + content.h1 + ' | Tanzi Dental Clinic</title>\n' +
'    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&family=Prata&display=swap" rel="stylesheet">\n' +
'    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">\n' +
'    ' + templateCSS + '\n' +
'</head>\n' +
'<body>\n' +
'    <nav>\n' +
'        <a href="index.html" class="logo-link">\n' +
'            <img src="https://www.tanzidentalclinic.it/wp-content/uploads/2017/11/logo-tanzi-dental-clinic.png" alt="Tanzi Dental Clinic" class="logo-img">\n' +
'        </a>\n' +
'        <strong style="margin-left:20px; color:var(--dark-verde); font-family:\'Prata\', serif; font-size:1.2rem; text-transform:capitalize; display:none;">' + content.h1 + '</strong>\n' +
'        <a href="' + backUrl + '" style="text-decoration:none; color:var(--text); font-weight:700; text-transform:uppercase; font-size:0.8rem; margin-left:auto;"><i class="fas fa-arrow-left"></i> ' + shortLabel + '</a>\n' +
'    </nav>\n' +
'    <div class="hero-page">\n' +
'        <h1 style="text-transform: capitalize;">' + content.h1 + '</h1>\n' +
'        <p style="font-size:1.2rem; opacity:0.9;">Affidati all\'eccellenza e ai migliori specialisti.</p>\n' +
'    </div>\n' +
'    <div class="page-content">\n' +
'        <div class="main-text">\n' +
'            ' + content.p.map(para => '<p>' + para + '</p>').join('') + '\n' +
'            <a href="' + backUrl + '" class="back-btn"><i class="fas fa-arrow-left"></i> ' + backLabel + '</a>\n' +
'        </div>\n' +
'        <div class="sidebar">\n' +
'            <h3>Hai bisogno di un consulto?</h3>\n' +
'            <p>Il nostro team è a tua disposizione per analizzare il caso con strumenti minimamente invasivi.</p>\n' +
'            <a href="contatti.html" class="btn-pulse">Prenota Ora</a>\n' +
'        </div>\n' +
'    </div>\n' +
'</body>\n' +
'</html>';

      fs.writeFileSync('./' + page.slug, pageHtml);
    } catch(e) {
      console.log('Error generating ' + page.slug, e);
    }
  }
}

generate();
