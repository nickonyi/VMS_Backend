import { matchedData, validationResult } from "express-validator";
import passport from "../config/passportConfig.js";
import {
  loginResident,
  registerResident,
} from "../services/ascribe.service.js";
import { authenticateStaff } from "../services/authService.js";
import { findStaffByPhone } from "../repositories/userRepository.js";

export const postSignup = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const mappedErrors = {};

      errors.array().forEach((err) => {
        if (!mappedErrors[err.path]) {
          mappedErrors[err.path] = err.msg;
        }
      });

      return res.status(400).json({
        success: false,
        errors: mappedErrors,
      });
    }

    const { fullName, phone, password } = matchedData(req);

    const ascribeResponse = await registerResident({
      resident_name: fullName,
      resident_phone: phone,
      resident_password: password,
    });

    if (!ascribeResponse.ok) {
      return res.status(ascribeResponse.status).json({
        success: false,
        message: "Unable to create resident account",
        error: ascribeResponse.data,
      });
    }

    const resident = ascribeResponse.data.data;

    req.session.regenerate((err) => {
      if (err) return next(err);

      req.session.auth = {
        userType: "resident",
        role: "resident",
        residentId: resident.id,
      };

      const user = {
        id: resident.id,
        fullName: resident.resident_name,
        phone: resident.resident_phone,
        role: "resident",
      };

      return res.status(201).json({
        success: true,
        message: "Account created successfully.",
        user,
      });
    });
  } catch (err) {
    next(err);
  }
};

export const postSignin = async (req, res, next) => {
  try {
    const { phone, password } = matchedData(req);

    const existingUser = await findStaffByPhone(phone);

    if (existingUser) {
      const user = await authenticateStaff(phone, password);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Phone number or password is incorrect.",
        });
      }

      req.session.regenerate((err) => {
        if (err) {
          return next(err);
        }

        req.session.auth = {
          userType: "staff",
          role: user.role,
          userId: user.id,
        };

        return res.status(200).json({
          success: true,
          message: "Login successful.",
          user: {
            id: user.id,
            fullName: user.full_name,
            phone: user.phone,
            role: user.role,
          },
        });
      });

      return;
    }

    const ascribeResponse = await loginResident({
      resident_phone: phone,
      resident_password: password,
    });

    if (!ascribeResponse.ok) {
      return res.status(401).json({
        success: false,
        message: "Phone number or password is incorrect.",
      });
    }

    const ascribeData = ascribeResponse.data;
    console.log(ascribeData);

    const token = ascribeData.token;
    console.log(token);

    const resident = ascribeData.tenant;
    console.log(resident);

    req.session.regenerate((err) => {
      if (err) {
        return next(err);
      }

      req.session.auth = {
        userType: "resident",
        role: "resident",
        ascribeResidentId: resident.id,
        ascribeToken: token,
      };

      return res.status(200).json({
        success: true,
        message: "Login successful.",
        user: {
          id: resident.id,
          fullName: resident.resident_name,
          phone: resident.resident_phone,
          role: "resident",
          status:
            resident.resident_active_status === "Y" ? "active" : "inactive",
        },
      });
    });
  } catch (err) {
    next(err);
  }
};

export const getSignout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy(() => {
      res.clearCookie("connect.sid");

      return res.status(200).json({
        success: true,
        message: "Logged out successfully.",
      });
    });
  });
};
