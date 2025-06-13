import Express from 'express'
import { rootRoutes } from './routes/rootRoutes'
import morgan from 'morgan'

const PORT = process.env.PORT || 3000

const app = Express()

// Middleware
app.use(Express.json())
app.use(morgan('dev'))

// Routes
app.use(rootRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})