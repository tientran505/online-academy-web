import UserModel from '../utils/models/user.model.js';

export default {
  findById(id) {
    return UserModel.findById(id);
  },

  updateStatus(id, status) {
    return UserModel.findByIdAndUpdate(id, {
      status,
    });
  },

  del(id) {
    return UserModel.findByIdAndDelete(id);
  },
};
