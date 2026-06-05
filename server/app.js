require('dotenv').config({ path: '../.env' });
const express = require("express");
const cors = require("cors");
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: ['https://blog-api-public-two.vercel.app', 'https://blog-api-admin-sigma.vercel.app'] }))

const adminRouter = require("./routes/adminRouter");
const authRouter = require("./routes/authRouter");
const commentRouter = require("./routes/commentRouter");
const postRouter = require("./routes/postRouter");

app.use("/api/admin", adminRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/posts/:postId/comments", commentRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});

const PORT = 3000;
app.listen(PORT, (error) => {
    if (error) {
        throw error;
    }
    console.log(`listening on port ${PORT}`);
});