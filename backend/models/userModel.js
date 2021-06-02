import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// userSchema is for creating a company/owner
// aswell as the staff members for the companies
const userSchema = mongoose.Schema(
  {
    name: {
      // Owner & Staff
      type: String,
      required: true,
    },
    email: {
      // Owner & Staff
      type: String,
      required: true,
      unique: true,
    },
    password: {
      // Staff & Owner
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isOwner: {
      // Owner
      type: Boolean,
      required: true,
      default: false,
    },
    isAdmin: {
      // Staff
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
