import mongoose from 'mongoose';

const dType = mongoose.Schema.Types;

const courseSchema = mongoose.Schema({
  img: {
    type: dType.String,
    require: true,
  },

  course_name: {
    type: dType.String,
    require: true,
  },

  author: {
    type: dType.ObjectId,
    require: true,
    ref: 'User',
  },

  brief_description: {
    type: dType.String,
    require: true,
  },

  detail_description: {
    type: dType.String,
    require: true,
  },

  category: {
    type: dType.ObjectId,
    require: true,
    ref: 'Sub-category',
  },

  price: {
    type: dType.Number,
    require: true,
  },

  sale: {
    type: dType.Number,
    require: true,
  },

  last_access: {
    type: dType.Date,
    require: true,
  },

  is_completed: {
    type: dType.Boolean,
    require: true,
  },
  view_counts: {
    type: dType.Number,
    require: true,
  },

  cateName: {
    type: String,
  },
  disable: {
    type: dType.Boolean,
    require: true,
  },
});

export default mongoose.model('Course', courseSchema);
