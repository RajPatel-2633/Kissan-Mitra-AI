import multer from "multer";
import path from "path";
import {v2 as cloudinary} from "cloudinary";
import {CloudinaryStorage} from "multer-storage-cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder:'kissan-mitra-crop-scans',
        allowed_formats:['jpg','jpeg','png'],
        public_id:(req,file)=>{
            const fileName = path.parse(file.originalname).name.replace(/\s+/g, '_');
            return `${fileName}_${Date.now()}`;
        }

    }
});


export const uploadCropImage = multer({
    storage:storage,
    limits:{fileSize:5*1024*1024}
}).single('crop_image');