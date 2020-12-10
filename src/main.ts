import * as https from 'https';
import * as querystring from 'querystring';
import md5 = require('md5');

export const translate = (word: string) => {
  console.log(md5('123'), 'cici');

  const appId = '???';
  const appSecret = '???';
  const salt = Math.random();
  const sign = md5(appId + word + salt + appSecret);
  //获取查询字符串
  const query: string = querystring.stringify({
    q: word,
    from: 'en',
    to: 'zh',
    appid: appId,
    salt: salt,
    sign: sign,
  });
  //http://api.fanyi.baidu.com/api/trans/vip/translate?q=apple&from=en&to=zh&appid=2015063000000001&salt=1435660288&sign=f89f9594663708c1605f3d736d01d2d4

  const options = {
    hostname: 'api.fanyi.baidu.com',
    port: 443,
    path: '/api/trans/vip/translate?' + query,
    method: 'GET',
  };

  const req = https.request(options, (res) => {
    console.log('状态码', res.statusCode);
    console.log('请求头', res.headers);

    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });

  req.on('error', (e) => {
    console.error(e);
  });
  req.end();
};
