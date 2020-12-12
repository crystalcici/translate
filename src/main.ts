import {appId, appSecret} from './private';
import * as https from 'https';
import * as querystring from 'querystring';
import md5 = require('md5');

const errMap = {
  52003: '用户认证失败',
  52004: 'error2',
  52005: 'error3',
  unknow: '服务器繁忙',
};

export const translate = (word: string) => {
  const salt = Math.random();
  const sign = md5(appId + word + salt + appSecret);
  let from, to;
  if (/[a-zA-Z]/.test(word[0])) {
    //英译中
    from = 'en';
    to = 'zh';
  } else {
    //中译英
    from = 'zh';
    to = 'en';
  }

  //获取查询字符串
  const query: string = querystring.stringify({
    q: word,
    from,
    to,
    appid: appId,
    salt,
    sign,
  });
  //http://api.fanyi.baidu.com/api/trans/vip/translate?q=apple&from=en&to=zh&appid=2015063000000001&salt=1435660288&sign=f89f9594663708c1605f3d736d01d2d4

  const options = {
    hostname: 'api.fanyi.baidu.com',
    port: 443,
    path: '/api/trans/vip/translate?' + query,
    method: 'GET',
  };

  const request = https.request(options, (response) => {
    let chunks = [];
    response.on('data', (chunk) => {
      chunks.push(chunk);
    });
    response.on('end', () => {
      const string = Buffer.concat(chunks).toString();
      type BaiduResult = {
        err_code?: string;
        err_msg?: string;
        from: string;
        to: string;
        trans_result: {
          src: string;
          dst: string;
        }[];
      };
      const obj: BaiduResult = JSON.parse(string);
      if (obj.err_code in errMap) {
        console.error(errMap[obj.err_code] || obj.err_msg);
        process.exit(2);
      } else {
        console.log(obj.trans_result[0].dst);
        process.exit(0);
      }
    });
  });

  request.on('error', (e) => {
    console.error(e);
  });
  request.end();
};
