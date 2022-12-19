import mongoose from 'mongoose';

const dType = mongoose.Schema.Types;

const sectionSchema = new mongoose.Schema({
  title: {
    type: dType.String,
    require: true,
  },

  lectures: {
    type: [
      {
        lecture: dType.ObjectId,
        created_date: dType.Date,
      },
    ],
    ref: 'Lecture',
  },
});

export default mongoose.model('Section', sectionSchema);
