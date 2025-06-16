import Express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { rootRoutes } from './routes/rootRoutes'
import morgan from 'morgan'
import { sequelize } from './models'
import clientRoutes from './routes/clientRoute'
import serviceRoutes from './routes/serviceRoute'
import windowRoutes from './routes/windowRoute'
import ticketRoutes from './routes/ticketRoute'
import userRoutes from './routes/userRoute'

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
app.use('/api/clients', clientRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/windows', windowRoutes)
app.use('/api/tickets', ticketRoutes)
app.use('/api/users', userRoutes)
// Routes
app.use(rootRoutes)

sequelize.sync({ force: false })
  .then(() => console.log('Database synchronized successfully'))
  .catch(err => console.error('Error synchronizing the database:', err));

httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})