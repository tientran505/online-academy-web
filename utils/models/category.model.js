import mongoose from 'mongoose';

const dType = mongoose.Schema.Types;

const categorySchema = mongoose.Schema(
  {
    title: {
      type: dType.String,
      require: true,
    },
  },
  {
    collection: 'categories',
  }
);

export default mongoose.model('Category', categorySchema);
