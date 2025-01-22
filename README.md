# File Management System Web App
This project is a File Management System built using Vue.js, Express.js, Firebase, and AWS S3. It provides functionalities to upload, download, rename, and delete files. File metadata is stored in Firebase Firestore, while the files themselves are stored in an AWS S3 bucket.

### Features
- Upload Files: Users can upload files to the S3 bucket. Metadata is stored in Firestore.
- Download Files: Retrieve files stored in the S3 bucket.
- Rename Files: Update the file name in the metadata.
- Delete Files: Remove files from both S3 and Firestore.
- Responsive Frontend: Built using Vue.js for a seamless user experience.
- REST API Backend: Developed using Express.js.

### App Samples
<div style="display: flex; flex-direction: row; justify-content: space-between;">
  <img src="./sample_imgs/Main%20Screen%20Sample.png" alt="Main Screen Image" style="padding-right: 20px;"/>
  <img src="./sample_imgs/File%20Upload%20Sample.png" alt="File Upload Image" style="padding-right: 20px;"/>
  <img src="./sample_imgs/File%20Delete%20Sample.png" alt="File Delete Image" style="padding-right: 20px;"/>
</div>

### Pre-requisites
To run the project locally, you need:
- Node.js installed on your system
- An AWS Account with an S3 bucket
- A Firebase Project with Firestore enabled

### Getting Started
1. Clone the repository:
```
git clone https://github.com/rachit-bhatia/file-management-system.git
cd file-management-system
```

2. Install dependencies:
```
npm install
```
 3. Create a .env file in the root directory based on the provided .env.example

 4. Fetch Firebase credentials:
    - Go to your Firebase console and select your project
    - Create a new collection in your project's Cloud Firestore
    - Naivigate to your Project Settings > Service Accounts
    - Generate a new private key and download the JSON file
    - Fill in the required credentials in the .env file

 5. Fetch AWS credentials:
    - Go to S3 from your AWS Management Console and create a new bucket for storage
    - Then go to IAM from your AWS Management console
    - Naivigate to IAM > Users
    - Create a new user (if not already created) with programmatic access and attach the policy for read and write access
    - Generate an access key and a secret key and fill them 
    - Fill in the required credentials in the .env file

6. Run the project:
```
npm run dev
```


