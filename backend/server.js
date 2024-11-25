require('dotenv').config();
const firebaseAdmin = require('firebase-admin');
const aws = require('aws-sdk');
const express = require('express');
const cors = require('cors');

const firebaseConfig = {
  type: process.env.FIREBASE_TYPE,
  projectID: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), //replace escaped newlines
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  clientID: process.env.FIREBASE_CLIENT_ID,
};

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseConfig),
});

const db = firebaseAdmin.firestore();

aws.config.update({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });
  
const s3 = new aws.S3();

//initialize Express App
const app = express();
app.use(cors());
app.use(express.json());

app.listen(3000, () => console.log('Server is running on port 3000'));

module.exports = { s3, db };