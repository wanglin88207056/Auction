import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  ws:WebSocket;
  constructor() { }

  createObservableSocket(url:string,id:number): Observable<any>{
    this.ws = new WebSocket(url);
    return new Observable(
      observe=>{
        this.ws.onmessage = (event) => observe.next(event.data);
        this.ws.onerror = (event) => observe.error(event);
        this.ws.onclose = (event) => observe.complete();
        this.ws.onopen = (event) => this.sendMessage({productId:id})
        return () => this.ws.close();
      }
    )
  }

  sendMessage(message:any){
    this.ws.send(JSON.stringify(message));
  }
}
