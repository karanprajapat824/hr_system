import User from "./../models/user.js";
import Leave from "./../models/leave.js";
import Attendance from "./../models/attendance.js";

export async function handleGetDashbord(req, res) {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalEmployees = await User.countDocuments({
            role: "EMPLOYEE",
        });

        const pendingLeaves = await Leave.find({
            status: "PENDING",
        })
            .populate("employeeId", "name")
            .select("leaveType startDate endDate reason")
            .sort({ createdAt: -1 });

        const presentToday = await Attendance.countDocuments({
            status: "PRESENT",
            date: today,
        });

        return res.status(200).json({
            totalEmployees,
            pendingRequests: pendingLeaves.length,
            presentToday,
            pendingLeaves,
        });
    } catch (error) {
        console.error("handleGetDashboard error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export async function handleLeaveStatus(req, res) {
    try {
        const { id, status, userId } = req.query;

        if (!id || !status) {
            return res.status(400).json({
                message: "Leave id and status are required",
            });
        }

        const allowedStatus = ["PENDING", "APPROVED", "REJECTED", "CANCELLED"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid status value",
            });
        }

        const leave = await Leave.findById(id);

        if (!leave) {
            return res.status(404).json({
                message: "Leave request not found",
            });
        }

        if (leave.status === "APPROVED" || leave.status === "REJECTED") {
            return res.status(400).json({
                message: "Leave status already finalized",
            });
        }

        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "user not found" });

        switch (leave.leaveType) {
            case "CASUAL":
                user.leaveBalance.casual = user.leaveBalance.casual - leave.totalDays;
                break;
            case "SICK":
                user.leaveBalance.sick = user.leaveBalance.sick - leave.totalDays;
                break;
            case "PAID":
                user.leaveBalance.paid = user.leaveBalance.paid - leave.totalDays;
                break;
        }

        await user.save();
        leave.status = status;
        await leave.save();

        return res.status(200).json({
            message: "Leave status updated successfully",
            leave,
        });
    } catch (error) {
        console.error("handleLeaveStatus error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}



export async function handleEmployeesData(req, res) {
  try {
    const users = await User.find(
      {role : "EMPLOYEE"}, 
      "-password -refreshToken -__v" 
    ).sort({ createdAt: -1 });

    return res.status(200).json({
      users,
    });
  } catch (error) {
    console.error("handleEmployeesData error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}


export async function handleGetAttendance(req, res) {
  try {
    const attendance = await Attendance.find()
      .populate("employeeId", "name email")
      .sort({ date: -1 });

    const formatted = attendance.map((a) => ({
      id: a._id,
      date: a.date,
      checkin: a.checkin,
      checkout: a.checkout,
      status: a.status,
      employee: {
        name: a.employeeId?.name || "",
        email: a.employeeId?.email || "",
      },
    }));

    return res.status(200).json({
      attendance: formatted,
    });
  } catch (error) {
    console.error("handleGetAttendance error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

