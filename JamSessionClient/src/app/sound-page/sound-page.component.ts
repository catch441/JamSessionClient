import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sound-page',
  templateUrl: './sound-page.component.html',
  styleUrls: ['./sound-page.component.css']
})
export class SoundPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  playSound1() {
    const audio = new Audio();
    audio.src = '../../assets/2.mp3';
    audio.load();
    audio.play();
  }

  playSound2() {
    const audio = new Audio();
    audio.src = '../../assets/1.mp3';
    audio.load();
    audio.play();
  }
}
