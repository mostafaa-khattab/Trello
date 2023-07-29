import taskModel from "../../../../database/models/tasks.model.js"
import userModel from '../../../../database/models/users.model.js'

// 1-add task with status (toDo)(user must be logged in)
export const addTaskWithStatus = async (req, res) => {
    const { title, description, status, assignTo, deadline } = req.body

    try {
        const cheakAssignTo = await userModel.findById(assignTo)

        let task = await taskModel.findOne({ title })
        if (!task) {

            const userId = req.userId
            let user = await userModel.findById(userId)
            // console.log(user);

            if (user) {
                if (user.logout === true) {
                    res.json({ message: "user is logout please sign in to add task " })

                } else if (user.deleted === true) {
                    res.json({ message: "user doesn't exist cause it deleted before" })

                } else if (deadline < new Date().toISOString()) {
                    res.json({ message: "invalid date please enter date after now" })


                } else if (!cheakAssignTo) {
                    // console.log(!cheakAssignTo);
                    res.json({ message: 'this user you want to assign this task not exist 🤔😑' })

                } else {
                    let user = await taskModel.insertMany({ title, description, status, userId, assignTo, deadline })
                    res.json({ message: "success", user })
                }

            } else {
                res.json({ message: "account not found" })

            }

        } else {
            res.json({ message: "task already exists" })

        }

    } catch (error) {
        res.json({ message: "Error add task", error })
    }

}


// 2-update task (title , description , status) and assign task to other user(user must be logged in) (creator only can update task)
export const updateTask = async (req, res) => {

    const { title, description, status, assignTo, taskId } = req.body

    try {

        const userId = req.userId

        const cheakAssignTo = await userModel.findById(assignTo)

        let cheakTitle = await taskModel.findOne({ title })

        const task = await taskModel.findById(taskId)
        console.log(task);
        if (!task) {
            res.json({ message: "Task not found" });

        } else if (task.userId.toString() !== userId) {
            res.json({ message: "user Only the creator can update this task" });

        } else if (task.assignTo.logout == true) {
            res.json({ message: "user is logout please sign in to add task " })

        } else if (task.assignTo.deleted == true) {
            res.json({ message: "user doesn't exist cause it deleted before" })

        } else if (!cheakAssignTo) {
            // console.log(!cheakAssignTo);
            res.json({ message: 'this user you want to assign this task not exist 🤔😑' })



        } else if (cheakTitle) {
            res.json({ message: "task already exists" })

        } else {

            if (status == 'toDo' || status == 'doing' || status == 'done') {

                let taskUpdate = await taskModel.findByIdAndUpdate({ _id: taskId }, { title, description, status, assignTo }, { new: true })
                res.json({ message: "success", taskUpdate })
                // console.log(status);

            } else {
                res.json({ message: 'enter vaild status 😑' })

            }

        }

    } catch (error) {
        res.json({ message: "Error update task", error })
    }

}



// 3-delete task(user must be logged in) (creator only can delete task)
export const deleteTask = async (req, res) => {
    const taskId = req.params.id

    const userId = req.userId

    try {

        let task = await taskModel.findById(taskId)

        if (!task) {
            res.json({ message: 'Task not found' })

        } else if (task.userId.toString() !== userId) {
            res.json({ message: 'user Only the creator can delete this task' })

        } else if (task.userId.logout == true) {
            res.json({ message: "user is logout please sign in to delete task " })

        } else {
            let taskDelete = await taskModel.findByIdAndDelete({ _id: taskId })
            res.json({ message: 'success', taskDelete })

        }


    } catch (error) {
        res.json({ message: "Error delete task", error })

    }
}


// 4-get all tasks with user data
export const allTasksWithUser = async (req, res) => {
    try {

        let tasks = await taskModel.find({}).populate('userId', 'userName email').populate('assignTo', 'userName email')

        if (tasks.length > 0) return res.json({ message: 'success', tasks })

        res.json({ message: 'tasks not found' })


    } catch (error) {
        res.json({ message: "Error all tasks with user data", error })

    }
}

// 4-get all tasks with creator tasks
export const creatorTasks = async (req, res) => {
    try {

        const userId = req.userId

        let tasks = await taskModel.find({ userId }).populate('userId', 'userName email').populate('assignTo', 'userName email')

        if (tasks.length > 0) return res.json({ message: 'success', tasks })

        res.json({ message: 'tasks not found' })


    } catch (error) {
        res.json({ message: "Error all tasks with user data", error })

    }
}

// 5-get tasks of oneUser with user data (user must be logged in)
export const allTasksWithOneUser_1 = async (req, res) => {

    try {
        const userId = req.userId

        let tasks = await taskModel.find({ assignTo: userId }).populate('userId', 'userName email').populate('assignTo', 'userName email')

        if (tasks.length > 0) return res.json({ message: 'success', tasks })

        res.json({ message: 'not found Assignment' })


    } catch (error) {
        res.json({ message: "Error tasks of oneUser with user data (user must be logged in)", error })

    }
}

// 6-get all tasks of oneUser with user data
export const allTasksWithOneUser_2 = async (req, res) => {

    try {

        let tasks = await taskModel.find({}).populate('userId', 'userName email').populate('assignTo', 'userName email')

        if (tasks.length > 0) return res.json({ message: 'success', tasks })

        res.json({ message: 'invalid user ID' })


    } catch (error) {
        res.json({ message: "Error tasks of oneUser with user data", error })

    }
}


// 7-get all tasks that not done after deadline
export const taskWithAfterDeadLine = async (req, res) => {

    try {

        let tasks = await taskModel.find({

            status: { $ne: 'done' },

            deadline: { $lt: new Date().toISOString() }

        }).populate('userId', 'userName email').populate('assignTo', 'userName email')

        // console.log(new Date().toISOString());

        if (tasks.length > 0) return res.json({ message: 'success', tasks })

        res.json({ message: 'not found tasks' })


    } catch (error) {
        res.json({ message: "Error tasks that not done after deadline", error })

    }
}
