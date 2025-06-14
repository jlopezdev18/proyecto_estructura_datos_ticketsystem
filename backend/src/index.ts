import Express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { rootRoutes } from './routes/rootRoutes'
import morgan from 'morgan'

const PORT = process.env.PORT || 3000

const app = Express()
const httpServer = createServer(app)
const io = new Server(httpServer)
// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id)
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id)
    })
})


// Middleware
app.use(Express.json())
app.use(morgan('dev'))

// Routes
app.use(rootRoutes)


httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})