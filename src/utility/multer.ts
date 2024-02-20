import multer from "multer";

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + "_" + file.originalname);
  },
});

export const multipleUpload = (name: string | "images", length: number) =>
  multer({ storage: imageStorage }).array(name, length);

export const singleUpload = (name?: string) =>
  multer({ storage: imageStorage }).single(name || "image");
