import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor() { }

  showInfo = true;
  showSession = false;
  showSounds = false;

  changeForInfoPage() {
    this.showInfo = true;
    this.showSession = false;
    this.showSounds = false;
  }

  changeForSoundsPage() {
    this.showInfo = false;
    this.showSession = false;
    this.showSounds = true;
  }

  changeForSessionPage() {
    this.showInfo = false;
    this.showSession = true;
    this.showSounds = false;
  }

  ngOnInit() {
  }

}
