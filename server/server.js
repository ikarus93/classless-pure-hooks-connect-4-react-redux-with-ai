const express = require("express"),
    app = express(),
    path = require("path");

app.use(express.static(path.join(__dirname, '..', "dist")));


app.get("/", async (req, res, next) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
})

app.listen(8080, () => {
    console.log("app running");
})