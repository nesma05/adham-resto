const mongoose = require('mongoose');
const path = require('path');

const avatarImagePath = 'uploads/team';

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  job: {
    type: String,
    required: true,
  },
  avatarImageName: {
    type: String,
    required: true,
  },
});

teamMemberSchema.virtual('avatarImagePath').get(function () {
  if (this.avatarImageName) {
    return path.join('/', avatarImagePath, this.avatarImageName);
  }
});

module.exports = mongoose.model('TeamMember', teamMemberSchema);

module.exports.avatarImagePath = avatarImagePath;
