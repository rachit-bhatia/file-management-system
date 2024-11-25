const multer = require('multer');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { s3, db } = require('./serverConfig');

const router = express.Router();

//configuring Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() }); //using memory storage for temporary file handling

const s3Bucket = process.env.AWS_S3_BUCKET;

//uploading a file to S3
async function uploadToS3(file, key) {
    const params = {
      Bucket: s3Bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
  
    return s3.upload(params).promise();  //returning a promise to allow async/await
  }

//file upload endpoint
router.post('/uploadFile', upload.single('file'), async (request, response) => {
    try {
      const file = request.file;
      if (!file) {
        return response.status(400).send({ error: 'No file uploaded' });
      }
  
      //generating a unique file ID and corresponding S3 key
      const fileId = uuidv4();
      const s3Key = `${fileId}-${file.originalname}`;
  
      const s3Response = await uploadToS3(file, s3Key);
  
      //storing metadata in a Firestore db collection
      const fileMetadata = {
        fileId,
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        s3Key,
        s3Url: s3Response.Location,
        uploadDate: new Date(),
      };
      await db.collection('filesMetadata').doc(fileId).set(fileMetadata);
  
      //sending successful response with file metadata
      response.status(201).send({
        message: 'File uploaded successfully',
        fileMetadata: metadata,
      });

    } catch (error) {
      console.error('Error uploading file:', error);
      response.status(500).send({ error: 'Failed to upload file' });
    }

  });

//retrieve file metadata endpoint
router.get('/fileData/:fileId', async (request, response) => {
    try {
      const fileId = request.params.fileId;  //extracting file ID from request params
  
      const fileData = await db.collection('files').doc(fileId).get();
      if (!fileData.exists) {
        return response.status(404).send({ error: 'File not found' });
      }
  
      response.status(200).send(fileData.data());

    } catch (error) {
      console.error('Error retrieving file metadata:', error);
      response.status(500).send({ error: 'Failed to retrieve file metadata' });
    }
  });