import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  location: {
    city?: string;
    country?: string;
  };
  additionalInfo?: string;
  password?: string; // Optional for Google users
  isVerified: boolean;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
  refreshToken?: string;
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
      required: [true, 'Username is required'], 
      trim: true,
      unique: true,
      lowercase: true,
      match: [/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores']
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'], 
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[\d\s\+\-\(\)]+$/, 'Please use a valid phone number']
    },
    location: {
      city: {
        type: String,
        trim: true,
        maxlength: [100, 'City name cannot exceed 100 characters']
      },
      country: {
        type: String,
        trim: true,
        maxlength: [100, 'Country name cannot exceed 100 characters']
      }
    },
    additionalInfo: {
      type: String,
      trim: true,
      maxlength: [500, 'Additional info cannot exceed 500 characters']
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
      type: String,
      default: null,
      validate: {
        validator: function(v: string) {
          if (!v) return true;
          const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i;
          const cloudinaryPattern = /^https:\/\/res\.cloudinary\.com\/.+/;
          return urlPattern.test(v) || cloudinaryPattern.test(v);
        },
        message: 'Profile picture must be a valid image URL'
      }
    }
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.verifyToken;
        delete ret.verifyTokenExpiry;
        return ret;
      },
      virtuals: true
    },
    toObject: { virtuals: true }
  }
);

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ googleId: 1 }, { unique: true, sparse: true });
userSchema.index({ username: 'text', email: 'text' });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;

