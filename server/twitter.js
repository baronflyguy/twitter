
var connect = require('connect')
var oauth   = require('oauth')
var url     = require('url')

var keys = require('./keys.js')

var oauthclient = new oauth.OAuth(
  'http://twitter.com/oauth/request_token',
  'http://twitter.com/oauth/access_token',
  keys.twitter.keyid,
  keys.twitter.secret,
  '1.0',
  'http://ec2-176-34-215-221.eu-west-1.compute.amazonaws.com:8111/oauth/twitter/callback',
  'HMAC-SHA1',
  null,
  {'Accept': '*/*', 'Connection': 'close', 'User-Agent': 'twitter-js'}
)

var state = {}

var server = connect.createServer(
  connect.router(function(app){

    app.get('/oauth/twitter/login',function(req,res,next){

      oauthclient.getOAuthRequestToken(
        function(
          error, 
          oauth_token, 
          oauth_token_secret, 
          oauth_authorize_url, 
          additionalParameters) 
        {
          if (!error) {
            state[oauth_token] = oauth_token_secret;

            res.writeHead( 301, {
              "Location":
              "http://api.twitter.com/oauth/authorize?oauth_token=" + oauth_token
            })
            res.end()
          }
          else {
            res.end( JSON.stringify(error) )
          }
        }
      )
    })

    app.get('/oauth/twitter/callback',function(req,res,next){
      var parsedUrl = url.parse(req.url, true);

      oauthclient.getOAuthAccessToken(
        parsedUrl.query.oauth_token,
        state[parsedUrl.query.oauth_token],
        parsedUrl.query.oauth_verifier,

        function(
          error, 
          oauth_token, 
          oauth_token_secret, 
          additionalParameters) 
        {
          if (!error) {
            res.writeHead( 301, {
              'Location':"http://ec2-176-34-215-221.eu-west-1.compute.amazonaws.com:8111/oauth/twitter/launch"
            })
            res.end()
          }
          else {
            res.end( JSON.stringify(error) )
          }
        }
      )
    })

    app.get('/oauth/twitter/launch',function(req,res,next){
      res.writeHead(200)
      res.end( 'Signed in with Twitter!' )
    })
  }),
  connect.static('../public')
)
server.listen(8111)
console.log('Server running at http://ec2-176-34-215-221.eu-west-1.compute.amazonaws.com:8111/');
