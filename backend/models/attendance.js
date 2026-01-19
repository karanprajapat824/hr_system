import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    checkin: {
      type: Date,
    },

    checkout: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["PRESENT","ABSENT"],
      required: true,
      uppercase : true
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
