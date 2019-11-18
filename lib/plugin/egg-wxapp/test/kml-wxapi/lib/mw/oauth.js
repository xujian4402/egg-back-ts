/**
 * 微信公众号用户网页授权许可中间件
 * Created by lintry on 2017/9/26.
 */

/**
 *
 * @param options {{api_regexp, wechat, pass_storage_openid, server_id}}
 * @return {{mw: mw, regexp: Array}}
 *
 * options说明:
 * api_regexp: 中间件需要识别的正则（字符串、表达式、数组)， 必须
 * wechat: wxapi的配置，必须
 * pass_storage_openid: 是否忽略已经得到的openid，默认false
 * server_id: 区分session存储openid的key，默认无
 *
 *
 * 返回说明:
 * 0. 中间件在req中注入oauth_settings对象，记录storage_openid和存储在session中的key名称：session_open_id
 * 1. 如果有pass_storage_openid参数为true，且当前session或cookie中也得到了openid，
 *    认为已经授权并获得了用户信息，则直接通过，后续代码根据req.oauth_settings的内容自行判断
 * 2. 没有code的时候自动跳转到微信授权页（如果type=json则返回跳转url给前端，自行跳转）
 *    有code的时候验证code后获取用户信息，通过req.oauth_result传递结果成功与否，
 *    如果得到了真实的用户数据，通过req.oauth_settings.storage_openid存储对应的openid
 *    由后续代码自行判断处理逻辑
 *
 * 依赖：
 * kml-original-url-mw: 获取req.original_uri，依赖于nginx配置
 */
module.exports = function (options) {
    const url_utils = require('url'),
        Result = require('kml-express-stage-lib').Result,
        lib_utils = require('kml-express-stage-lib').LibUtils;

    if (!options) options = {};
    let api_regexp = options.api_regexp; //中间件需要识别的正则（字符串、表达式、数组）
    if (typeof api_regexp === 'string') {
        api_regexp = [new RegExp(api_regexp)];
    } else if (api_regexp instanceof RegExp) {
        api_regexp = [api_regexp];
    }
    const pass_storage_openid = options.pass_storage_openid; //是否忽略已经得到的openid
    const SERVER_ID = options.server_id || "", //区分session存储openid的key
        OPEN_ID = "OPENID" + SERVER_ID; //默认cookie中openid键
    const wxapi = require('../../index')(options.wechat); //wxapi的配置
    const WX_STATE = options.wx_state;

    const oauth_index = function (req, res, next) {
        let query = req.query, code = query.code, state = query.state, type = query.type;
        let session = req.session, cookies = req.cookies;
        let originalUrl = req.originalUrl;
        let origin_uri = req.original_uri;

        // console.log('debug oauth', origin_uri, originalUrl, req.baseUrl, req.url);

        let storage_openid = session[OPEN_ID] || cookies[OPEN_ID];
        req.oauth_settings = {
            storage_openid: storage_openid,
            session_open_id: OPEN_ID
        };

        //不符合url结构，直接忽略
        if (!lib_utils.array_match(api_regexp, url_utils.parse(originalUrl).pathname)) {
            req.oauth_result = {};
            next();
            return null;
        }

        if (pass_storage_openid && storage_openid) {
            req.oauth_result = {};
            next();
            return null;
        }
        let scope = options.scope || 'snsapi_userinfo';

        if (!code) { //请求授权
            wxapi.getAuthorizeURL(origin_uri.url, WX_STATE, scope)
                .then(function (result) {
                    if (result.ret === 'OK') {
                        if (type === 'json') {
                            req.oauth_result = result
                        } else {
                            let redirectUrl = result.content.redirect_url;
                            res.redirect(redirectUrl);
                            return null;
                        }
                    } else {
                        req.oauth_result = Result.Error('请求授权错误', result);
                    }
                    next();
                })
                .catch(function (e) {
                    req.oauth_result = Result.Error('请求授权错误', e);
                    next();
                });
        } else { //得到授权结果
            if (state && WX_STATE === state) {
                //授权通过
                return wxapi.getUserByCode(code)
                    .then(function (result) {
                        req.oauth_result = result || {};
                        next();
                    })
                    .catch(function (err_result) {
                        req.oauth_result = Result.Error('获取授权用户信息错误', err_result);
                        next();
                    });

            } else {
                //拒绝授权
                req.oauth_result = Result.Error('微信网页授权被拒绝', {scope: scope, state: scope, wx_state: WX_STATE});
                next();
            }
        }

        return null;
    };

    return {
        mw: oauth_index,
        regexp: api_regexp
    }
};
