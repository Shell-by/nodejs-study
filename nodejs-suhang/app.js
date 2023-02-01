const express = require('express');
const dotenv = require('dotenv');
const nunjucks = require('nunjucks');
const morgan = require('morgan');
const path = require('path');
const multer = require('multer');

dotenv.config();
const app = express();

app.set('port', process.env.PORT);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extends: false}));

app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads/');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
      console.log(path.basename(file.originalname, ext));
    },
  }),
  limits: {fileSize: 5 * 1024 * 1024},
});

app.get('/multipart.html', (req, res, next) => {
  res.sendFile(path.join(__dirname, "public/multipart.html"));
});

app.post('/upload', upload.single('file'), (req, res) => {
  res.render('file', {
    a: ["Home", "User", "Like", "File", "Error"], 
    route: ["/", "/user", "/user/like", "/multipart.html", "/afe"],
    school: "경북소프트웨어고등학교",
    text: "파일 업로드 성공",
    text2: "File 파일 업로드 성공",
  });
});

app.use((req, res, next) => {
  const error = new Error(`NOT FOUND`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = err;
  res.status(err.status || 500);
  res.render('error', {
    a: ["Home", "User", "Like", "File", "Error"], 
    route: ["/", "/user", "/user/like", "/multipart.html", "/afe"],
    school: "경북소프트웨어고등학교",
    message: err.message,
    status: err.status,
    stack: err.stack,
  });
})

app.listen(app.get('port'), () => {
  console.log(app.get('port'));
});