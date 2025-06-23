import Imagekit from "imagekit"
import path from "path"
import fs from "fs"

//configure imagekit

const imagekit =new Imagekit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
})

const getContentType = (fileExtension) => {
    // Ensure the extension is a string and handle case variations
    if (typeof fileExtension !== 'string' || !fileExtension) {
        return "application/octet-stream";
    }
    const normalizedExtension = fileExtension.toLowerCase();

    // *** IMPORTANT: You need to expand this for your assignment ***
    // Add many more cases for common file types (pdf, mp4, docx, etc.)
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
        // Default for unknown types
        default:
            return "application/octet-stream";
    }
};

const uploadOnImagekit = async (localfilepath)=>{
    const originalFileNameWithExt = path.basename(localfilepath || " ")

    const originalFileNameWithOutExt = path.parse(originalFileNameWithExt).name;

    if(!localfilepath){
        return null
    }
    try {
        const fileExtension = path.extname(localfilepath).toLowerCase()
        const ContentType = getContentType(fileExtension)
        const uniqueFileName = `${originalFileNameWithoutExt.replace(/[^a-zA-Z0-9-]/g, '_')}-${Date.now()}${fileExtension}`;

          console.log(`Attempting to upload file: ${localFilePath}`);
        console.log(`Desired ImageKit file name: ${uniqueFileName}`);
        console.log(`Detected Content-Type: ${contentType}`);


        const response =await ImageKit.upload({
             file: fs.createReadStream(localFilePath), // Efficiently stream the file
            fileName: uniqueFileName,
            contentType: contentType,
        })
        console.log("File uploaded successfully on ImageKit!");
        console.log("ImageKit Response:", response);
        return response; 
    } catch (error) {
              console.error(`Error uploading file to ImageKit from ${localFilePath}:`, error);
        // For an assignment, returning null might be acceptable if that's the expected error handling.
        // In a real-world scenario, you might re-throw a custom error here.
        return null;
    }
    finally{
        if (fs.existsSync(localFilePath)) { // Check if the file still exists before attempting to delete
            try {
                await fsPromises.unlink(localFilePath); // Use the asynchronous unlink from fs/promises
                console.log(`Successfully removed local temporary file: ${localFilePath}`);
            } catch (unlinkError) {
                console.error(`Error removing local temporary file ${localFilePath}:`, unlinkError);
                // Log the error but don't prevent the function from completing its main task
            }
        }
    }
}

export { uploadOnImagekit }