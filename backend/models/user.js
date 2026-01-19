import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    department: {
      type: String
    },

    role: {
      type: String,
      enum: ["EMPLOYEE", "ADMIN"],
      default: "EMPLOYEE",
      uppercase : true
    },

    dateOfJoining: {
      type: Date,
      required: true,
      default: Date.now()
    },

    leaveBalance: {
      casual: {
        type: Number,
        default: 8,
        min: 0
      },
      sick: {
        type: Number,
        default: 10,
        min: 0
      },
      paid: {
        type: Number,
        default: 2,
        min: 0
      }
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
