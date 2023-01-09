import mongoose from 'mongoose';

const dType = mongoose.Schema.Types;

const categorySchema = mongoose.Schema(
  {
    code: {
      type: String,
      require: true,
    },

    user: {
      type: dType.ObjectId,
      require: true,
      ref: 'User',
    },
  },
  {
    collection: 'otp_emails',
  }
);

export default mongoose.model('Category', categorySchema);
