

var express = require('express');
var config = require('./config/index.js');
var axios = require('axios');


var app = express();

var apiRouter = express.Router();

//歌单列表接口
apiRouter.get('/getDiscList', function(req, res){
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';
  axios.get(url,{
    headers: {
      authority: 'c.y.qq.com',
      referer: 'https://y.qq.com/'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }).catch((e) => {
    console.log(e);
  });
  
})


//歌词接口
apiRouter.get('/lyric', function(req, res){
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';
  axios.get(url,{
    headers: {
      authority: 'c.y.qq.com',
      referer: 'https://y.qq.com/'
    },
    params: req.query
  }).then((response) => {
    var ret = response.data;
    if(typeof ret === 'string'){
      var reg = /^\w+\(({[^()]+})\)$/;
      var matches = ret.match(reg);
      if(matches){
        ret = JSON.parse(matches[1]);
      }
    }
    res.json(ret);
  }).catch((e) => {
    console.log(e);
  });
  
})

app.use('/api', apiRouter);




app.use(express.static('./dist'));


var port = process.env.PORT || config.build.port;

module.exports = app.listen(port, function(err){
	if(err){
		console.log(err);
		return;
	}

	console.log('Listening at http://localhost:' + port + '\n');
});

























