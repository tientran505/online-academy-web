import mongoose from 'mongoose';

const dType = mongoose.Schema.Types;

const subCategorySchema = mongoose.Schema(
  {
    title: {
      type: dType.String,
      require: true,
    },

    category: {
        type: dType.ObjectId,
        require: true,
        ref: 'Category'
    }
    
  },
  {
    collection: 'sub_categories',
  }
);

export default mongoose.model('Sub-category', subCategorySchema);
