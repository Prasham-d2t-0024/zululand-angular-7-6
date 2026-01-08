import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'ds-home-card',
  templateUrl: './home-card.component.html',
  styleUrls: ['./home-card.component.scss']
})
export class HomeCardComponent implements OnInit {
 @Input() cardData: any;
 @Input() cardChartdata: any;
  constructor() {
  }

  ngOnInit(): void {
  }

}
