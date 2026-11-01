const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');

const s3Client = new S3Client({
    endpoint: process.env.S3_ENDPOINT, // Endpoit API Supabase Cloud
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
    },
    forcePathStyle: true, // Force path-style formatting for third-party S3 services
});

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit maximum image file size to 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Chỉ chấp nhận tệp tin hình ảnh hợp lệ!'), false);
    }
});

module.exports = { s3Client, upload };