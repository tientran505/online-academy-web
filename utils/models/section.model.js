import mongoose from 'mongoose';

const dType = mongoose.Schema.Types;

const sectionSchema = new mongoose.Schema({
  title: {
    type: dType.String,
    require: true,
  },
  course_id: {
    type: dType.ObjectId,
    require: true,
    ref: 'Course',
  },
  lectures:
     [
      {
        type: dType.ObjectId,
        ref: 'Lecture',
        // created_date: dType.Date,
      },
    ],


});

export default mongoose.model('Section', sectionSchema);
