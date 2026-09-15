import { matchedData, validationResult } from "express-validator";
import passport from "../config/passportConfig.js";
import { registerResident } from "../services/ascribe.service.js";

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

export const postSignin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: info?.message || "Email or password is incorrect",
      });
    }

    req.session.regenerate((err) => {
      if (err) return next(err);

      req.login(user, (err) => {
        if (err) return next(err);

        return res.status(200).json({
          success: true,
          message: "Login successful.",
          user: {
            id: user.id,
            fullName: user.full_name,
            email: user.email,
            role: user.role,
            status: user.status,
            unit: user.unit,
          },
        });
      });
    });
  })(req, res, next);
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
