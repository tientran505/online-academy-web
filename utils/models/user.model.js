import mongoose from 'mongoose';

const dType = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  img: {
    type: dType.String,
  },

  username: {
    type: dType.String,
    require: true,
  },

  password: {
    type: dType.String,
    require: true,
  },

  name: {
    type: dType.String,
  },

  email: {
    type: dType.String,
    require: true,
  },

  gender: {
    type: dType.String,
  },

  birthday: {
    type: dType.Date,
  },

  role: {
    type: dType.String,
    require: true,
  },

  session: {
    type: String,
  },

  status: {
    type: String,
  },

  registered_courses: {
    type: [dType.ObjectId],
    ref: 'Course',
  },

  favorite_courses: {
    type: [dType.ObjectId],
    ref: 'Course',
  },

  study_tracking: {
    type: dType.ObjectId,
    ref: 'Tracking',
  },
});

export default mongoose.model('User', userSchema);
