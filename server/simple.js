
// To Run:
// npm install connect
// node simple.js

var connect = require('connect')

var api = {}
api.ping = function( req, res ) {
  var output = {ok:true,time:new Date()}
  res.writeHead(200,{
    'Content-Type': 'application/json'
  })
  res.end( JSON.stringify( output ) )
}

var server = connect.createServer()
server.use( connect.logger() )

server.use( connect.router( function( app ) {
  app.get('/api/ping', api.ping)
}))

server.listen(8182)
