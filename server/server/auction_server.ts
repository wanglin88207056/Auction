import * as express from "express";
import{Server} from 'ws';
import * as path from 'path';

export class Comment{
    constructor(
        public id: number,
        public productId: number,
        public timestamp: string,
        public user: string,
        public rating: number,
        public content: string,
    ){}
}

const comments:Comment[] = [
    new Comment(1,1,"2018-06-12 21:00:00","王大师",3,"东西还不错"),
    new Comment(2,1,"2018-05-13 22:00:00","叶老师",4,"东西非常好"),
    new Comment(3,1,"2018-03-14 23:00:00","连长",3,"东西达到预期"),
    new Comment(4,2,"2018-02-15 24:00:00","宝宝",4,"东西很好看")
];

export class Product{
    constructor(
        public id:number,
        public title:string,
        public price:number,
        public rating:number,
        public desc:string,
        public categroies:Array<string>
    ){}
}
const products: Product[] = [
    new Product(1,"第一个商商品",1.99,3.5,"这是第一个商品，是我在学习慕课网Angular入门实战时创建的",["电子产品","硬件设备"]),
    new Product(2,"第二个商商品",2.99,2.5,"第二个商商品，是我在学习慕课网Angular入门实战时创建的",["图书","硬件设备"]),
    new Product(3,"第三个商商品",3.99,4.5,"第三个商商品，是我在学习慕课网Angular入门实战时创建的",["电子产品","硬件设备"]),
    new Product(4,"第四个商商品",4.99,2.5,"第四个商商品，是我在学习慕课网Angular入门实战时创建的",["图书","软件"]),
    new Product(5,"第五个商商品",5.99,2.5,"这是第五个商品，是我在学习慕课网Angular入门实战时创建的",["电子产品"]),
    new Product(6,"第六个商商品",6.99,1.5,"这是第六个商品，是我在学习慕课网Angular入门实战时创建的",["电子产品","图书"])
];
const app = express();

app.use('/',express.static(path.join(__dirname,'..','client')));

/*app.get('/',(req,res)=>{
    res.send("hello,express");
});*/

app.get('/api/products',(req,res) => {
    let result = products;
    let params = req.query;
    if(params.title){
        result = result.filter((p) => p.title.indexOf(params.title) !== -1);
    }
    if(params.price && result.length > 0){
        result = result.filter((p) => p.price <= parseInt(params.price));
    }
    if(params.category !== "-1" && result.length > 0){
        result = result.filter((p) => p.categroies.indexOf(params.category) !== -1);
    }
    res.json(result);
});
app.get("/api/product/:id",(req,res)=>{
    console.log("paramsId",req.params.id);
    res.json(products.find(product => product.id == req.params.id));
});
app.get("/api/product/:id/comments",(req,res)=>{
    res.json(comments.filter((comment) => comment.productId == req.params.id));
});
const server = app.listen(8000,"localhost",()=>{
    console.log("服务器已经启动，地址是：http:localhost:8000");
});
const subscriptions = new Map<any, number[]>();
const wsServer = new Server({port: 8085});
wsServer.on('connection',websocket=>{
   /*websocket.send("这个消息是服务器主动推送的")*/
   websocket.on("message",message => {
       let messageObj = JSON.parse(message.toString());
       let productIds = subscriptions.get(websocket) || [];
       subscriptions.set(websocket, [...productIds,messageObj.productId]);
   })
});
const currentBids = new Map<number,number>();
setInterval(() => {
    products.forEach( p => {
        let currentBid = currentBids.get(p.id) || p.price;
        let newBid = currentBid * (Math.random()+0.5);
        currentBids.set(p.id,newBid);
    });
    subscriptions.forEach((productIds:number[],ws) => {
        if(ws.readyState === 1){
            let newBids = productIds.map( pid => ({
                productId: pid,
                bid: currentBids.get(pid)
            }))
            ws.send(JSON.stringify(newBids));
        }else{
            subscriptions.delete(ws);
        }

    })
},2000);
/*
setInterval(() => {
    if(wsServer.clients){
        wsServer.clients.forEach(client => {
            client.send("这是定时推送");
        })
    }
},2000);*/
