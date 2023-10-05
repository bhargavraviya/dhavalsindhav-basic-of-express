const dotenv = require('dotenv');
const express = require("express");
const noteRouter = require("./routes/notesRoutes");
const userRouter = require("./routes/userRoutes");
const app = express();
dotenv.config();
const mongoose = require("mongoose");
const cors = require("cors");

app.use(express.json());
app.use(cors());


app.use("/users", userRouter);
app.use("/note", noteRouter);

app.get("/", (req, res) => {
  res.send("Hello Express");
});

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.DB_KEY)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server started on port no." + PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
