const http = require('http');//http모듈(HTTP웹 서버와 클라이언트를 생성하는것과 모든것을 담당하는 모듈)을 가져옴
const fs = require('fs').promises; //fs모듈(파일 처리에 전반적인 작업을 하는 모듈)을 가져옴

const users = {}; //유저를 저장하는 배열

http.createServer(async (req, res) => { //전에 가져왔던 http모듈로 서버를 만듦 async를 붙이면 자동으로 promise(비동기 작업이 맞이할 미래의 완료 또는 실패와 그 값을 나타냄)객체로 인식됨
  try { // 에러가 생기면 catch로
    console.log(req.method, req.url); //메소드(GET, POST, PUT, DELETE가 있음 이것들을 사용하여 리소스에 수행하기를 원하는 행동을 나타냄)와 url을 확인을 위해 출력
    if (req.method === 'GET') { //메소드가 GET이면 실행 아니면 넘어감
      if (req.url === '/') { //req.url로 url을 가져와 /로 돼있으면 실행 아니면 넘어감
        const data  = await fs.readFile('./restFront.html'); //await는 promise(async를 붙여 promise 객체로 인식된것)가 처리될때까지 기다림 data라는 상수를 만들고 restFront.html이라는 파일을 가져와 넣음
        res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'}); //헤더의 status(성공 여부 또는 에러 상태)를 200(성공하였을때)로 설정하고 Content-Type을 text/html(html파일)로 설정 문자타입을 utf-8로 설정
        return res.end(data); //data(restFront.html를 가져왔던 상수)를 res.end(보내줄 데이터는 없는데 끝내고 싶을때 사용)로 돌려줌
      } else if (req.url === '/about') { //req.url로 url을 가져와 /about으로 돼있으면 실행 아니면 넘어감
        const data = await fs.readFile('./about.html'); // data라는 상수를 만들어 about.html을 가져와 넣음
        res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'}); //헤더의 status를 200로 설정하고 Content-Type을 text/html로 설정 문자타입을 utf-8로 설정
        return res.end(data); //data(about.html를 가져왔던 상수)를 res.end로 돌려줌
      } else if (req.url === '/users') { //req.url로 url을 가져와 /users로 돼있으면 실행 아니면 넘어감
        res.writeHead(200, {'Content-Type' : 'text/plain; charset=utf-8'}); //헤더의 status를 200로 설정하고 Content-Type을 text/plain(그래픽 표현이나 그 밖의 오브젝트가 아닌 읽을 수 있는 문자열만을 대표하는 데이터)로 설정 문자타입을 utf-8로 설정
        return res.end(JSON.stringify(users)); //users(유저를 저장하는 배열)를 JSON으로 res.end를 사용하여 돌려줌 
      }

      try { // 에러가 생기면 catch로
        const data = await fs.readFile(`.${req.url}`); //data라는 상수를 만들고 await을 사용하여 promise가 처리될때까지 기다림 fs모듈을 사용하여 url에 있는 주소로 파일을 찾음
        return res.end(data); // data(url에 있는 주소를 사용하여 찾은 파일)를 res.end로 돌려줌
      } catch (err) { //파일이 없어 불러올때 에러가 생겨 이곳에서 에러를 처리함
      }

    } else if (req.method === 'POST') { //메소드가 POST일 경우 실행함 아닐경우 넘어감
      if (req.url === '/user') { //req.url로 가져온 url이 /user일 경우 실행 아니면 넘어감
        let body = ''; //body라는 변수를 ''로 선언함
        
        req.on('data', (data) => { //req.on('data') -> data가 있을경우 실행
          body += data; // body라는 변수에 data를 추가함
        });

        return req.on('end', () => { //req.on('end') -> 처리가 다 끝났을 경우 실행
          console.log('POST 본문 (Body):', body); // body의 값을 보여줌
          const { name } = JSON.parse(body); //JSON을 객체로 변환한 body를 name라는 상수를 만들어 값을 넣음
          const id = Date.now(); //id라는 상수를 만들어 현재 시간을 넣음
          users[id] = name; //users에 id번째에 있는 값을 name으로 바꿈
          res.writeHead(201); // status를 201로 지정함
          res.end('등록 성공'); //res.end를 사용하여 '등록성공' 이라는 텍스트를 돌려줌
        });
      }
    } else if (req.method === 'PUT') { //메소드가 PUT일 경우 실행함 아니면 넘어감
      if (req.url.startsWith('/user/')) { //url에서 '/user/'로 시작한다면 실행하고 아니면 넘어감
        const key = req.url.split('/')[2]; //url에 /를 기준으로 자른 후 3번째에 있는 값을 key라는 상수를 만들어서 넣는다
        let body = ''; //body라는 변수를 만듦
        req.on('data', (data) => { //data가 있을 경우 실행
          body += data; //body에 data를 추가함
        });
        return req.on('end', () => { //처리가 다 끝났을 경우 실행
          console.log('PUT 본문(Body):', body); //body값 보여줌
          users[key] = JSON.parse(body).name; // users에 key번째에 있는 값을 body를 JSON.parse를 이용하여 JSON을 객체로 바꾸어서 name을 가져와 넣음
          return res.end(JSON.stringify(users)); //JSON.stringify를 사용하여 객체를 JSON으로 변환하고 res.end로 돌려줌
        });
      }
    } else if (req.method === 'DELETE') { //메소드가 DELETE경우 실행하고 아닐경우 넘어감
      if (req.url.startsWith('/user/')) { //url이 /user/로 시작할 경우 실행
        const key = req.url.split('/')[2]; //url을 /를 기준으로 잘라 3번째에 있는 값을 key라는 상수를 만들어 넣음
        delete users[key]; //users에 key번째에 있는 값을 삭제함
        return res.end(JSON.stringify(users)); //users를 JSON으로 변환하여 res.end로 돌려줌
      }
    }
    res.writeHead(404); //status를 404로 설정한다
    return res.end('NOT FOUND'); //res.end를 사용하여 'NOT FOUND'라는 텍스트를 돌려준다
  } catch (err) { //에러가 날 경우 실행
    console.log(err); //에러를 출력한다
    res.writeHead(500, {'Content-Type' : 'text/plain; charset=utf-8'}); //status를 500으로 설정하고 Content-Type을 text/plain으로 설정하고 charset을 utf-8로 설정함
    res.end(err.message); //err.message를 res.end로 돌려줌
  }
})
.listen(8082, () => { //listen(지정된 포트나 경로에 리스너를 만듦)를 사용하여 8082포트에 리스너를 만듦
  console.log('8082번 포트에서 서버 대기 중입니다.'); //위에 코드가 실행이 되면 출력함
})