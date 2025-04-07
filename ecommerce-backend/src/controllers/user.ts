import { Request, Response, NextFunction } from "express";
import { TryCatch } from "../middlewares/error.js";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";

export const newUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, photo, gender, _id, dob } = req.body;

    let user = await User.findById(_id);

    // if user already exists
    if(user) {
      return res.status(200).json({
        success: true,
        message: `Welcome back, ${user.name}`,
      })
    }

    if(!name || !_id || !photo || !gender || !email || !dob)
      return next(new ErrorHandler("Please fill all the fields", 400));

    user = await User.create({
      name,
      email,
      photo,
      gender,
      _id,
      dob: new Date(dob),
    });

    return res.status(201).json({
      success: true,
      message: `Welcome, ${user.name}`,
    });
  }
);

export const getAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find({});

  return res.status(200).json({
    success: true,
    users,
  })
});

export const getUser = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if(!user) {
    return next(new ErrorHandler("Invalid User", 404));
  }

  return res.status(200).json({
    success: true,
    user
  })
});

export const deleteUser = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if(!user) {
    return next(new ErrorHandler("Invalid User", 404));
  }

  user.deleteOne();

  return res.status(200).json({
    success: true,
    message: "User deleted successfully!"
  })
});