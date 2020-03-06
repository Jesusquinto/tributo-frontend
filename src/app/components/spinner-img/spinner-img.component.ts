import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'loader-img',
  templateUrl: './spinner-img.component.html',
  styleUrls: ['./spinner-img.component.scss']
})
export class SpinnerImgComponent implements OnInit {


  @Input() spinnerColor: string;
  @Input() spinnerMargin: string;

  @Input() imgWidth: string;
  @Input() imgHeight: string;
  @Input() imgBackground: string;
  @Input() imgBorderRadius: string;
  @Input() imgPadding: string;
  @Input() imgPosition: string;
  @Input() imgSrc: String;

  loading: boolean = true

  onLoad() {
    this.loading = false;
  }

  constructor() { }

  ngOnInit() { }

}