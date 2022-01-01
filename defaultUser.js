const User = require("./models/userRegister");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();

const defaultUser = [
  { name: "Damon", email: "damon@gmail.com", password: "sa123" },
  { name: "Sam", email: "sam@gmail.com", password: "ab123" },
  { name: "Dean", email: "dean@gmail.com", password: "ao123 " },
  { name: "Negan", email: "negan@gmail.com", password: " qa123" },
  { name: "Rick", email: "rick@gmail.com", password: "se123" },
  { name: "Denish", email: "denish@gmail.com", password: "yu123" },
  { name: "Samay", email: "samay@gmail.com", password: " ui123" },
  { name: "Arrow", email: "arrow@gmail.com", password: "op123" },
  { name: "Klus", email: "klus@gmail.com", password: "pa123" },
  { name: "Matt", email: "matt@gmail.com", password: "ma123" },
];

const ab = () => {
  return new Promise(async (resolve, reject) => {
    const totalDefaultUser = await User.find({}).countDocuments();
    if (totalDefaultUser === 0) {
      try {
        const result = defaultUser.map(async (user) => {
          const passwords = user.password;
          const names = user.name;
          const emails = user.email;
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(passwords, salt);

          const savedData = {
            name: names,
            email: emails,
            password: hashPassword,
          };
          await new User(savedData).save();
        });
        resolve();
      } catch (error) {
        console.log("error:", error);
      }
    } else {
      resolve();
    }
  });
};

module.exports = ab;
