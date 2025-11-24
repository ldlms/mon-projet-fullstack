import express from "express";
const app = express();
const port = process.env.PORT || 50001;
app.get("/", (req, res) => res.send("Hello from user-service!"));
app.listen(port, () => console.log(`Server running on port ${port}`));