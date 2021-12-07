const fs = require('fs');
const { replaceTemplate } = require('./modules/replaceTemplate');
// pre read data for efficiency -this is top level code it executed only once because this is at the beginning

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

// create a server
const http = require('http');
const url = require('url');
const server = http.createServer((req, res) => {
  // create routes
  const { query, pathname } = url.parse(req.url, true);
  //   overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });

    const cardsHtml = dataObject
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
    res.end(output);
  }
  //   product page
  else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    const product = dataObject[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }
  //   api
  else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
    });
    res.end('<h1>Page Not Found</h1>');
  }
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Server started on port 3000');
});
