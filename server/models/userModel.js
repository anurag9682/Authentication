import mangoose from "mongoose";

const userSchema = new mangoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verifyOtp: { type: String, default: "" },
  verifyOtpExpiryAt: { type: number, default: 0 },

  isAccountVerified: { type: Boolean, default: false },

  resetOtp: { type: String, default: "" },
  resetOtpExpiryAt: { type: number, default: 0 },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
