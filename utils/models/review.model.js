import mongoose from 'mongoose';

const dType = mongoose.Schema.Types;

const reviewSchema = mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  content: {
    type: String,
  },

  rating: {
    type: dType.Number,
  },
});

export default mongoose.model('Review', reviewSchema);
