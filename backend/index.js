const express = require("express");
const dbConnect = require("./config/database");
const userRoutes = require("./routes/user");
const app = express();
const cors = require('cors');
app.use(cors({
  origin: "chrome-extension://nbbjbhpibggipgkjiepjnebibbpaobij",
  credentials: true,
}));


require("dotenv").config();
const PORT = process.env.PORT || 5000;


const cookieParser = require("cookie-parser");
app.use(cookieParser());


// Middleware
app.use(express.json());

app.use("/api/v1", userRoutes);

// CORS Configuration
app.listen(PORT, () => {
  console.log(`THE SERVER IS UP AND RUNNING AT PORT ${PORT}`);
});

dbConnect();

app.get("/", (req, res) => {
  res.send(`<h1>Backend is Running and this is '/' Route</h1>`);
});
