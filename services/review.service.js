import reviewModel from '../utils/models/review.model.js';

export default {
  createOne(review) {
    return reviewModel.create(review);
  },

  getReviewById(id) {
    return reviewModel.find({ course: id }).populate('user');
  },

  getCountRatingByStar(id, star) {
    return reviewModel.find({ course: id, rating: star }).count();
  },

  getCountRating(id) {
    return reviewModel.find({ course: id }).count();
  },

  findCondition(id, offset, limit) {
    return reviewModel
      .find({ course: id })
      .sort({ _id: -1 })
      .skip(offset)
      .limit(limit);
  },
};
