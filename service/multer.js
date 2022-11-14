import multer from "multer";




export const validationType = {
    Image: ["image/png", "image/jpg", "image/jpeg"]
}

export function HM(error, req, res, next) {
    if (error) {
        res.json({ message: "multer error message", error })
    } else {
        next();
    }
}


export default function myMulter(acceptType) {


    const storage = multer.diskStorage({

    })

    function fileFilter(req, file, cb) {
        if (acceptType.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb("invalid image format", false);
        }
    }
    const upload = multer({ dest: "uploads", fileFilter, storage });
    return upload;
}
