const path = require('path');
const fs = require('fs/promises');

const { basedir } = global;
const { User } = require('../models/user');
const  CreateError  = require("../utils/createError");
const  styleImage  = require('../utils/styleImage');

const avatarDir = path.join(basedir, 'public', 'avatars');

const setAvatar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { path: tempPath, originalname } = req.file;
    const [extention] = originalname.split('.').reverse();
    const newName = `${_id}.${extention}`;

    const uploadPath = path.join(avatarDir, newName);
    await styleImage(tempPath);
    await fs.rename(tempPath, uploadPath);

    const avatarURL = path.join('avatars', newName);

    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({
      avatarURL,
    });
  } catch (error) {
    await fs.unlink(req.file.path);
    throw new CreateError(401, 'Not authorized');
  }
};

module.exports = setAvatar;