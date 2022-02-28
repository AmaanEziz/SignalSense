const uploadFile = require("../middleware/upload");
const os = require("os");
const userHome = os.homedir();
const upload = async (req, res) => {
    console.log("Hi from Controller");
    try {
      await uploadFile(req, res);
      if (req.file == undefined) {
        return res.status(400).send({ message: "Please upload a file!" });
      }
      res.status(200).send({
        message: "Uploaded the file successfully: " + req.file.originalname,
      });
    } catch (err) {
      res.status(500).send({
        message: `Could not upload the file: ${req.file.originalname}. ${err}`,
      });
    }
  };
  const getListFiles = (req, res) => {
    const directoryPath = userHome + "/SignalSenseFiles/resources/static/assets/uploads/";
    fs = require('fs');
    fs.readdir(directoryPath, function (err, files) {
      if (err) {
        res.status(500).send({
          message: "Unable to scan files!",
        });
      }
      let fileInfos = [];
      files.forEach((file) => {
        fileInfos.push({
          name: file,
          url: file,
        });
      });
      res.status(200).send(fileInfos);
    });
  };
  const download = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = userHome + "/SignalSenseFiles/resources/static/assets/uploads/";
    res.sendFile(directoryPath + fileName, fileName, (err) => {
      if (err) {
        res.status(500).send({
          message: "Could not download the file. " + err,
        });
      }
    });
  };
  module.exports = {
    upload,
    getListFiles,
    download,
  };