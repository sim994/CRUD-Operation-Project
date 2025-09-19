const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const app = express();
const sd = require("./StudentSchema.js");
const { loadEnvFile } = require("process");
const methodOverride = require("method-override");
const { rmSync } = require("fs");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

main()
  .then((res) => {
    console.log("connection succefuly");
  })
  .catch((err) => {
    console.log("something went wong");
  });
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/sd");
}

const port = 3030;

app.listen(port, () => {
  console.log("server are started");
});

app.get("/form", (req, res) => {
  res.render("form.ejs");
});
app.post("/form/table", async (req, res) => {
  let { id, fullname, age, address, grades, TotalMarks } = req.body;
  try {
    let dt = sd.create({
      id,
      fullname,
      age,
      address,
      grades,
      TotalMarks,
    });

    res.redirect("/form/table");
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

app.get("/form/table", async (req, res) => {
  try {
    let data = await sd.find();
    res.render("table.ejs", { data });
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});
app.delete("/form/:id/table", async (req, res) => {
  try {
    let { id } = req.params;

    let deleted = await sd.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).send("Student not found");
    }

    console.log("Deleted:", deleted);
    res.redirect("/form/table");
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});
app.get("/form/:id/update", async (req, res) => {
  try {
    let { id } = req.params;

    let serach = await sd.findById(id);

    console.log(serach);

    res.render("update.ejs", { data: serach });
  } catch (error) {
    res.status(404);
    res.send("something went wrong");
  }
});
app.put("/form/:id/update", async (req, res) => {
  try {
    let { id } = req.params;
    let { fullname, age, address, grades, TotalMarks  } = req.body;

    let updated = await sd.findOneAndUpdate(
      { _id: id },
      { fullname, age, address, grades, TotalMarks },
      { new: true }
    );
    updated.save();

    if (!updated) {
      return res.status(404).send("Student not found");
    }
    console.log("Updated:", updated);
    res.redirect("/form/table");
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});
