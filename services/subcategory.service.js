import subCategoryModel from '../utils/models/sub-category.model.js';

export default {
  findSubcategory(title) {
    return subCategoryModel.findOne({ title });
  },

  findSubcategoryById(id) {
    return subCategoryModel.findById(id).populate('category');
  },

  createSubCategory(title, category) {
    return subCategoryModel.create({
      title,
      category,
    });
  },

  patch(id, title) {
    return subCategoryModel.findByIdAndUpdate(id, { title });
  },

  delByCat(id) {
    return subCategoryModel.deleteMany({ category: id });
  },

  del(id) {
    return subCategoryModel.findByIdAndDelete(id);
  },
};
