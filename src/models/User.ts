import mongoose, { Document, Model } from 'mongoose';
import crypto from 'crypto';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  country: string;
  region: string;
  createdAt: Date;
  correctPassword(candidatePassword: string): boolean;
  hasCompletedProfile: boolean;
  farmProfile: mongoose.Types.ObjectId;
}

interface UserModel extends Model<IUser> {
  // Remove this method from the static interface since we're using instance method
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
  },
  country: {
    type: String,
    required: [true, 'Please select a country'],
  },
  region: {
    type: String,
    required: [true, 'Please select a region'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  hasCompletedProfile: {
    type: Boolean,
    default: false,
  },
  farmProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FarmProfile',
  },
});

// Hash password before saving
userSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    // Create a hash using SHA-256
    const hash = crypto.createHash('sha256');
    hash.update(this.password);
    this.password = hash.digest('hex');
    console.log('Password hashed successfully');
    next();
  } catch (error) {
    console.error('Password hashing error:', error);
    next(error as Error);
  }
});

// Method to check if password matches
userSchema.methods.correctPassword = function(
  candidatePassword: string
): boolean {
  try {
    console.log('Comparing passwords');
    
    if (!candidatePassword || !this.password) {
      console.error('Missing password for comparison');
      return false;
    }
    
    // Hash the candidate password and compare
    const hash = crypto.createHash('sha256');
    hash.update(candidatePassword);
    const hashedPassword = hash.digest('hex');
    
    const isMatch = this.password === hashedPassword;
    console.log('Password match result:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User; 