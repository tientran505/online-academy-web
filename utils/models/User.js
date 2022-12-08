import mongoose from 'mongoose';

export default new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Please add a name'],
  },

  email: {
    type: String,
    require: [true, 'Please add an email'],
    unique: true,
  },

  phone: {
    type: String,
  },

  birthday: {
    type: Date,
  },

  password: {
    type: String,
    require: [true, 'Please add a password'],
  },
});
