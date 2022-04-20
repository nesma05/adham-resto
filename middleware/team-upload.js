const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const TeamMember = require('../models/team');
const Dish = require('../models/dish');

const uploadPath = path.join('public', 'uploads');
const imageMimeTypes = ['image/gif', 'image/jpeg', 'image/png'];

module.exports = {
  uploadFile: function (single, distinationPath) {
    return function (req, res, next) {
      let fileName;
      let errorMessage;
      const upload = multer({
        dest: uploadPath,
        limits: { fileSize: 1000000 },
        fileFilter: (res, file, callback) => {
          if (imageMimeTypes.includes(file.mimetype)) {
            callback(null, true);
          } else {
            callback('Entrez seulement des images');
          }
        },
      }).single(single);
      upload(req, res, async (err) => {
        if (err) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            errorMessage = "Taille d'image trop grande";
          } else {
            errorMessage = err;
          }
          console.log(err);
          return res.render('admin/team/add-team', {
            layout: 'layouts/admin-layout',
            page_title: 'Equipe/Ajouter',
            teamMember: new TeamMember(),
            errorMessage,
          });
        }
        if (req.file) {
          let resizeWidth;
          let resizeHeight;
          if (single == 'avatar') {
            resizeWidth = 200;
            resizeHeight = 200;
          } else {
            resizeWidth = 250;
            resizeHeight = 320;
          }
          const resizeValues = single == 'avatar' ? '400, 400' : '250, 320';
          fileName = req.file.filename;
          await sharp(req.file.path)
            .resize(resizeWidth, resizeHeight)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(path.join(distinationPath, fileName));
          fs.unlinkSync(req.file.path);
        }
        req.fileName = fileName;
        next();
      });
    };
  },
};
