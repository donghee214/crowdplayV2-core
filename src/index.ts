import express, { Request, Response, NextFunction } from "express";
import db from "./firestore/init";

const app = express();
const port = 8080; // default port to listen

// define a route handler for the default home page
app.get("/", (req: Request, res: Response) => {
  console.log("hit");
  res.send("Hello world!!!");
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
