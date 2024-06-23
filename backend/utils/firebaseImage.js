const { bucket } = require('../FirebaseConfig');
const { STATUS_MESSAGES} = require('../constants/Constant')


const uploadImage = async (id, imageDataUrl, filenamePrefix) => {
    try {
      const imageBuffer = Buffer.from(imageDataUrl.split(',')[1], 'base64');

      const folderName = "FitVerse: Gateway To Fitness";
      const newFilename = `${folderName}/userAvatars/${id}/${Date.now()}_${filenamePrefix}.png`;


      const newFile = bucket.file(newFilename);
      const stream = newFile.createWriteStream({
        metadata: {
          contentType: 'image/png',
        },
      });

      stream.on("error", (err) => {
        throw new Error(STATUS_MESSAGES.IMAGE_ERROR);
      });

      return new Promise((resolve, reject) => {
        stream.on("finish", async () => {
          try {
            const [url] = await newFile.getSignedUrl({
              action: "read",
              expires: "01-01-2100",
            });

            resolve({ url, filePath: newFilename });
          } catch (error) {
            reject(new Error(STATUS_MESSAGES.IMAGE_ERROR));
          }
        });

        stream.end(imageBuffer);
      });
    } catch (error) {
      throw new Error(STATUS_MESSAGES.IMAGE_ERROR);
    }
};


const uploadBlogImage = async (id, imageDataUrl, filenamePrefix) => {
    try {
      const imageBuffer = Buffer.from(imageDataUrl.split(',')[1], 'base64');

      const folderName = "FitVerse: Gateway To Fitness";
      const newFilename = `${folderName}/blogImage/${id}/${Date.now()}_${filenamePrefix}.png`;


      const newFile = bucket.file(newFilename);
      const stream = newFile.createWriteStream({
        metadata: {
          contentType: 'image/png',
        },
      });

      stream.on("error", (err) => {
        throw new Error(STATUS_MESSAGES.IMAGE_ERROR);
      });

      return new Promise((resolve, reject) => {
        stream.on("finish", async () => {
          try {
            const [url] = await newFile.getSignedUrl({
              action: "read",
              expires: "01-01-2100",
            });

            resolve({ url, filePath: newFilename });
          } catch (error) {
            reject(new Error(STATUS_MESSAGES.IMAGE_ERROR));
          }
        });

        stream.end(imageBuffer);
      });
    } catch (error) {
      throw new Error(STATUS_MESSAGES.IMAGE_ERROR);
    }
};



  const deleteImage = async (filePath) => {
    const file = bucket.file(filePath);
    file.delete().catch(err => console.error());
};



  module.exports = { uploadImage, uploadBlogImage, deleteImage };