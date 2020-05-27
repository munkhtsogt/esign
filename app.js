const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/main');
const crypto = require('crypto');
const fs = require('fs');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const Signature = require("./models/signature");
const app = express();
const private_key = fs.readFileSync('./keys/privateKey.pem', 'utf-8');
const public_key = fs.readFileSync('./keys/publicKey.pem', 'utf-8');

app.use('/static', express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.Promise = global.Promise;

mongoose.connect(config.database, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() =>  console.log('mongodb connection succesful'))
  .catch((err) => console.error(err));

app.set('trust proxy', true);

app.get('/', function (req, res) {
    Signature.find({}, function(err, signatures) {
       res.render('index', {signatures: signatures});
    }).catch(err => {
        console.log(err);
    });
});

app.post('/save', function (req, res) {
    const signer = crypto.createSign('RSA-SHA256');
    signer.write(req.body.full_name);
    signer.end();
    const signature = signer.sign(private_key, 'base64');
    
    Signature.create({ full_name: req.body.full_name, signature: signature, image: req.body.image })
        .then(s => {
            res.json({ success: true, signature: s })
        })
        .catch(err => {
            console.log(err);
            res.json({ success: false });
        });
});

app.post('/verify', function (req, res) {
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.write(req.body.full_name);
    verifier.end();
    Signature.findOne({ _id: req.body.signature_id })
        .then(s => {
            if (s != null) {
                const result = verifier.verify(public_key, s.signature, 'base64');
                res.json({ success: result });
            }
        })
        .catch(err => {
            console.log(err);
            res.json({ success: false });
        });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
