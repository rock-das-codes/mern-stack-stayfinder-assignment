import Imagekit from "imagekit"
import path from "path"
import fs from "fs"
import { promises as fsPromises } from "fs" // Added for async unlink

//configure imagekit
const imagekit = new Imagekit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
})

const getContentType = (fileExtension) => {
    if (typeof fileExtension !== 'string' || !fileExtension) {
        return "application/octet-stream";
    }
    const normalizedExtension = fileExtension.toLowerCase();
    switch (normalizedExtension) {
        case ".jpg":
            return "image/jpg"
        case ".jpeg":
            return "image/jpeg";
        case ".png":
            return "image/png";
        case ".gif":
            return "image/gif";
        case ".webp":
            return "image/webp";
        case ".svg":
            return "image/svg+xml";
        case ".pdf":
            return "application/pdf";
        case ".mp4":
            return "video/mp4";
        case ".webm":
            return "video/webm";
        case ".ogg":
            return "video/ogg";
        case ".mp3":
            return "audio/mpeg";
        case ".wav":
            return "audio/wav";
        case ".doc":
            return "application/msword";
        case ".docx":
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        case ".xls":
            return "application/vnd.ms-excel";
        case ".xlsx":
            return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        case ".ppt":
            return "application/vnd.ms-powerpoint";
        case ".pptx":
            return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
        case ".txt":
            return "text/plain";
        case ".html":
            return "text/html";
        case ".css":
            return "text/css";
        case ".js":
            return "application/javascript";
        case ".json":
            return "application/json";
        default:
            return "application/octet-stream";
    }
};

const uploadOnImagekit = async (localFilePath) => {
    if (!localFilePath) {
        return null;
    }
    const originalFileNameWithExt = path.basename(localFilePath);
    const originalFileNameWithOutExt = path.parse(originalFileNameWithExt).name;
    try {
        const fileExtension = path.extname(localFilePath).toLowerCase();
        const contentType = getContentType(fileExtension);
        const uniqueFileName = `${originalFileNameWithOutExt.replace(/[^a-zA-Z0-9-]/g, '_')}-${Date.now()}${fileExtension}`;

        console.log(`Attempting to upload file: ${localFilePath}`);
        console.log(`Desired ImageKit file name: ${uniqueFileName}`);
        console.log(`Detected Content-Type: ${contentType}`);

        const response = await imagekit.upload({
            file: fs.createReadStream(localFilePath),
            fileName: uniqueFileName,
            // contentType is not a documented option for imagekit.upload, but you can keep it if your SDK supports it
        });
        console.log("File uploaded successfully on ImageKit!");
        console.log("ImageKit Response:", response);
        return response;
    } catch (error) {
        console.error(`Error uploading file to ImageKit from ${localFilePath}:`, error);
        return null;
    } finally {
        if (fs.existsSync(localFilePath)) {
            try {
                await fsPromises.unlink(localFilePath);
                console.log(`Successfully removed local temporary file: ${localFilePath}`);
            } catch (unlinkError) {
                console.error(`Error removing local temporary file ${localFilePath}:`, unlinkError);
            }
        }
    }
}

export { uploadOnImagekit }