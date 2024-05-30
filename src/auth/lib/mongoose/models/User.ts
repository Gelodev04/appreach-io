import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI as string);
mongoose.Promise = global.Promise;

const appLoginSchema = new mongoose.Schema({
  username: { type: String, required: true },
  currentLogin: { type: Date, required: true },
  lastLogin: { type: Date, required: true },
  password: { type: String, required: true },
  adminView: { type: Boolean, required: true },
  verified: { type: Boolean, required: true },
  approved: { type: Boolean, required: true },
  view: { type: String, required: true },
});

const resetPasswordSchema = new mongoose.Schema({
  lastReset: { type: Date, required: true },
  token: { type: String, default: null },
  tokenExpiration: { type: Date, default: null },
});

const verificationSchema = new mongoose.Schema({
  lastSent: { type: Date, required: true },
  token: { type: String, required: true },
  tokenExpiration: { type: Date, required: true },
  verifiedOn: { type: Date, required: true },
});

const lookerStudioSchema = new mongoose.Schema({
  embedUrl: { type: String, required: true },
  hasToRegenerate: { type: Boolean, required: true },
});

const approvalSchema = new mongoose.Schema({
  lastSent: { type: Date, required: true },
  token: { type: String, required: true },
  tokenExpiration: { type: Date, required: true },
  verifiedOn: { type: Date, required: true },
});

const seedsSchema = new mongoose.Schema({
  assignedCount: { type: Number, required: true },
});

const userSchema = new mongoose.Schema({
  appLogin: { type: appLoginSchema, required: true },
  hosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Host' }],
  resetPassword: { type: resetPasswordSchema, required: true },
  verification: { type: verificationSchema, required: true },
  lookerStudio: { type: lookerStudioSchema, required: true },
  approval: { type: approvalSchema, required: true },
  seeds: { type: seedsSchema, required: true },
});

const User = mongoose.models.modelName || mongoose.model('User', userSchema);
export default User;
