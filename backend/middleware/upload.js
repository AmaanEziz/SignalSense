const util = require("util");
const multer = require("multer");
const os = require("os");
const userHome = os.homedir();
const maxSize = 2 * 1024 * 1024;
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, userHome + "/SignalSenseFiles/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    let filename = req.fileName;
    console.log(`File name recived by upload.js ${filename}`);
    cb(null, filename);
  },
});
let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");
let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;