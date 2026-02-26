const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Tentukan path folder temp secara absolut
const tempDir = path.join(process.cwd(), "temp");

/**
 * LOGIKA AUTO-CREATE FOLDER
 * Mengecek apakah folder 'temp' sudah ada, jika belum maka buat otomatis.
 * 'recursive: true' memastikan tidak ada error jika folder sudah ada.
 */
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
  console.log(">>> Folder 'temp' created automatically for uploads.");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "temp/"); // Multer akan menyimpan file di sini sementara
  },
  filename: (req, file, cb) => {
    // Memberikan nama unik agar tidak tertimpa jika nama file sama
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/mpeg",
      "video/quicktime",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file gambar dan video yang diperbolehkan!"), false);
    }
  },
});

module.exports = upload;