import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
  earnings: { type: Number, default: 0 }
}, { timestamps: true });
const User = mongoose.models.User || mongoose.model('User', userSchema);

export { User };
export default User;
