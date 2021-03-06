import http from 'http'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import initializeDb from './db'
import middleware from './middleware'
import mocker from './api/mocker'
import twilio from './api/twilio'
import version from './api/version'

import config from './config.json'

let app = express()
app.server = http.createServer(app)

// logger
app.use(morgan('dev'))

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}))

app.use(bodyParser.json({
	limit : config.bodyLimit
}))

app.use(bodyParser.urlencoded({ extended: true }))

// connect to db
initializeDb( db => {

	// internal middleware
	app.use(middleware({ config, db }))

    // Version
    app.use('/version', version({ config, db }))

    // Mock router
    app.use('/mock', mocker({ config, db }))

	// twilio router
	app.use('/twilio', twilio({ config, db }))

	app.server.listen(process.env.PORT || config.port, () => {
		console.log(`Started on port ${app.server.address().port}`)
	})
})

export default app
