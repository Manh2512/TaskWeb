import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import "./home.css";
import background from '../assets/background.png';

function Home() {
    const { username } = useParams()
    const [task, setTask] = useState()
    const [deadline, setDeadline] = useState()
    const today = new Date()
    const created = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`
    const [tasks, setTasks] = useState()
    const [action, setAction] = useState("add")
    const [placeHolder, setPlaceHolder] = useState("Enter new task")

    const handleChange = (e) => {
        // Handle change when chaging action
        setAction(e.target.value);
        switch(e.target.value){
            case "add":
                setPlaceHolder("Enter new task");
                break;
            case "edit":
                setPlaceHolder("Following this syntax: <index>, <new action>");
                break;
            case "delete":
                setPlaceHolder("Enter index of finished task");
        }
    }

    const handleSubmit = (e) => {
        // Add a task
        e.preventDefault() //prevent default reload
        const inputDate = new Date(deadline);
        const date = inputDate.getDate();
        const month = inputDate.getMonth() + 1;
        const year = inputDate.getFullYear();
        const fmt_deadline = `${inputDate.getDate()}/${inputDate.getMonth() + 1}/${inputDate.getFullYear()}`
        setDeadline(fmt_deadline);

        axios.post(`http://localhost:3001/${username}/home`, {action, task, created, deadline: fmt_deadline}, {
            headers:
            {'Content-Type': "application/json"}
        })
        .then(result => {
            console.log(result)
        })
        .catch(err => console.log(err))
        setTask("");
    }

    useEffect(() => {
        async function getTasks() {
            try {
                const response = await axios.get(`http://localhost:3001/${username}/home`);
                setTasks(response.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        }
        getTasks();
    })
    

    return (
        <div className="container" style={{ backgroundImage: `url(${background})`}}>
            <h1>Task Tracker</h1>
            <div className="input-box">
                <form onSubmit={handleSubmit}>
                    <select value={action} className="action-choose" onChange={(e) => handleChange(e)}>
                        <option value="add">Add</option>
                        <option value="edit">Edit</option>
                        <option value="delete">Delete</option>
                    </select>
                    <input value={task}className="input-task" type="text" placeholder={placeHolder} onChange={(e) => setTask(e.target.value)}/>
                    <input className="input-dl" type="date" placeholder="Deadline" onChange={(e) => setDeadline(e.target.value)}/>
                    <button type="submit" className="submit-button" onClick={handleSubmit}>Submit</button>
                </form>
            </div>

            <table className="todo-list">
                <thead>
                    <tr>
                        <th className="index">ID</th>
                        <th className="task">Task</th>
                        <th className="created">Created At</th>
                        <th className="deadline">Deadline</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks?.map((item, index) => (
                        <tr key={item.id} className={index%2===0 ? "tr-odd" : "tr-even"}>
                            <td className="index">{index+1}</td>
                            <td className="task">{item.task}</td>
                            <td className="created">{item.created}</td>
                            <td className="deadline">{item.deadline}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Home;