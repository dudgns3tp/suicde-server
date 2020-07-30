/* 단어별로 스크래핑하는 모듈*/
//모듈 로드
var client = require('cheerio-httpcli');
var request = require('request');
var origin_no = 1; //현재 페이지 단어의 총 개수는 12614개
var word_page = 12614; // 단어 페이지
//변수 선언
//다운로드
var word =new Array(), //수어 
    handExplain = new Array(), //수형 설명
    wordInformation = new Array(),//원어 정보
    wordExplain = new Array(), //단어 한국어 정보
    wordExample = new Array(),//단어 한국어 예시
    wordNum = new Array();
var MongoClient = require('mongodb').MongoClient;


var database;
var dbName = 'suicide';
var collectionName = 'dictionary3';

//데이터베이스에 연결
function connectDB() {
    
    //데이터베이스 연결 정보
    var databaseUrl = 'mongodb://localhost:27017/local';
    
    //데이터베이스 연결
    MongoClient.connect(databaseUrl, { useNewUrlParser: true }, function(err,client){
        if(err) throw err;
        
        console.log('데이터베이스에 연결되었습니다. :'+databaseUrl);
        
        //database 변수에 할당
        database = client.db(dbName);
        if(database){
    console.log('데이터베이스 삽입 시작');
    insert_data(database, function(err, result){
        if(err){
            console.log('삽입 실패');
        } 
        
        if(result && result.insertedCont >0){
            console.dir(result);
            console.log('삽입 성공');
        }
    });

}else{
    console.log('데이터베이스 삽입 시작 안됨');
}
    });
}

var insert_data = function(database, callback){
    console.log('Insert_data 호출됨.');
    var cnt=1;
    
    //dictionary 컬렉션 참조
    var dictionary = database.collection(collectionName);
    
    //데이터 삽입
    for(var index=1; index<=word_page; index++){
         dictionary.insertMany([{"id":wordNum[index], "word": word[index], "handExplain":handExplain[index], "wordInformation":wordInformation[index], "wordExample":wordExample[index], "wordExplain": wordExplain[index]}],function(err, result){
             if(err){
                 callback(err, null);
                 return;
             }
             
             if(result.insertedCount > 0){
                 console.log('단어 레코드 추가됨 : '+ cnt);
             } else{
                 console.log("추가된 레코드가 없음"+ cnt);
             }
             
             callback(null, result);
             cnt++;
         });
    }
    
}

// 앞 뒤 공백 제거
function trim(str) 
{ 
  return str.replace(/(^\s*)|(\s*$)/gi, ""); 
}
// 숫자 자리 수 가공
function pad(n, width) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}
function parsing(page_num){
    //url 지정
    var url ="http://sldict.korean.go.kr/front/sign/signContentsView.do?current_pos_index=0&origin_no="+page_num+"&searchWay=&top_category=CTE&category=&searchKeyword=&pageIndex=1&pageJumpIndex=";
    var scrap = client.fetchSync(url);
    
        scrap.$("dl.content_view_dis > dd").each(function(idx){ 
        var text1 = scrap.$(this).text();
        text1 = trim(text1.replace(/\s\s+/g, ' '));
            switch(idx){
                    case 0: // 버리는값이지만 데이터 번호 설정
                        wordNum[origin_no] = pad(origin_no,5);
                        break;
                    case 1:
                        handExplain[origin_no] = text1; //수형 설명
                        break; 
                    case 2:
                        wordInformation[origin_no] = text1; //원어 정보
                        break;
                    case 3:
                        word[origin_no] = text1; //단어
                        break;
                    case 4:
                        wordExplain[origin_no] = text1; //단어 한국어 설명
                        break;
                    case 5:
                        wordExample[origin_no] = text1;
                        break;
                    default :
                        break;
                }                
            });            
    return;
}


// origin_no 1부터 word_page 단어의 개수만큼 url을 변경시켜서 요소 추출
for(origin_no=1; origin_no <=word_page; origin_no++){
    parsing(origin_no);
}

for(var i=1; i<=word_page; i++){
    console.log(wordNum[i]+'번 째 단어 :'+word[i]+' 수형 설명:'+handExplain[i]+' 단어 정보:'+wordInformation[i]+' 단어 한국어 정보:'+wordExplain[i]+' 단어 한국어 예시:'+wordExample[i]);
}
console.log('데이터베이스 연결');
connectDB();
