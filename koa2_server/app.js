// 服务器的入口文件
// 创建KOA的实例对象
const Koa = require("koa");
const app = new Koa();

// 绑定中间件
// 计算总耗时的中间件
// 第一次进入咱们中间件的时候，就记录一个开始的时间，当其他所有中间件都执行完之后，再记录下结束时间以后，将两者相减就得出总耗时
// 将计算出来的结果,设置到响应头的 X-Response-Time 中, 单位是毫秒ms
const respDurationMiddleware = require("./middleware/koa2_response_duration");
app.use(respDurationMiddleware);
// 设置响应头的中间件
const respHeaderMiddleware = require("./middleware/koa2_response_header");
app.use(respHeaderMiddleware);
// 读取数据的中间件
const respDataMiddleware = require("./middleware/koa2_response_data");
app.use(respDataMiddleware);
// 绑定一个端口号：8888
app.listen(8888);

const webSocketService = require("./service/web_socket_service");
// 开启服务端的监听, 监听客户端的连接
// 当某一个客户端连接成功之后, 就会对这个客户端进行message事件的监听
webSocketService.listen();
