//importing required libraries and files
const express = require('express');
const bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let config = require('./config');
let middleware = require('./middleware');

class HandlerGenerator {
  login (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    // For the given username fetch user from DB
    let mockedUsername = 'admin';
    let mockedPassword = 'password';

    if (username && password) {
      if (username === mockedUsername && password === mockedPassword) {
        let token = jwt.sign({username: username},
          config.secret,
          { 
              expiresIn: '24h' // expires in 24 hours
          }
        );
        // return the JWT token for the future API calls
        res.json(
        {
            success: true,
            message: 'Authentication successful!',
            token: token
        });
      }
      else 
      {
        res.json({
          success: false,
          message: 'Incorrect username or password'
        });
      }
    }
    else
    {
      res.json({
        success: false,
        message: 'Authentication failed! Please check the request'
      });
    }
  }
  test (req, res)
  {
      res.json(
      {
        success: true,
        message: 'testing successful'
      });
  }
}

// Starting point of the server
function main ()
{
  let app = express(); // Export app for other routes to use
  let handlers = new HandlerGenerator();
  const port = 316;
  app.use(bodyParser.urlencoded(
  { 
    extended: true
  }));
  app.use(bodyParser.json());
  // Routes & Handlers
  app.post('/login', handlers.login);
  app.get('/', middleware.checkToken, handlers.test);
  app.listen(port, () => console.log(`Server is listening on port: ${port}`));
}

main();