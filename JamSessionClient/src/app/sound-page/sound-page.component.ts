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
    {instrumentType: 'BANJO', pitchType: 'DIS_ES_4', effect: 'NONE', data: null},
    {instrumentType: 'DIDGERIDOO', pitchType: 'AIS_B_5', effect: 'NONE', data: null},
    {instrumentType: 'DIDGERIDOO', pitchType: 'C_2', effect: 'NONE', data: null},
    {instrumentType: 'DIDGERIDOO', pitchType: 'C_3', effect: 'NONE', data: null},
    {instrumentType: 'DIDGERIDOO', pitchType: 'D_4', effect: 'NONE', data: null},
    {instrumentType: 'DIDGERIDOO', pitchType: 'E_3', effect: 'NONE', data: null},
    {instrumentType: 'DIDGERIDOO', pitchType: 'E_5', effect: 'NONE', data: null},
    {instrumentType: 'HARP', pitchType: 'AIS_B_5', effect: 'NONE', data: null},
    {instrumentType: 'HARP', pitchType: 'C_2', effect: 'NONE', data: null},
    {instrumentType: 'HARP', pitchType: 'C_3', effect: 'NONE', data: null},
    {instrumentType: 'HARP', pitchType: 'E_5', effect: 'NONE', data: null},
    {instrumentType: 'HARP', pitchType: 'CIS_DES_4', effect: 'NONE', data: null},
    {instrumentType: 'HARP', pitchType: 'E_3', effect: 'NONE', data: null},
  ];

  ngOnInit() {
  }

  // Anfrage für alle verfügbaren Soundfiles (getestet)
  requestAllSounds(instrument: string, pitch: string, effect: string) {
    if (this.allAudioFiles !== null) {
      this.getSoundFile(instrument, pitch, effect).subscribe((data: Blob) => {
        const blob = new Blob([data], { type : 'audio/wav; codecs=0' });
        const url = URL.createObjectURL(blob);
        const audio = new Audio();
        audio.src = url;
        audio.load();
        audio.play();
      }, error => {
        this.handleError(error);
      });
    } else {
      // iwie noch ein Error Anzeigen
    }
  }
}
