import mongoose from 'mongoose';

export default new mongoose.Schema({
  category: {
    type: String,
    require: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'User',
  },

  courseName: {
    type: String,
    require: [true, 'Please add a name'],
  },

  createdDate: {
    type: Date,
    require: true,
  },
});
