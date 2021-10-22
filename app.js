//Initialize server
var express = require('express');
var http = require('http');
var app = express();
const path = require('path')

//Import routers
const adminRouter = require('./routers/admin')
const userRouter = require('./routers/user')


//Get port from environment and store in Express.
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, ()=> {
    console.log("Listening on port " + port)
});


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

app.use(express.json({limit: "100mb"}))
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'))
app.use('/admin', adminRouter)
app.use('/', userRouter)


module.exports = app