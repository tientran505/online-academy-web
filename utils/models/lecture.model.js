import mongoose from 'mongoose';

const dType = mongoose.Schema.Types;

const lectureSchema = new mongoose.Schema({
  title: {
    type: dType.String,
    require: true,
  },

  url: {
    type: dType.String,
  },
});

export default mongoose.model('Lecture', lectureSchema);
