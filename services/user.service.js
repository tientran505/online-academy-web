import userModel from '../utils/models/user.model.js';
import mongoose from 'mongoose';

export default {
  findById(id) {
    return userModel.findById(id);
  },

  updateStatus(id, status) {
    return userModel.findByIdAndUpdate(id, {
      status,
    });
  },

  del(id) {
    return userModel.findByIdAndDelete(id);
  },

  insertFavoriteCourse(id, idCourse) {
    return userModel.findByIdAndUpdate(id, {$push: {favorite_courses: mongoose.Types.ObjectId(idCourse)}});
  },

  insertRegisteredCourse(id, idCourse) {
    return userModel.findByIdAndUpdate(id, {$push: {registered_courses: mongoose.Types.ObjectId(idCourse)}});
  },

  checkHeart(id, idCourse) {
    return userModel.findOne({_id: id, favorite_courses: idCourse});
  },

  checkRegistered(id, idCourse) {
    return userModel.findOne({_id: id, registered_courses: idCourse});
  },

  removeFavoriteCourse(id, idCourse) {
    return userModel.findByIdAndUpdate(id, {$pull: {favorite_courses: mongoose.Types.ObjectId(idCourse)}});
  },

  findByIdAndUpdate(id, name, password, email) {
    return userModel.findByIdAndUpdate(id, {
      name,
      password,
      email,
    });
  },
};
