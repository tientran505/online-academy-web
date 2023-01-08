import categoryModel from '../utils/models/category.model.js';

export default {
  findAll() {
    return categoryModel.find();
  },

  findCategory(title) {
    return categoryModel.findOne({ title });
  },

  findCategoryById(id) {
    return categoryModel.findById(id);
  },

  async createCategory(title) {
    const cate = await this.findCategory(title);

    if (cate) {
      return null;
    }

    return categoryModel.create({
      title,
    });
  },

  patch(id, title) {
    return categoryModel.findByIdAndUpdate(id, {
      title,
    });
  },

  del(id) {
    return categoryModel.findByIdAndDelete(id);
  },
};
