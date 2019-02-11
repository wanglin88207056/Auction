"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var ws_1 = require("ws");
var path = require("path");
var Comment = /** @class */ (function () {
    function Comment(id, productId, timestamp, user, rating, content) {
        this.id = id;
        this.productId = productId;
        this.timestamp = timestamp;
        this.user = user;
        this.rating = rating;
        this.content = content;
    }
    return Comment;
}());
exports.Comment = Comment;
var comments = [
    new Comment(1, 1, "2018-06-12 21:00:00", "王大师", 3, "东西还不错"),
    new Comment(2, 1, "2018-05-13 22:00:00", "叶老师", 4, "东西非常好"),
    new Comment(3, 1, "2018-03-14 23:00:00", "连长", 3, "东西达到预期"),
    new Comment(4, 2, "2018-02-15 24:00:00", "宝宝", 4, "东西很好看")
];
var Product = /** @class */ (function () {
    function Product(id, title, price, rating, desc, categroies) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.rating = rating;
        this.desc = desc;
        this.categroies = categroies;
    }
    return Product;
}());
exports.Product = Product;
var products = [
    new Product(1, "第一个商商品", 1.99, 3.5, "这是第一个商品，是我在学习慕课网Angular入门实战时创建的", ["电子产品", "硬件设备"]),
    new Product(2, "第二个商商品", 2.99, 2.5, "第二个商商品，是我在学习慕课网Angular入门实战时创建的", ["图书", "硬件设备"]),
    new Product(3, "第三个商商品", 3.99, 4.5, "第三个商商品，是我在学习慕课网Angular入门实战时创建的", ["电子产品", "硬件设备"]),
    new Product(4, "第四个商商品", 4.99, 2.5, "第四个商商品，是我在学习慕课网Angular入门实战时创建的", ["图书", "软件"]),
    new Product(5, "第五个商商品", 5.99, 2.5, "这是第五个商品，是我在学习慕课网Angular入门实战时创建的", ["电子产品"]),
    new Product(6, "第六个商商品", 6.99, 1.5, "这是第六个商品，是我在学习慕课网Angular入门实战时创建的", ["电子产品", "图书"])
];
var app = express();
app.use('/', express.static(path.join(__dirname, '..', 'client')));
/*app.get('/',(req,res)=>{
    res.send("hello,express");
});*/
app.get('/api/products', function (req, res) {
    var result = products;
    var params = req.query;
    if (params.title) {
        result = result.filter(function (p) { return p.title.indexOf(params.title) !== -1; });
    }
    if (params.price && result.length > 0) {
        result = result.filter(function (p) { return p.price <= parseInt(params.price); });
    }
    if (params.category !== "-1" && result.length > 0) {
        result = result.filter(function (p) { return p.categroies.indexOf(params.category) !== -1; });
    }
    res.json(result);
});
app.get("/api/product/:id", function (req, res) {
    console.log("paramsId", req.params.id);
    res.json(products.find(function (product) { return product.id == req.params.id; }));
});
app.get("/api/product/:id/comments", function (req, res) {
    res.json(comments.filter(function (comment) { return comment.productId == req.params.id; }));
});
var server = app.listen(8000, "localhost", function () {
    console.log("服务器已经启动，地址是：http:localhost:8000");
});
var subscriptions = new Map();
var wsServer = new ws_1.Server({ port: 8085 });
wsServer.on('connection', function (websocket) {
    /*websocket.send("这个消息是服务器主动推送的")*/
    websocket.on("message", function (message) {
        var messageObj = JSON.parse(message.toString());
        var productIds = subscriptions.get(websocket) || [];
        subscriptions.set(websocket, productIds.concat([messageObj.productId]));
    });
});
var currentBids = new Map();
setInterval(function () {
    products.forEach(function (p) {
        var currentBid = currentBids.get(p.id) || p.price;
        var newBid = currentBid * (Math.random() + 0.5);
        currentBids.set(p.id, newBid);
    });
    subscriptions.forEach(function (productIds, ws) {
        if (ws.readyState === 1) {
            var newBids = productIds.map(function (pid) { return ({
                productId: pid,
                bid: currentBids.get(pid)
            }); });
            ws.send(JSON.stringify(newBids));
        }
        else {
            subscriptions.delete(ws);
        }
    });
}, 2000);
/*
setInterval(() => {
    if(wsServer.clients){
        wsServer.clients.forEach(client => {
            client.send("这是定时推送");
        })
    }
},2000);*/
//# sourceMappingURL=auction_server.js.map