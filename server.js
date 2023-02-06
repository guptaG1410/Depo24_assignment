import express from 'express';
import stats from './data.js';
import easyinvoice from 'easyinvoice';
import fs from 'fs';
import path from 'path';

const app = express();

var data = {
  // Customize enables you to provide your own templates
  // Please review the documentation for instructions and examples
  customize: {
    //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html
  },
  images: {
    // The logo on top of your invoice
    logo: 'https://media.licdn.com/dms/image/C4D0BAQFsb1FUZlm7VQ/company-logo_200_200/0/1653373725419?e=2147483647&v=beta&t=Px09afQ77kT0wtN7_An4Uv8mjBFkzpOjs59Vh8AwEfg',
    // The invoice background
    background: 'https://public.easyinvoice.cloud/img/watermark-draft.jpg',
  },
  // Your own data
  sender: {
    company: 'Depo Solutions Private Limited',
    address: '77/1/A, Christopher Road, Topsia,',
    zip: '700046',
    city: 'Kolkata',
    state: 'West Bengal',
    country: 'India',
    // GSTIN: '19AAJCD1058P1Z4',
  },
  // Your recipient
  client: {
    company: 'Depo Solutions Private Limited',
    address: '77/1/A, Christopher Road, Topsia,',
    zip: '700046',
    city: 'Kolkata',
    state: 'West Bengal',
    country: 'India',
    // GSTIN: '19AAJCD1058P1Z4',
  },
  information: {
    // Invoice number
    number: 'DEPO/KOL/PI/000007',
    // Invoice data
    date: '05-02-2023',
    // Invoice due date
    'due-date': '09-02-2023',
  },
  // The products you would like to see on your invoice
  // Total values are being calculated automatically
  products: [
    {
      quantity: 2,
      description: 'Product 1',
      'tax-rate': 6,
      price: 33.87,
    },
    {
      quantity: 4.1,
      description: 'Product 2',
      'tax-rate': 6,
      price: 12.34,
    },
    {
      quantity: 4.5678,
      description: 'Product 3',
      'tax-rate': 21,
      price: 6324.453456,
    },
  ],
  // The message you would like to display on the bottom of your invoice
  'bottom-notice': 'Kindly pay your invoice within 15 days.',
  // Settings to customize your invoice
  settings: {
    currency: 'INR', // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
  },
};

easyinvoice.createInvoice(data, async function (result) {
  //The response will contain a base64 encoded PDF file
  console.log(result.pdf);
  await fs.writeFileSync('invoice.pdf', result.pdf, 'base64');
});

// USER ROUTES

app.get('/api/products', (req, res) => {
  res.send(stats.products);
});

app.get('/api/products/DSIN/:DSIN', (req, res) => {
  const product = stats.products.find((e) => e.DSIN === req.params.DSIN);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

app.get('/api/products/:id', (req, res) => {
  const product = stats.products.find((e) => e._id === req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

// Static Files
app.use(express.stativ(path.join(__dirname, './frontend/build')));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, './frontend/build/index.html'));
});

const port = process.env.PORT || 5443;

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
