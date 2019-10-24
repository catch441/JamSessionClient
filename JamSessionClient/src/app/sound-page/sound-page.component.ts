import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientService } from '../http-client/httpClient.service';


export interface Sounds {
  name: string;
  src: string;
}

@Component({
  selector: 'app-sound-page',
  templateUrl: './sound-page.component.html',
  styleUrls: ['./sound-page.component.css']
})

export class SoundPageComponent extends HttpClientService implements OnInit {

  constructor(private http2: HttpClient) {
    super(http2);
  }

  allSounds: Sounds [] = [
    {name: 'Long', src: '../../assets/2.mp3'},
    {name: 'Short', src: '../../assets/1.mp3'},
  ];

  ngOnInit() {
  }

  playSound(src: string) {

    const audio = new Audio();
    audio.src = src;
    audio.load();
    audio.play();
 }
}
