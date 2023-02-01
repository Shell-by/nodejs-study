const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('user', {
    a: ["Home", "User", "Like", "File", "Error"], 
    route: ["/", "/user", "/user/like", "/multipart.html", "/afe"],
    school: "경북소프트웨어고등학교",
    name: "이준환",
    user: "user2213",
  });
});

router.get('/like', (req, res) => {
  res.render('userlike', {
    a: ["Home", "User", "Like", "File", "Error"], 
    route: ["/", "/user", "/user/like", "/multipart.html", "/afe"],
    school: "경북소프트웨어고등학교",
    like: "내가 좋아하는 것은 휴강입니다.",
    likes: "Like 내가 좋아하는 것은 휴강입니다.",
  });
});

module.exports = router;