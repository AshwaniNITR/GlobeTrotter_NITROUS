import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password?: string; // Optional for Google users
  isVerified: boolean;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
  refreshToken?: string; // Only storing refresh token
  authProvider: 'email' | 'google';
  googleId?: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { 
      type: String, 
      required: true, 
      trim: true,
      unique: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    password: { 
      type: String,
      required: function() {
        return this.authProvider === 'email';
      },
      select: false,
      minlength: [8, 'Password must be at least 8 characters']
    },
    isVerified: { 
      type: Boolean, 
      default: false 
    },
    verifyToken: { 
      type: String,
      select: false 
    },
    verifyTokenExpiry: { 
      type: Date,
      select: false 
    },
    refreshToken: {
      type: String,
      select: false
    },
    authProvider: { 
      type: String,
      enum: ['email', 'google'],
      default: 'email',
      required: true 
    },
    googleId: { 
      type: String,
      unique: true,
      sparse: true 
    },
    profilePicture: { 
      type: String 
    }
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        // Remove sensitive fields in API responses
        delete ret.password;
        delete ret.refreshToken;
        delete ret.verifyToken;
        delete ret.verifyTokenExpiry;
        return ret;
      }
    }
  }
);

// Virtual for token expiration policy (not stored in DB)
userSchema.virtual('tokenPolicy').get(function() {
  return {
    accessTokenExpiry: '15m',  // 15 minutes
    refreshTokenExpiry: '7d'   // 7 days
  };
});

// Model initialization
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;