const https = require('https');
const http = require('http');

const urls = [
    'https://www.hume.ai/',
    'https://www.meetradial.com/',
    'https://www.isidor.ai/',
    'https://21tsi.com/',
    'https://saaspo.com/',
    'https://phantom.com/',
    'https://chroniclehq.com/',
    'https://www.orderful.com/',
    'https://madebyreckless.webflow.io/',
    'https://www.solidroad.com/',
    'https://kzero.com/',
    'https://www.micro.so/',
    'https://brainsave.ai/'
];

async function fetchMeta(url) {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, (res) => {
            let data = '';
            res.on('data', chunk => {
                data += chunk;
                if (data.length > 50000) res.destroy();
            });
            res.on('end', () => {
                const titleMatch = data.match(/<title[^>]*>([^<]+)<\/title>/i);
                resolve({ url, title: titleMatch ? titleMatch[1].trim() : 'No title' });
            });
            res.on('error', () => resolve({ url, title: 'Error' }));
        }).on('error', () => resolve({ url, title: 'Error' }));
    });
}

Promise.all(urls.map(fetchMeta)).then(results => console.log(JSON.stringify(results, null, 2)));
