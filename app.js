const express = require("express");
const app = express();
require("dotenv").config();
require("./connection/conn.js");
const cors = require("cors");
const UserAPI = require("./routes/user.js");
const TaskAPI = require("./routes/task.js");

app.use(cors({
  origin: 'https://keepnotecom.netlify.app', // Allow only this origin
}));
app.use(express.json());
app.use("/api/v1", UserAPI);
app.use("/api/v2", TaskAPI);

const port=process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
