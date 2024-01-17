import { Request, Response } from "express";
import User from "../models/User";
import { validatePassword, validateEmail } from "../utils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !password || !email)
      return res.status(400).json("Please enter all the required fields");
    const user = await User.findOne({ userName });
    if (user) return res.status(400).json("User already exists");
    if (userName.lenght < 5)
      return res.status(400).json("Username must be atleast 5 letters long");
    if (password.lenght < 8)
      return res.status(400).json("Password must be atleast 8 letters long");
    const isValidPassword = validatePassword(password);
    const isValidEmail = validateEmail(email);
    if (!isValidPassword)
      return res
        .status(400)
        .json(
          "Password must contain a capital letter, a lowercase letter, a special character and a numerical letter"
        );
    if (!isValidEmail)
      return res.status(400).json("Please enter a correct email address");
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      userName,
      email,
      password: passwordHash,
    });
    await newUser.save();
    return res.status(200).json("User create successfullt");
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password)
      return res.status(400).json("Please enter all the required fields");
    const user = await User.findOne({ userName });
    if (!user)
      return res.status(400).json("User does not exist, Please Signup first");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });
    const token = jwt.sign(
      { id: user._id, userName: user.userName },
      process.env.JWT_SECRET!
    );
    res.status(200).json({ token });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
