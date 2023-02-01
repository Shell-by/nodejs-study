const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', {
    title: "경소고 Nodejs 수행평가1", 
    a: ["Home", "User", "Like", "File", "Error"], 
    route: ["/", "/user", "/user/like", "/multipart.html", "/afe"],
    text: "수행평가 성실히 임해주세요.",
    school: "경북소프트웨어고등학교",
  });
});

module.exports = router;