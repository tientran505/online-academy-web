import mongoose from "mongoose";

const dType = mongoose.Schema.Types;

const otpSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
    },

    code: {
      type: String,
      require: true,
    }

  },
  {
    collection: 'otp_emails',
  }
);

export default mongoose.model('Otp', otpSchema);
