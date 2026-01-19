import User from "../models/user.js";
import Attendance from "../models/attendance.js";
import Leave from "../models/leave.js";

export async function handleGetUserInfo(req, res) {
    try {
        const { userId } = req.user;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const user = await User.findById(userId).select("leaveBalance");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOne({
            employeeId: userId,
            date: today
        }).select("checkin checkout date status");

        const leaves = await Leave.find({ employeeId: userId })
            .sort({ createdAt: -1 }).limit(3);

        return res.status(200).json({
            leaveBalance: user.leaveBalance,
            attendance,
            leaves,
        });
    } catch (error) {
        console.error("handleUserInfo error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export async function handleGetProfile(req, res) {
    try {
        const { userId } = req.user;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            user,
        });
    } catch (error) {
        console.error("handleGetProfile error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export async function handleCheckIn(req, res) {
    try {
        const { userId } = req.user;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let attendance = await Attendance.findOne({
            employeeId: userId,
            date: today,
        });

        if (attendance?.status === "PRESENT") {
            return res.status(400).json({
                message: "Already checked in today",
            });
        }

        if (!attendance) {
            console.log(userId);
            attendance = await Attendance.create({
                employeeId: userId,
                date: today,
                checkin: new Date(),
                status: "PRESENT"
            });
        } else {
            attendance.checkin = new Date();
            await attendance.save();
        }

        return res.status(200).json({
            message: "Check-in successful",
            attendance,
        });
    } catch (error) {
        console.error("handleCheckIn error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export async function handleCheckOut(req, res) {
    try {
        const { userId } = req.user;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOne({
            employeeId: userId,
            date: today,
        });

        if (!attendance || !attendance.checkin) {
            return res.status(400).json({
                message: "You have not checked in today",
            });
        }

        if (attendance.checkout) {
            return res.status(400).json({
                message: "Already checked out today",
            });
        }

        attendance.checkout = new Date();
        await attendance.save();

        return res.status(200).json({
            message: "Check-out successful",
            attendance,
        });
    } catch (error) {
        console.error("handleCheckOut error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}


export async function handleGetRemainingLeave(req, res) {
    try {
        const { userId } = req.user;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const user = await User.findById(userId).select("leaveBalance");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            leaveBalance: user.leaveBalance,
        });
    } catch (error) {
        console.error("handleGetRemainingLeave error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export async function handleApplyLeave(req, res) {
    try {
        const { userId } = req.user;
        const { leaveType, startDate, endDate, reason } = req.body;
        console.log(leaveType);
        if (!leaveType || !startDate || !endDate) {
            return res.status(400).json({
                message: "Leave type, start date and end date are required",
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start) || isNaN(end) || end < start) {
            return res.status(400).json({
                message: "Invalid date range",
            });
        }

        const days =
            Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

        const available = user.leaveBalance?.[leaveType];

        if (available === undefined) {
            return res.status(400).json({
                message: "Invalid leave type",
            });
        }

        if (days > available) {
            return res.status(400).json({
                message: `Insufficient ${leaveType} leave balance`,
            });
        }

        const leave = await Leave.create({
            employeeId: userId,
            leaveType,
            startDate: start,
            endDate: end,
            totalDays: days,
            reason: reason?.trim() || null,
            status: "PENDING",
        });

        return res.status(201).json({
            message: "Leave request submitted successfully",
            leave,
        });
    } catch (error) {
        console.error("handleApplyLeave error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}


export async function handleGetLeaveHistory(req, res) {
    try {
        const { userId } = req.user;
        const { size } = req.query;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        let query = Leave.find({ employeeId: userId }).sort({ createdAt: -1 });

        if (size !== undefined) {
            const limit = Number(size);

            if (isNaN(limit) || limit <= 0) {
                return res.status(400).json({
                    message: "Invalid size value",
                });
            }

            query = query.limit(limit);
        }

        const leaves = await query;

        return res.status(200).json({
            leaves,
        });
    } catch (error) {
        console.error("handleGetLeaveHistory error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}



export async function handleCancelLeave(req, res) {
    try {
        const { userId } = req.user;
        const { id: leaveId } = req.body;

        if (!leaveId) {
            return res.status(400).json({
                message: "Leave ID is required",
            });
        }

        const leave = await Leave.findOne({
            _id: leaveId,
            employeeId: userId,
        });

        if (!leave) {
            return res.status(404).json({
                message: "Leave request not found",
            });
        }

        if (leave.status !== "PENDING") {
            return res.status(400).json({
                message: "Only pending leave requests can be cancelled",
            });
        }

        leave.status = "cancelled";
        await leave.save();

        return res.status(200).json({
            message: "Leave request cancelled successfully",
            leave,
        });
    } catch (error) {
        console.error("handleCancelLeave error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}


export async function handleGetAttendance(req, res) {
    try {
        const { userId } = req.user;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const attendance = await Attendance.find({ employeeId : userId })
            .sort({ date: -1 });

        return res.status(200).json({
            attendance,
        });
    } catch (error) {
        console.error("handleGetAttendance error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}
