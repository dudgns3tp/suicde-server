/* 단어별로 스크래핑하는 모듈*/
//모듈 로드
var client = require('cheerio-httpcli');
var request = require('request');
var fs = require('fs');
var urlType = require('url');
var async = require('async');
var origin_no = 08240; //현재 페이지 단어의 총 개수는 12614개
var word_number = 08240;
//변수 선언
//다운로드

//저장할 디렉터리가 없으면 생성
var savedir = __dirname + "/img";
if(!fs.existsSync(savedir)){
    fs.mkdirSync(savedir);
}
//숫자 처리
function pad(n, width) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

console.log(origin_no+'번째 부터 '+word_number+'번째까지 이미지 저장');
// origin_no 1부터 word_number 단어의 개수만큼 url을 변경시켜서 요소 추출
for(; origin_no <=word_number; origin_no++){
    
    //url 지정
    var url ="http://sldict.korean.go.kr/front/sign/signContentsView.do?current_pos_index=0&origin_no="+origin_no+"&searchWay=&top_category=CTE&category=&searchKeyword=&pageIndex=1&pageJumpIndex=";
    var param = {};
    var scrap = client.fetchSync(url);
    var cnt=1;
    
    scrap.$("img").each(function(idx){ 
         var src = scrap.$(this).attr('src');
         if(!src.match('common')){ //common 값을 가진 파일은 제거해준다.
                    console.log(src);
             //상대경로를 절대경로로 변환
             src = urlType.resolve(url, src);
              //저장 파일 이름 결정
             var fname = urlType.parse(src).pathname;
             fname = savedir+ "/"+ pad(origin_no,5)+'('+cnt+').png';
             //다운로드
             request(src).pipe(fs.createWriteStream(fname));
             console.log('파일명: '+src+'저장될 이름 : '+pad(origin_no,5)+' : 다운로드 완료');
             cnt++;
        }
    });     
}
