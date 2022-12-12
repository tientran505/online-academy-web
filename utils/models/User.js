import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },

  password: {
    type: String,
    require: true,
  },

  email: {
    type: String,
    require: true,
  },

  birthday: {
    type: Date,
    require: true,
  },

  image: {
    type: String,
  },

  displayName: {
    type: String,
  },
});

export default mongoose.model('Student', studentSchema);
