import mongoose from 'mongoose';

const dType = mongoose.Schema.Types;

const trackingSchema = new mongoose.Schema({
  user: {
    type: dType.ObjectId,
    ref: 'User',
  },

  lectures: {
    type: [dType.ObjectId],
    ref: 'Lecture',
  },
});

export default mongoose.model('Tracking', trackingSchema);
