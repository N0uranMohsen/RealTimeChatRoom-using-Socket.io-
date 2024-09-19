import mongoose from "mongoose";

export const dbConn = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/socketio")
    .then(() => console.log("db conected sucessfully.."))
    .catch((err) => console.log(err));
};
