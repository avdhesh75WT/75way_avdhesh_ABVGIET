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
exports.main = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "avdhesh.75way@gmail.com",
        pass: "lsnx meka pcyk qjyn",
    },
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const info = yield transporter.sendMail({
            from: "avdhesh.75way@gmail.com",
            to: "sherrysoharu5558@gmail.com ranasherry3332@gmail.com",
            subject: "Hello There!!",
            text: "Hello world?",
            html: "<h1>Hello world?</h1>",
        });
        console.log("Message sent: %s", info.messageId);
    });
}
exports.main = main;
