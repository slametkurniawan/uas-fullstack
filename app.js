const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());

app.use(express.json());

const mongoUrl = "mongodb+srv://slametkurniawan:admin@cluster0.lbuhgp4.mongodb.net/?retryWrites=true&w=majority";

const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pou89ywe";

mongoose.connect(mongoUrl).then(() => {
      console.log("Database Terhubung")
}).catch((e) => {
      console.log(e)
});

require('./Users')
require('./Tasks')

const User = mongoose.model("Users")
const Task = mongoose.model("Tasks")

app.get("/", (req, res) => {
      res.send({ status: "mulai" })
})

// REGISTER
app.post('/register', async (req, res) => {
      const { username, email, password } = req.body;

      const oldUser = await User.find({ username: username });

      if (oldUser.length > 0) {
            return res.send({ data: "user sudah ada!!" })
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      try {
            await User.create({
                  username: username,
                  email: email,
                  password: encryptedPassword,
            });
            res.send({ status: 'ok', data: 'user dibuat' })
      } catch (error) {
            res.send({ status: 'error', data: error })
      }
});

//LOGIN
app.post("/login", async (req, res) => {
      const { username, password } = req.body;
      const oldUser = await User.findOne({ username: username })

      if (!oldUser) {
            return res.send({ data: "user tidak di temukan !!" })
      }

      if (await bcrypt.compare(password, oldUser.password)) {
            const token = jwt.sign({ username: oldUser.username }, JWT_SECRET);

            if (res.status(201)) {
                  return res.send({ status: "ok", data: token })
            } else {
                  return res.send({ error: "error" })
            }
      }
})


// CREATE TASK
app.post("/createtask", async (req, res) => {
      const { newTask } = req.body;
    
      try {
            const createdTask = await mongoose.model ("Tasks").create({
            newTask,
      });
    
        res.send({ status: 'ok', data: createdTask });
      } catch (error) {
        res.send({ status: 'error', data: error.message });
      }
});
    
// GET TASKS
app.get("/gettasks", async (req, res) => {
      try {
        const Tasks = await mongoose.model ("Tasks").find();
        res.send({ status: 'ok', data: Task });
      } catch (error) {
        res.send({ status: 'error', data: error.message });
      }
});
    
// DELETE TASK
app.delete("/deletetask/:taskId", async (req, res) => {
      const taskId = req.params.taskId;
    
      try {
        const deletedTask = await mongoose.model ("Tasks").findByIdAndDelete(taskId);
        
        if (!deletedTask) {
          return res.status(404).send({ status: 'error', data: 'Task not found' });
        }
    
        res.send({ status: 'ok', data: deletedTask });
      } catch (error) {
        res.send({ status: 'error', data: error.message });
      }
});


// CREATE SCHEDULES
app.post("/createschedule", async (req, res) => {
      const { tgl, hari, matkul, jam, ruangan } = req.body;

      try {
            const newSchedule = await mongoose.model("Schedules").create({
                  tgl,
                  hari,
                  matkul,
                  jam,
                  ruangan,
            });

            res.send({ status: 'ok', data: newSchedule });
      } catch (error) {
            res.send({ status: 'error', data: error.message });
      }
});


// WRITE SCHEDULES
app.get("/getschedules", async (req, res) => {
      try {
            const schedules = await mongoose.model("Schedules").find();
            res.send({ status: 'ok', data: schedules });
      } catch (error) {
            res.send({ status: 'error', data: error.message });
      }
});


// UPDATE SCHEDULES
app.post("/updateschedule", async (req, res) => {
      const { scheduleId, tgl, hari, matkul, jam, ruangan } = req.body;

      try {
            const updatedSchedule = await mongoose.model("Schedules").findOneAndUpdate(
                  { _id: scheduleId },
                  { $set: { tgl, hari, matkul, jam, ruangan } },
                  { new: true }
            );

            if (!updatedSchedule) {
                  return res.status(404).send({ status: 'error', data: 'Schedule not found' });
            }

            res.send({ status: 'ok', data: updatedSchedule });
      } catch (error) {
            res.send({ status: 'error', data: error.message });
      }
});


// DELETE SCHEDULES
app.delete("/deleteschedule/:scheduleId", async (req, res) => {
      const scheduleId = req.params.scheduleId;

      try {
            const deletedSchedule = await mongoose.model("Schedules").findByIdAndDelete(scheduleId);

            if (!deletedSchedule) {
                  return res.status(404).send({ status: 'error', data: 'Schedule not found' });
            }

            res.send({ status: 'ok', data: deletedSchedule });
      } catch (error) {
            res.send({ status: 'error', data: error.message });
      }
});


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
      console.log(`Server Berjalan di port ${PORT}`)
})