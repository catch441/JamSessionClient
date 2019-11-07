import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientService } from '../http-client/httpClient.service';
import { SoundInterface } from '../http-client/SoundInterface';


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

  allAudioFiles: SoundInterface[] = [
    {instrumentType: 'BANJO', pitchType: 'C_1', effect: 'NONE', data: null},
    {instrumentType: 'BANJO', pitchType: 'C_3', effect: 'NONE', data: null},
    {instrumentType: 'BANJO', pitchType: 'CIS_DES_4', effect: 'NONE', data: null},
    {instrumentType: 'BANJO', pitchType: 'FIS_GES_5', effect: 'NONE', data: null},
    {instrumentType: 'BANJO', pitchType: 'AIS_B_5', effect: 'NONE', data: null},
  ];

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
