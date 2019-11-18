# 封装对si-server的client端的sdk方法
对si-server的api调用方法进行封装

## 安装

```sh
kml install kml-si-client
```



## 使用

```javascript
var OAuthAPI = require('../api/oauth_api'), //使用用户授权访问接口
  RedisStore = require('../adapters/redis_store'), //存储access_token在redis
  redis_client = require('./redis-promisify'); //返回Promise化的redis客户端

//指定RedisStore的redis客户端使用redis_client，定义redis中使用的key，包含client_id
var redis_store = new RedisStore(redis_client, 'OT:' + client_id);

//生成OAuthAPI实例，需要传入预先得到的client_id, client_secret, 设置服务器的HOST, 定义使用RedisStore的方法来读取token
var oauth_api = new OAuthAPI(client_id, client_secret, HOST, redis_store.getToken, redis_store.saveToken);

//使用api
oauth_api.doSomeThing();
```



## api使用

- AppApi封装了对app应用的管理相关api以及对应的access_token
- ClientApi封装了对client客户的管理相关api以及对应的access_token
- OAuthApi封装了对client客户的用户授权相关api以及对应的oauth_token



## access_token的持久化

- FileStore把access_token存储在本地文件，在同一台服务器上的多个集群应用都能访问
- RedisStore把access_token存储在Redis服务中，多个服务器或多个集群应用都能访问

