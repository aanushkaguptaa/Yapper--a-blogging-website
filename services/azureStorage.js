const { BlobServiceClient } = require('@azure/storage-blob');
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = 'images';

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

async function uploadImage(file) {
  try {
      console.log('Starting image upload...');
      console.log('File details:', {
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size
      });

      const blobName = `${Date.now()}-${file.originalname}`;
      console.log('Generated blob name:', blobName);

      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      console.log('Uploading to:', blockBlobClient.url);

      const uploadResponse = await blockBlobClient.upload(
          file.buffer,
          file.buffer.length,
          {
              blobHTTPHeaders: {
                  blobContentType: file.mimetype,
                  blobContentDisposition: `inline; filename="${file.originalname}"`
              }
          }
      );

      console.log('Upload successful:', uploadResponse);
      return blockBlobClient.url;
  } catch (error) {
      console.error('Error in uploadImage:', error);
      throw error;
  }
}

module.exports = { uploadImage };