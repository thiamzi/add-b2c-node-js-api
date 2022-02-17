const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const config = require('./config.json');
//const todolist = require('./todolist');
const cors = require('cors');

const BearerStrategy = require('passport-azure-ad').BearerStrategy;

global.global_todos = ["thiamzi" , "rabm"];

//Setup the arguments for bearer strategy
const options = {
    identityMetadata: `https://${config.credentials.tenantName}.b2clogin.com/${config.credentials.tenantName}.onmicrosoft.com/${config.policies.policyName}/${config.metadata.version}/${config.metadata.discovery}`,
    clientID: config.credentials.clientId,
    audience: config.credentials.clientId,
    policyName: config.policies.policyName,
    isB2C: config.settings.isB2C,
    validateIssuer: config.settings.validateIssuer,
    loggingLevel: config.settings.loggingLevel,
    passReqToCallback: config.settings.passReqToCallback
};

const bearerStrategy = new BearerStrategy(options, (token, done) => {
        // Send user info using the second argument
        done(null, { }, token);
    }
);

const app = express();

app.use(express.json()); 

//enable CORS (for testing only -remove in production/deployment)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(morgan('dev'));

app.use(passport.initialize());

passport.use(bearerStrategy);

// To do list endpoints
//app.use('/api/todolist', todolist);

// API endpoint, one must present a bearer accessToken to access this endpoint
app.get('/hello',
    passport.authenticate('oauth-bearer', {session: false}),
    (req, res) => {
        console.log('Validated claims: ', options);
    
          
        // Service relies on the name claim.  
        res.status(200).json({'name': "thiamzi"});
    }
);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('Listening on port ' + port);
});
