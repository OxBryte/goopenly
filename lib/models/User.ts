import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  walletAddress?: string;
  clerkId?: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  avatar?: string;
  blockradarWalletId?: string;
  isOnboardingComplete: boolean;
  isDeleted?: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface UserModel extends Model<IUser> {
  findByWalletAddress(walletAddress: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findOrCreate(walletAddress: string, email?: string): Promise<IUser>;
  updateOnboardingStatus(walletAddress: string, status: boolean): Promise<IUser | null>;
  updateProfile(walletAddress: string, updates: Partial<IUser>): Promise<IUser | null>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    walletAddress: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      index: true,
    },
    clerkId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Don't return password by default
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    avatar: {
      type: String,
      trim: true,
    },
    blockradarWalletId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    isOnboardingComplete: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

UserSchema.statics.findByWalletAddress = async function (walletAddress: string) {
  return this.findOne({ walletAddress });
};

UserSchema.statics.findByEmail = async function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

UserSchema.statics.findOrCreate = async function (walletAddress: string, email?: string) {
  let user = await this.findByWalletAddress(walletAddress);
  if (!user) {
    user = await this.create({ walletAddress, email });
  } else if (email && !user.email) {
    // Update email if it's provided and not already set
    user.email = email;
    await user.save();
  }
  return user;
};

UserSchema.statics.updateOnboardingStatus = async function (walletAddress: string, status: boolean) {
  return this.findOneAndUpdate(
    { walletAddress },
    { $set: { isOnboardingComplete: status } },
    { new: true }
  );
};

UserSchema.statics.updateProfile = async function (walletAddress: string, updates: Partial<IUser>) {
  return this.findOneAndUpdate(
    { walletAddress },
    { $set: updates },
    { new: true }
  );
};

export const User = (mongoose.models.User || mongoose.model<IUser, UserModel>('User', UserSchema)) as UserModel;