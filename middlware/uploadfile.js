import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = "./uploads";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + path.extname(file.originalname));
  },
});
//////////////////////////////////////
const filterProfilePicture = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    return cb(null, true);
  } else {
    return cb(new Error("Invalid file type"));
  }
};
const uploadProfilePicture = multer({
  storage: storage,
  fileFilter: filterProfilePicture,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});
/////////////////////////////

const filterExcel = (req, file, cb) => {
  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    return cb(null, true);
  } else {
    return cb(new Error("Invalid file type"));
  }
};

const uploadExcel = multer({
  storage: storage,
  fileFilter: filterExcel,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

///////////////////////





const filterProductImages = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    return cb(null, true);
  } else {
    return cb(new Error("Invalid file type"));
  }
};

const uploadProductImages = multer({
  storage: storage,
  fileFilter: filterProductImages,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

export {uploadProfilePicture, uploadExcel, uploadProductImages};
