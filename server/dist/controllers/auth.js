"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = exports.signUp = void 0;
const User_1 = __importDefault(require("../models/User"));
const utils_1 = require("../utils");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, email, password } = req.body;
        if (!userName || !password || !email)
            return res.status(400).json("Please enter all the required fields");
        const user = yield User_1.default.findOne({ userName });
        if (user)
            return res.status(400).json("User already exists");
        if (userName.lenght < 5)
            return res.status(400).json("Username must be atleast 5 letters long");
        if (password.lenght < 8)
            return res.status(400).json("Password must be atleast 8 letters long");
        const isValidPassword = (0, utils_1.validatePassword)(password);
        const isValidEmail = (0, utils_1.validateEmail)(email);
        if (!isValidPassword)
            return res
                .status(400)
                .json("Password must contain a capital letter, a lowercase letter, a special character and a numerical letter");
        if (!isValidEmail)
            return res.status(400).json("Please enter a correct email address");
        const salt = yield bcrypt_1.default.genSalt();
        const passwordHash = yield bcrypt_1.default.hash(password, salt);
        const newUser = yield User_1.default.create({
            userName,
            email,
            password: passwordHash,
        });
        yield newUser.save();
        return res.status(200).json("User create successfullt");
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, password } = req.body;
        if (!userName || !password)
            return res.status(400).json("Please enter all the required fields");
        const user = yield User_1.default.findOne({ userName });
        if (!user)
            return res.status(400).json("User does not exist, Please Signup first");
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ msg: "Invalid Credentials" });
        const token = jsonwebtoken_1.default.sign({ id: user._id, userName: user.userName }, process.env.JWT_SECRET);
        res.status(200).json({ token });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.signIn = signIn;
