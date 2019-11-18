## 1.0.1@2017-03-10

-  增加RedisStore适配器，存储access_token在Redis中
- 改写oauth_token.test.js使用RedisStore

## 1.0.2@2017-03-15

- api增加强制隐身模式
- 取消api中默认的FileStore存储access_token

## 1.0.3@2017-03-20

- 增加access_token失效后重试的处理

## 1.0.4@2017-04-13

- 调整api的路径不以/开头，避免host存在一级目录时调用错误

## 1.0.5@2017-04-20

- 调整第三方授权客户端的接口方法定义

## 1.0.6@2017-08-18

- redis_store在getToken没有取到值后，直接返回null


## 1.0.7@2017-09-18

- 修改在请求接口返回401状态下重试access_token后，用了get方法发起了新的url请求错误，应该根据type调用相应的方法


