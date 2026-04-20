import jwt from "jsonwebtoken";

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "dev_secret_change_me", {
    expiresIn: "7d",
  });
};
