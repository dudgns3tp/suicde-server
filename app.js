var express = require('express');
var http = require('http');
var path = require('path');
var assert = require('assert');
var fs = require('fs');

//express의 미들웨어 불러오기
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var static = require('serve-static');
var errorHandler = require('errorhandler');
// 모듈로 분리한 설정 파일 불러오기

var config = require('./config');

// 모듈로 분리한 데이터베이스 파일 불러오기
var database = require('./database/database');

// 모듈로 분리한 라우팅 파일 불러오기
var route_loader = require('./routes/route_loader');
var app = express();

// python 실행
var pythonShell = require('python-shell');
var options= {
    pythonPath:'C:\Users\SH420\AppData\Local\Programs\Python\python.exe',pythOptinos:['-u']
    , scriptsPath:'./src/model.py'
    , args:[]
};
// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');
var expressSession = require('express-session');


//기본속성 설정
app.set('port', process.env.Port || 3000);
console.log('config.server_port: %d',config.server_port);

//body-parse를 사용해  application/x-www.form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended: false}));

//body-parser를 사용ㅎ application/json 파싱
app.use(bodyParser.json());

//public 폴더를 static으로 오픈 ->public 폴더를 특정 패스로 접근할 수 있도록 static 미들웨어를 사용한것임
app.use('/public', static(path.join(__dirname, 'public')));
 
//cookie-parse 설정
app.use(cookieParser());

//세션 설정
app.use(expressSession({
    secret: 'my key'
    , resave: true
    , saveUninitialized: true
}));

//라우터 객체 참조
var router = express.Router();
route_loader.init(app, router);



// 404 에러 페이지 처리
var errorHandler = expressErrorHandler({static: {'404': './public/404.html'}});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

//라우터 객체 등록
app.use('/', router);
http.createServer(app).listen(app.get('port'), function () {
    console.log('서버가 시작되었습니다. 포트번호:' + app.get('port'));
    database.init(app, config);
});