import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  searchEvent:EventEmitter<ProductSearchParams> = new EventEmitter();

  constructor(private http: HttpClient){ }

  getAllCategories():string[]{
    return ['电子产品','硬件设备','图书']
  }

  getProducts(): Observable<any>{
    return this.http.get('/api/products');
  }
  getProduct(id:number): Observable<any>{
    return this.http.get("/api/product/"+id);
  }

  getCommentsForProductId(id:number): Observable<any>{
    return this.http.get("/api/product/"+id+"/comments");
  }

  search(params:ProductSearchParams):Observable<any>{
    // 构建一个 HttpParams 对象
    return this.http.get('/api/products',{
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' }),
      params: this.encodeParams(params)});
  }
  encodeParams(params:ProductSearchParams){
    var arrKey =  Object.keys(params).filter(key => params[key]);
    let httpParams = new HttpParams();
    arrKey.forEach(function(item){
      httpParams = httpParams.set(item,params[item]);
    });
    return httpParams;
      /*.reduce((sum:HttpParams,key:string) =>{
        sum.set(key,params[key]);
        return sum;
      },new HttpParams());*/
  }

}
export class ProductSearchParams {
  constructor(public title:string,
              public price: number,
              public category:string){}
}

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




