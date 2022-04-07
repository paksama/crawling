// MEVN서적 예제연습. 써먹을 일이 있을것 같아서 저장해 둠. ㅡ,.ㅡ;
// 변경사항 : 크롤링한 데이터 파일로 저장할 수 있도록 수정.
// Nightmare패키지가 오랫동안 업데이트가 되지 않아서 M1 Mac에서는 동작하지 않음.(로제타 필요)
// 실행법 : node app.js
// 최종확인 : 2022. 4. 7 - U. PAK
//

// M1 Mac에서는 설치시 에러남. node를 인텔용으로 설치하고 할 것.
// npm install vo nightmare fs
const Nightmare = require('nightmare');
const vo = require('vo');

// 크롤링시 브라우저 보이기 설정
const nightmare = Nightmare({
    show: true,
});

// 크롤링데이터를 로컬파일로 저장시 필요
const fs = require('fs');

// 크롤링 할 사이트 주소 설정
const BASE_URL = `https://grafolio.naver.com/category/painting`
const GRAPOLIO_URL = `${BASE_URL}#category_popular_creator`

function* run(){
    yield nightmare.goto(GRAPOLIO_URL);
    let prevHeight, currHeight = 0;

    // 크롤링할 사이트 자동으로 스크롤하기(데이터를 얻어오기 위해서)
    while(prevHeight !== currHeight){
        prevHeight = currHeight
        currHeight = yield nightmare.evaluate(() => document.body.scrollHeight);
        yield nightmare.scrollTo(currHeight, 0).wait(2000);

    }

    // 필요한 데이터 따오기
    const a = yield nightmare
    .evaluate(() => Array.from(document.querySelectorAll('a.thumb'))
    .map(e => (`https://grafolio.naver.com${e.getAttribute('href')}`)))
   
    
    console.log(a);
    // console.log(typeof a);
    
    // 저장시 데이터 형태는 String, 고로 a(객체)를 join을 써서 변환함(안하면 저장 안됨.)
    fs.writeFile("test.txt", a.join(`\n`), (err)=>{
        if(err){
            console.log(`Error: ${err}`);   
        }
        else{
            console.log("File written successfully\n");
            // console.log("The written has the following contents:");
            // console.log(fs.readFileSync("test.txt", "utf8"));
        }
    });
    
    yield nightmare.end();
}

vo(run)(() => console.log('완료!!'));
