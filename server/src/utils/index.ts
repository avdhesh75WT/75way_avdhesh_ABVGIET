import { Request, Response } from "express";
import schedule from "node-schedule";
import sendMail from "../services/mails";

export const validatePassword = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
};

export const handleInterval = (
  interval: string,
  email: string,
  title: string
) => {
  let job = null;
  if (interval === "5s") {
    job = schedule.scheduleJob("*/5 * * * * *", function () {
      console.log("After every 5 sec");
      sendMail(email, title);
    });
  } else if (interval === "30s") {
    job = schedule.scheduleJob("*/30 * * * * *", function () {
      console.log("After every 30 sec");
      sendMail(email, title);
    });
  } else if (interval === "1m") {
    job = schedule.scheduleJob("*/1 * * * *", function () {
      console.log("After every min");
      sendMail(email, title);
    });
  } else if (interval === "5m") {
    job = schedule.scheduleJob("*/5 * * * *", function () {
      console.log("After every 5 min");
      sendMail(email, title);
    });
  } else if (interval === "15m") {
    job = schedule.scheduleJob("*/15 * * * *", function () {
      console.log("After every 15 min");
      sendMail(email, title);
    });
  } else if (interval === "30m") {
    job = schedule.scheduleJob("*/30m * * * *", function () {
      console.log("After every 30 min");
      sendMail(email, title);
    });
  } else if (interval === "1h") {
    job = schedule.scheduleJob("* 1 * * *", function () {
      console.log("After every hour");
      sendMail(email, title);
    });
  } else if (interval === "1d") {
    job = schedule.scheduleJob("* 1 * *", function () {
      console.log("After every day");
      sendMail(email, title);
    });
  } else if (interval === "1w") {
    job = schedule.scheduleJob("* 1", function () {
      console.log("After every 1 week");
      sendMail(email, title);
    });
  } else if (interval === "1mon") {
    job = schedule.scheduleJob("* 1 *", function () {
      console.log("After every 1 month");
      sendMail(email, title);
    });
  } else return "wrong";
  console.log(job.name);
};

export const handleTime = (
  time: string,
  email: string,
  title: string,
  priority: string | number
) => {
  let date = new Date(Date.parse(time));
  const currentDate = new Date();
  if (date < currentDate) return "future error";
  if (date.toString() == "Invalid Date") return "invalid date";
  if (priority === "3" || priority === 3) {
    date.setSeconds(date.getSeconds() + 1);
  } else if (priority === "1" || priority === 1) {
    date.setSeconds(date.getSeconds() - 1);
  }
  const job = schedule.scheduleJob(date, function () {
    console.log(
      `Expected to run at ${time} but ran at ${new Date().toString()}, with priority ${priority}`
    );
    sendMail(email, title);
  });
  console.log(job.name);
};
