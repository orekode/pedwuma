
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


export const timeInSec = () => {
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    return currentTimeInSeconds;
}

export const uploadFile = async (path, fileBlob) => {

    const rootStorage = getStorage();

    const fileRef     = ref(rootStorage, `${path}_${timeInSec()}.${getExtension(fileBlob)}` );

    const file        = await uploadBytes(fileRef, fileBlob);

    const uploadPath  = await getDownloadURL(file.ref);

    return uploadPath;

};

export const getExtension = (blob) => {
    const mimeType = blob.type;
    const extension = mimeType.split('/').pop();
  
    return extension;
}

export const isImage = (file) => {
    const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/svg+xml', 'image/webp'];
    return validMimeTypes.includes(file.type);
}

export const isImageExtension = (extension) => {
    const validMimeTypes = ['jpeg', 'png', 'gif', 'bmp', 'svg+xml', 'webp', 'jpg'];
    return validMimeTypes.includes(extension);
}

export const getThumbnail = (file) => {
    const thumbnailPaths = {
        'application/pdf':      '/images/pdf.webp',
        'application/msword':   '/images/docx.png',
        'application/excel':    '/images/xcel.jpg',
        'generic':              '/images/doc.png'
    };

    if(isImage(file)) {
        return URL.createObjectURL(file);
    }
    
    const thumbnail = thumbnailPaths[file.type] ? thumbnailPaths[file.type] : thumbnailPaths['generic'];

    return thumbnail;
}


export const getUrlThumbnail = (url) => {

    const thumbnailPaths = {
        'pdf':      '/images/pdf.webp',
        'msword':   '/images/docx.png',
        'excel':    '/images/xcel.jpg',
        'generic':  '/images/doc.png',
        'png':      '',
        'jpeg':     '',
        'gif':      '',
        'bmp':      '',
        'svg+xml':  '',
        'webp':     '',
        'jpg':      '',
    };

    // Check if the URL ends with a recognized file extension
    const fileExtension = url.slice(((url.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();


    const fileTypes = Object.keys(thumbnailPaths);

    const ext = fileTypes.filter( item => fileExtension.indexOf(item) >= 0);

    if(ext.length <= 0) return thumbnailPaths['generic'];

    if(isImageExtension(ext[0])) return url;

    const thumbnail = thumbnailPaths[ext[0]] ? thumbnailPaths[ext[0]] : thumbnailPaths['generic'];

    return thumbnail;
}