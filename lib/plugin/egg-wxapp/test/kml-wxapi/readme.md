# 微信平台接口封装

集成wx4api的接口sdk



## 安装

```sh
kml install kml-wxapi
```



## 使用SDK

```javascript
var WxApi = require('../lib/wxapi');

var wxapi = new WxApi({
  api_host: 'http://localhost:3800/', //wx4api服务器
  wx_app: 'walker' //对应的内部app名
});

wxapi.getJsConfig({/* ... */})
.then(function(result){
  //....
})
```



## 使用中间件

```javascript
/*router使用中间件*/
const mw_oauth = require('kml-wxapi/lib/mw/oauth')({
        api_regexp: ['/t/wx/index'],
        wechat: config.wechat,
        server_id: config.system.project_name,
        wx_state: config.system.project_name
    });
//解析用户微信授权
router.use(mw_oauth.mw);


/*经过中间件处理后的“/t/wx/index”判断授权情况*/
let oauth_result = req.oauth_result;
let oauth_settings = req.oauth_settings;
let storage_openid = oauth_settings.storage_openid;
const OPEN_ID = oauth_settings.session_open_id;

if (storage_openid) {
  //已经有了openid直接跳转到首页
  return res.redirect(targetUrl);
}

if (oauth_result.ret === 'OK') {
  let mpuser = oauth_result.content;
  //设置cookie和session记录openid
  session[OPEN_ID] = mpuser.openid;
  session.mpuser = mpuser;
  res.cookie(OPEN_ID, mpuser.openid);

  return res.redirect(targetUrl);
}
```

