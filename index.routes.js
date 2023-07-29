import { dbConnection } from "./database/dbConnection.js"
import taskRouter from "./src/modules/tasks/task.routes.js"
import userRouter from "./src/modules/users/user.routes.js"

export const bootstrap = (app, express) => {
    try {
        app.use(express.json())

        // users routes
        app.use('/user', userRouter)

        // tasks routes
        app.use('/task', taskRouter)

        // any routes
        app.use('*', (req, res) => {
            res.json({ message: 'invalid url' })
        })


        // connect to mongoose
        dbConnection()

    } catch (error) {
        res.json({ message: 'error in bootstrap', error })

    }
}