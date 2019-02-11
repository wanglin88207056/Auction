import {Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { Input } from '@angular/core';


@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.css']
})
export class StarsComponent implements OnInit,OnChanges {
  @Input()
  private rating:number = 0;
  @Output()
  private ratingChange:EventEmitter<number> = new EventEmitter();
  private stars:boolean[];
  @Input()
  private readOnly:boolean = true;
  constructor() { }

  clickStar(index:number){
    if(!this.readOnly){
      this.rating = index+1;
      this.ratingChange.emit(this.rating);
    }
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.stars = [];
    for(let i=1; i<=5; i++ ){
      this.stars.push(i>this.rating)
    }
  }

}
