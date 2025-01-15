import { log } from 'console';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert `import.meta.url` to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.resolve(__dirname, '../uploads');


const fileStorage = multer.diskStorage({
    destination : (req,file,cb) =>{
     cb(null,uploadDir);
    },
    filename: (req,file,cb) => {
        cb(null,Date.now()+'-'+file.originalname);
    }
}
);
const fileFilter = (req,file,cb) => {
    if(file.mimetype === 'image/png'  || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {

        cb(null,true);
    }else{
        cb(null,false);
    }
};

const upload=multer({ storage: fileStorage, fileFilter: fileFilter })

export default upload;
