var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var main = require('./routes/main');
var sessionPool = require('./util/sessionPool');
var encryption = require('./util/encrypt');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(session({
    secret: 'defaultSecret^-^',
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/'
    }
}));
app.use(express.static(path.join(__dirname, 'public')));

//세션 확인 미들웨어
app.all('*', function (req, res, next){
    var currSessionID = req.session.sessid;

    //세션값이 있는 경우(유효값 알수없음)
    if(currSessionID){
        console.log('[sessionCheckMiddleWare]currSession : ' + currSessionID);

        //유효세션값인 경우
        if(sessionPool.checkSession(currSessionID)){
            if(req.originalUrl == '/' || req.originalUrl == '/login'){
                res.redirect('/main');
            }
        }
    }
    next();
})
//여기서 custom Session 검사 진행.
app.use('/', index);
app.use('/users', users);
app.use('/auth', auth);
app.use('/main', main);
 
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//module.exports = app;

require('http').createServer(app).listen('3030', function () {
    console.log('NodeJS server started.');
});
