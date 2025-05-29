require('dotenv').config();
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const UserModel = require("./model/User")

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.log(err));

app.post("/signup", (req, res) => {
    console.log(req.body)
    UserModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.post("/login", (req, res) => {
    const {email, password} = req.body;
    UserModel.findOne({email : email})
    .then(user => {
        if(user) {
            if(user.password === password){
                res.json({ message: "Success", username: user.name })
            }else{
                res.json({ message: "The password is incorrect" })
            }
        }else{
            res.json({ message: "Email doesn't exist" })
        }
    })
})

app.post("/:username/home", (req, res) => {
    const username = req.params.username;
    const { action, task, created, deadline } = req.body;
    let ind = 0;

    if (!task || !deadline){
        return res.status(400).json({ message: "Missing required task data" });
    }
    switch(action) {
        case "add":
            UserModel.findOneAndUpdate(
                {name: username},
                {
                    $push: {
                        tasks: { task, created, deadline }
                    }
                },
                { new: true }, 
            ).then((user) => {
                console.log(user);
                res.json({
                    task, created, deadline
                });
            }).catch((err) => {
                console.log("Error updating data:", err);
            });
            break;
        
        case "edit":
            if(!task.includes(", ")){
                console.error("Invalid format");
            }
            const parts = task.split(", ", 2);
            if(!(/^\d+$/.test(parts[0]))){
                console.error("Invalid format");
            }
            ind = parseInt(parts[0], 10)-1;
            const field = `tasks.${ind}`;
            const newtask = parts[1];
    
            UserModel.findOne({ name: username })
            .then((user) => {
                if (!user) {
                    throw new Error("User not found");
                }

                if(ind >= user.tasks.length){
                    throw new Error("Index out of range");
                }

                const existingTask = user.tasks[ind] || {};

                const updatedField = {
                    task: newtask,
                    created: existingTask.created || created,
                    deadline,
                };

                return UserModel.findOneAndUpdate(
                    { name: username },
                    { $set: { [field]: updatedField } },
                    { new: true }
                );
            })
            .then((user) => {
                console.log(user);
                res.json({ newtask, created, deadline });
            })
            .catch((err) => {
                console.error("Error updating data:", err);
                res.status(500).json({ error: "Update failed" });
            });
            break;

        case "delete":
            if(!(/^\d+$/.test(task))){
                console.error("Invalid format");
            }
            ind = parseInt(task, 10)-1;
            UserModel.findOne({ name : username})
            .then((user) => {
                if(ind >= user.tasks.length){
                    throw new Error("Index out of range");
                }
                const newTasks = user.tasks.splice(ind, 1)[0];

                return UserModel.findOneAndUpdate(
                    { name: username},
                    {
                        $pull: {
                            tasks: newTasks
                        }
                    },
                    { new: true }, 
                );
            })
            .then((updatedUser) => {
                console.log(updatedUser.tasks);
            });
    }
    
})

app.get("/:username/home", (req, res) => {
    const username = req.params.username;
    UserModel.findOne({name: username})
    .then((user) => {
        if(user) {
            res.json(user.tasks);
        }
    })
    .catch((err) => {res.json({message: err})})
})

app.listen(process.env.PORT, () => {
    console.log("server is running on port", process.env.PORT)
})