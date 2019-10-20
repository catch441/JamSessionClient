import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientService } from '../http-client/httpClient.service';
import { SoundInterface } from '../http-client/SoundInterface';

@Component({
  selector: 'app-session-page',
  templateUrl: './session-page.component.html',
  styleUrls: ['./session-page.component.css']
})
export class SessionPageComponent extends HttpClientService implements OnInit {

  spinningBool = false;
  sessions: Array<string>;
  pitches: Array<string>;
  soundfiles: Array<string>;
  instruments: Array<string>;
  effects: Array<string>;
  noSessions = false;
  selectedSessionName: string;
  playerName: string;

  constructor(private http2: HttpClient) {
    super(http2);
  }

  ngOnInit() {
    this.requestAllSessions();
  }
  // Anfrage für alle Sessions
  requestAllSessions() {
    this.spinningBool = true;
    this.getAllSessions().subscribe((data: Array<string>) => {
      this.sessions = data;
      this.spinningBool = false;
      if (this.sessions.length === 0) {
        this.noSessions = true;
      } else {
        this.noSessions = false;
      }
    }, error => {
      this.handleError(error);
      this.spinningBool = false;
    });
  }

  // Anfrage für alle verfügbaren Pitches (getestet, es funktioniert)
  requestAllPitches() {
    this.getAllPitches().subscribe((data: Array<string>) => {
      this.pitches = data;
    }, error => {
      this.handleError(error);
    });
  }

  // Anfrage für alle verfügbaren Soundfiles (nicht getestet)
  requestAllSounds() {
    if (this.selectedSessionName !== null && this.playerName !== null) {
      // this.getAllSoundfilesForAJamSession(this.selectedSessionName, this.playerName)
       this.getAllSoundfilesForAJamSession(this.selectedSessionName, this.playerName).subscribe((data: Array<string>) => {
         this.soundfiles = data;
       }, error => {
         this.handleError(error);
       });
    } else {
      // iwie noch ein Error Anzeigen
    }
  }

  // anfrage für alle verfügbaren Instrument (getestet, es funktioniert)
  requestAllInstruments() {
    this.getAllInstruments().subscribe((data: Array<string>) => {
      this.instruments = data;
    }, error => {
      this.handleError(error);
    });
  }

  // anfrage für alle verfügbaren Effekte (getestet, es funktioniert)
  requestAllEffects() {
    this.getAllEffects().subscribe((data: Array<string>) => {
      this.effects = data;
    }, error => {
      this.handleError(error);
    });
  }

  // hinzufügen von sound an einen player (nicht getestet)
  /*postSoundToPlayer(playerName: string, instrumenttype: string, effectType: string, pitchtype: string) {
    if (instrumenttype !== null && effectType !== null && pitchtype !== null) {
       const sound: SoundInterface = {effect: effectType, instrumentType: instrumenttype, pitchType: pitchtype};
    } else {
      // iwie noch ein error anzeigen
    }
    if (this.selectedSessionName !== null && playerName !== null) {
        this.addSoundToPlayer(this.selectedSessionName, playerName, sound)
    } else {
      // iwie noch ein Error anzeigen
    }
  }*/
}
