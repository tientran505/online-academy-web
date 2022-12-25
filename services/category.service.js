import categoryModel from '../utils/models/category.model.js';

export default {
  findAll() {
    return categoryModel.find();
  },
};
