import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientService } from '../http-client/httpClient.service';
import { MatDialog } from '@angular/material';
import { CreateDialogComponent } from '../create-dialog/create-dialog.component';
import { SessionClient } from '../create-dialog/SessionClient';
import { StompSubscription } from '@stomp/stompjs';

interface SoundMessage {
  instrument: string,
  tune: string,
  effect: string,
  type: string
}

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

  selectedEffect: string;
  selectedInstrument: string;

  client: SessionClient;
  subscription: StompSubscription;

  constructor(private http2: HttpClient, public dialog: MatDialog) {
    super(http2);
  }

  ngOnInit() {
    this.requestAllSessions();
    document.addEventListener('keypress',e => {


      if(this.client != null) {
        if(this.selectedInstrument != 'DRUM') {
          var tune = '';
          switch(e.code) {
            case 'q': tune = 'C_' + this.client.octave; break; // c
            case 'w': tune = 'D_' + this.client.octave; break; // d
            case 'e': tune = 'E_' + this.client.octave; break; // e
            case 'r': tune = 'F_' + this.client.octave; break; // f
            case 't': tune = 'G_' + this.client.octave; break; // g
            case 'z': tune = 'A_' + this.client.octave; break; // a
            case 'u': tune = 'H_' + this.client.octave; break; // h
            case '2': tune = 'CIS_DES_' + this.client.octave; break; // cis
            case '3': tune = 'DIS_ES_' + this.client.octave; break; // dis
            case '5': tune = 'FIS_GES_' + this.client.octave; break; // fis
            case 'w': tune = 'GIS_AS_' + this.client.octave; break; // gis
            case '7': tune = 'AIS_B_' + this.client.octave; break; // ais
            case 'v': tune = 'C_' + (this.client.octave + 1); break; // c
            case 'b': tune = 'D_' + (this.client.octave + 1); break; // d
            case 'n': tune = 'E_' + (this.client.octave + 1); break; // e
            case 'm': tune = 'F_' + (this.client.octave + 1); break; // f
            case ',': tune = 'G_' + (this.client.octave + 1); break; // g
            case '.': tune = 'A_' + (this.client.octave + 1); break; // a
            case '-': tune = 'H_' + (this.client.octave + 1); break; // h
            case 'g': tune = 'CIS_DES_' + (this.client.octave + 1); break; // cis
            case 'h': tune = 'DIS_ES_' + (this.client.octave + 1); break; // dis
            case 'k': tune = 'FIS_GES_' + (this.client.octave + 1); break; // fis
            case 'l': tune = 'GIS_AS_' + (this.client.octave + 1); break; // gis
            case 'ö': tune = 'AIS_B_' + (this.client.octave + 1); break; // ais
          }
          var soundMessage = {instrument: this.selectedInstrument,tune: tune,effect: this.selectedEffect,type: 'SOUND'};
          this.client.client.send('/app/jamsession/' + this.client.sessionId + '/sendChatMessage',
          {},
          JSON.stringify(soundMessage)
          );
        } else {
          // TODO DRUM
        }
      }
    });
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

  // Anfrage für alle verfügbaren Soundfiles (getestet)
  requestAllSounds(instrument: string, pitch: string, effect: string) {
    if (this.selectedSessionName !== null && this.playerName !== null) {
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

  openJoinDialog(session: string) {
    const dialogRef = this.dialog.open(CreateDialogComponent,
      {
        width: '500px',
        panelClass: 'create-dialog', // this is a css class from styles.css
        data: {
          onlyJoin: true,
          sessionId: session,
        }
      });

    dialogRef.afterClosed().subscribe(data => {
      if(data != undefined) {
        this.client = data;
        this.selectedEffect = this.client.sounds[0].effect;
        // funktioniert noch nicht
        this.subscription = this.client.client.subscribe('/jamsession/' + data.sessionId, message => {
          const body = JSON.parse(message.body);
          if(body.type = "JOIN") {
            this.updateSoundIdList();
          } else if(body.type = "SOUND") {
            console.log(body);
            //this.requestAllSounds(instrument: message.body.instrument, pitch: body.effect, effect: string);
          }
        }, error => {
          this.errorBoolean = true;
        });
        this.client.client.send('/app/jamsession/' + data.sessionId + '/sendChatMessage',
        {},
        JSON.stringify({sender: data.user, type: 'JOIN'})
        );
      }
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(CreateDialogComponent,
      {
        width: '500px',
        panelClass: 'create-dialog', // this is a css class from styles.css
        data: {
          onlyJoin: false
        }
      });

    dialogRef.afterClosed().subscribe(data => {
      if(data != undefined) {
        this.client = data;
        this.selectedEffect = this.client.sounds[0].effect;
        this.subscription = this.client.client.subscribe('/jamsession/' + data.sessionId, message => {
          const body = JSON.parse(message.body);
          if(body.type = "JOIN") {
            this.updateSoundIdList();
          } else if(body.type = 'SOUND') {
            console.log(body);
            //TODO
          }
        }, error => {
          this.errorBoolean = true;
        });
        this.client.client.send('/jamsession/' + data.sessionId + '/sendChatMessage',{},
        JSON.stringify({sender: data.user, type: 'JOIN'}));
      }
    });
  }

  private updateSoundIdList() {
    this.getAllSoundIdsForSession(this.client.sessionId,this.client.password).subscribe(response => {
      this.client.sounds = response;
    }, error => {
      //handle error
    });
  }
}
