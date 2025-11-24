import express from 'express'
import { logger } from './config/logger.js'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRoutes from './routes/auth.route.js'
import { securityMiddleeware } from './middleware/security.middleware.js'

const app= express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use(morgan('combined',{stream:{write:(message)=> logger.info(message.trim())}}))

app.use(securityMiddleeware)

app.use('/api/auth',authRoutes)



app.get('/',(req,res)=>{
    logger.info('Hello from Acq')

    res.status(200).send('Hello from Acquistions')
})

export default app;