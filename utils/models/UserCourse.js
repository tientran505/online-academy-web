import mongoose from 'mongoose';

export default new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'User',
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'User',
  },

  registerDate: {
    type: Date,
    require: true,
  },
});
