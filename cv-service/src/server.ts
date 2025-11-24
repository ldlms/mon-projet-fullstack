import express from "express";
const app = express();
const port = process.env.PORT || 50002;
app.get("/", (req, res) => res.send("Hello from cv-service!"));
app.listen(port, () => console.log(`Server running on port ${port}`));