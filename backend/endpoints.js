const multer = require('multer');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { s3, db } = require('./serverConfig');
const mimeDb = require('mime-db');

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
router.post('/uploadfile', upload.single('file'), async (request, response) => {
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
            fileMetadata: fileMetadata,
        });

    } catch (error) {
        console.error('Error uploading file:', error);
        response.status(500).send({ error: 'Failed to upload file' });
    }
});

//retrieve metadata of a specific file
router.get('/filedata/:fileId', async (request, response) => {
    try {
        const fileId = request.params.fileId;   //extracting file ID from request params

        const fileData = await db.collection('filesMetadata').doc(fileId).get();
        if (!fileData.exists) {
            return response.status(404).send({ error: 'File not found' });
        }

        const fileMetadata = fileData.data();
        response.status(200).send({
            message: 'File metadata retrieved successfully',
            fileMetadata: fileMetadata
        });

    } catch (error) {
        console.error('Error retrieving file metadata:', error);
        response.status(500).send({ error: 'Failed to retrieve file metadata' });
    }
});  

//retrieve all files metadata
router.get('/filedata', async (request, response) => {
    try {
        const dbSnapshot = await db.collection('filesMetadata').get();
        const filesMetadata = [];

        dbSnapshot.forEach((doc) => {
            filesMetadata.push({...doc.data()});  //unpacking Firestore document into each object in the array
            const fileData = filesMetadata[filesMetadata.length - 1];

            fileData["fileType"] = mimeDb[fileData.fileType].extensions[0]; //retreiving file extension

            //converting last modified date to human-readable format of "date month year"
            const date = fileData["uploadDate"].toDate();  //converting firestore timestamp to JS date object
            const modifiedDate = date.toLocaleDateString('en-US', {day: 'numeric', month: 'long', year: 'numeric'});
            fileData["uploadDate"] = modifiedDate;

            //converting file size from bytes to human-readable format
            const sizeUnits = ["B", "KB", "MB", "GB", "TB"];
            var fileSize = fileData.fileSize;
            var fileSizeCounter = 0;
            var fileSizeStr = fileSize.toString();

            if (fileSizeStr.length > 3) {
                fileSize = (fileSize / 1024).toFixed(1); //round to 1dp
                fileSizeStr = fileSize.toString();
                fileSizeCounter++;

                while (fileSizeStr.length > 5) {
                    fileSize = (fileSize / 1024).toFixed(1);
                    fileSizeStr = fileSize.toString();
                    fileSizeCounter++;
                }
            }

            fileData["fileSize"] = `${fileSize} ${sizeUnits[fileSizeCounter]}`; 
        });

        response.status(200).send({
            message: 'Files retrieved successfully',
            files: filesMetadata
        });
  
    } catch (error) {
        console.error('Error retrieving files:', error);
        response.status(500).send({ error: 'Failed to retrieve files' });
    }
  });

//file download endpoint
router.get('/downloadfile/:fileId', async (request, response) => {
    try {
        const fileId = request.params.fileId;   //extracting file ID from request params

        let fileData = await db.collection('filesMetadata').doc(fileId).get();
        if (!fileData.exists) {
            return response.status(404).send({ error: 'File not found' });
        }

        fileData = fileData.data();
        const params = {
            Bucket: s3Bucket,
            Key: fileData.s3Key,
        };
        const fileStream = s3.getObject(params).createReadStream();  //read stream allows to read the file in chunks for better performance

        response.setHeader('Content-Disposition', `attachment; filename=${fileData.fileName}`);
        response.setHeader('Content-Type', fileData.fileType);
        response.setHeader('X-Content-Title', fileData.fileName);
        
        //transferring the readable file stream to the writable response object and sending 200 OK response
        fileStream.pipe(response);

    } catch (error) {
        console.error('Error downloading file:', error);
        response.status(500).send({ error: 'Failed to download file' });
    }
});

//rename file endpoint
router.put('/renamefile/:fileId', async (request, response) => {
    try {
        const fileId = request.params.fileId;   //extracting file ID from request params

        let fileData = await db.collection('filesMetadata').doc(fileId).get();
        if (!fileData.exists) {
            return response.status(404).send({ error: 'File not found' });
        }

        fileData = fileData.data();
        const newFileName = request.body.newFileName;
        const newS3Key = `${fileData.fileId}-${newFileName}`;

        //renaming file in S3 by creating a new copy and deleting the old one
        await s3.copyObject({
            Bucket: s3Bucket,
            CopySource: `${s3Bucket}/${fileData.s3Key}`,
            Key: newS3Key,
        }).promise();
        await s3.deleteObject({Bucket: s3Bucket, Key: fileData.s3Key}).promise();

        //updating file metadata in Firestore
        await db.collection('filesMetadata').doc(fileId).update({
            fileName: newFileName,
            s3Key: newS3Key,
        });

        response.status(200).send({ message: 'File renamed successfully' });

    } catch (error) {
        console.error('Error renaming file:', error);
        response.status(500).send({ error: 'Failed to rename file' });
    }
});

//delete file endpoint
router.delete('/deletefile/:fileId', async (request, response) => {
    try {
        const fileId = request.params.fileId;   //extracting file ID from request params

        let fileData = await db.collection('filesMetadata').doc(fileId).get();
        if (!fileData.exists) {
            return response.status(404).send({ error: 'File not found' });
        }

        fileData = fileData.data();
    
        //deleting file from s3 and Firestore
        await s3.deleteObject({Bucket: s3Bucket, Key: fileData.s3Key}).promise();
        await db.collection('filesMetadata').doc(fileId).delete();
    
        response.status(200).send({ message: 'File deleted successfully' });

    } catch (error) {
        console.error('Error deleting file:', error);
        response.status(500).send({ error: 'Failed to delete file' });
    }
});

module.exports = router;