import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientService } from '../http-client/httpClient.service';
import { MatDialog } from '@angular/material';
import { CreateDialogComponent } from '../create-dialog/create-dialog.component';
import { SessionClient } from '../create-dialog/SessionClient';
import { StompSubscription } from '@stomp/stompjs';
import { SoundInterface } from '../http-client/SoundInterface';
import { FormControl } from '@angular/forms';


interface SoundMessage {
  instrument: string;
  tune: string;
  effect: string;
  type: string;
}

interface ChatMessage {
  sender: string;
  message: string;
}

interface SoundBlobUrl {
  blob: Blob;
  url: string;
}

@Component({
  selector: 'app-session-page',
  templateUrl: './session-page.component.html',
  styleUrls: ['./session-page.component.css']
})
export class SessionPageComponent extends HttpClientService implements OnInit, OnDestroy {

  spinningBool = false;
  sessions: Array<string>;
  pitches: Array<string>;
  soundfiles: Array<string>;
  instruments: Array<string>;
  effects: Array<string>;
  noSessions = false;
  selectedSessionName: string;
  playerName: string;
  audio = new Audio();
  chatMessages = new Array<ChatMessage>();
  chatFormControl = new FormControl();
  chatFocus = false;

  selectedEffect = new Map<string, string>();
  selectedInstrument: string;
  selectDrumOrNot = false;

  downloadedSounds = new Map<string, SoundBlobUrl>();

  client: SessionClient;
  subscription: StompSubscription;

  constructor(private http2: HttpClient, public dialog: MatDialog) {
    super(http2);
    document.addEventListener('keypress', e => {
      if (this.client != null && !this.chatFocus) {
        if (this.selectedInstrument !== 'DRUM') {
          let tune = '';
          switch (e.code) {
            case 'KeyQ': tune = 'C_' + this.client.octave; break; // c
            case 'KeyW': tune = 'D_' + this.client.octave; break; // d
            case 'KeyE': tune = 'E_' + this.client.octave; break; // e
            case 'KeyR': tune = 'F_' + this.client.octave; break; // f
            case 'KeyT': tune = 'G_' + this.client.octave; break; // g
            case 'KeyY': tune = 'A_' + this.client.octave; break; // a
            case 'KeyU': tune = 'H_' + this.client.octave; break; // h
            case 'Digit2': tune = 'CIS_DES_' + this.client.octave; break; // cis
            case 'Digit3': tune = 'DIS_ES_' + this.client.octave; break; // dis
            case 'Digit5': tune = 'FIS_GES_' + this.client.octave; break; // fis
            case 'Digit6': tune = 'GIS_AS_' + this.client.octave; break; // gis
            case 'Digit7': tune = 'AIS_B_' + this.client.octave; break; // ais
            case 'KeyV': tune = 'C_' + (this.client.octave + 1); break; // c
            case 'KeyB': tune = 'D_' + (this.client.octave + 1); break; // d
            case 'KeyN': tune = 'E_' + (this.client.octave + 1); break; // e
            case 'KeyM': tune = 'F_' + (this.client.octave + 1); break; // f
            case 'Comma': tune = 'G_' + (this.client.octave + 1); break; // g
            case 'Period': tune = 'A_' + (this.client.octave + 1); break; // a
            case 'Slash': tune = 'H_' + (this.client.octave + 1); break; // h
            case 'KeyG': tune = 'CIS_DES_' + (this.client.octave + 1); break; // cis
            case 'KeyH': tune = 'DIS_ES_' + (this.client.octave + 1); break; // dis
            case 'KeyK': tune = 'FIS_GES_' + (this.client.octave + 1); break; // fis
            case 'KeyL': tune = 'GIS_AS_' + (this.client.octave + 1); break; // gis
            case 'Semicolon': tune = 'AIS_B_' + (this.client.octave + 1); break; // ais
          }
          if (tune !== '') {
            const soundMessage = {instrument: this.selectedInstrument, tune: tune,
              effect: this.selectedEffect.get('notdrum'), type: 'SOUND'};
            this.client.client.send('/app/jamsession/' + this.client.sessionId + '/sendSoundMessage',
            {},
            JSON.stringify(soundMessage)
            );
          }
        } else {
          if (this.selectedInstrument === 'DRUM') {
            let tune = '';
            let effect = '';
            switch (e.code) {
              case 'KeyC': tune = 'CRASH'; effect = this.selectedEffect.get('CRASH'); break;
              case 'KeyV': tune = 'HITHAT'; effect = this.selectedEffect.get('HITHAT'); break;
              case 'KeyB': tune = 'KICK'; effect = this.selectedEffect.get('KICK'); break;
              case 'KeyN': tune = 'SNARE'; effect = this.selectedEffect.get('SNARE'); break;
              case 'KeyM': tune = 'TOM'; effect = this.selectedEffect.get('TOM'); break;
            }
            if (tune !== '') {
              const soundMessage = {instrument: this.selectedInstrument, tune: tune, effect: effect, type: 'SOUND'};
              this.client.client.send('/app/jamsession/' + this.client.sessionId + '/sendSoundMessage',
              {},
              JSON.stringify(soundMessage)
              );
            }
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); 
    this.soundfiles = [];
    this.effects = [];
    this.pitches = [];
    this.sessions = [];
    this.instruments = [];
    this.selectedSessionName = '';
    this.playerName = '';
    this.selectedEffect.clear();
    this.chatMessages = [];
    this.selectedInstrument = '';
    this.downloadedSounds.clear();
    this.client.client.disconnect( () => {
      
    });
    this.client = null;
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

  // Anfrage für einen Sound
  requestOneSound(instrument: string, pitch: string, effect: string) {
    if (this.selectedSessionName !== null && this.playerName !== null) {
      this.getSoundFile(instrument, pitch, effect).subscribe((data: Blob) => {
        const blob = new Blob([data], { type : 'audio/wav; codecs=0' });
        const url = URL.createObjectURL(blob);
        this.downloadedSounds.set(instrument + pitch + effect, { blob: blob, url: url});
      }, error => {
        this.handleError(error);
      });
    } else {
      // iwie noch ein Error Anzeigen
    }
  }

  // läd alle Sounds der aktuellen Session herunter
  downloadAllSounds() {
    if (this.selectedInstrument === 'DRUM') {
      this.selectDrumOrNot = true;
    } else {
      this.selectDrumOrNot = false;
    }
    this.downloadedSounds.clear();
    for (const sound of this.client.sounds) {
      this.requestOneSound(sound.instrumentType, sound.pitchType, sound.effect);
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
      if (data !== undefined) {
        this.client = data;
        this.selectedInstrument = this.client.sounds[0].instrumentType;
        if ( this.selectedInstrument === 'DRUM') {
          for (const sound of this.client.sounds) {
            this.selectedEffect.set(sound.pitchType, sound.effect);
          }
        } else {
          this.selectedEffect.set('notdrum', this.client.sounds[0].effect);
        }
        this.subscription = this.client.client.subscribe('/jamsession/' + data.sessionId, message => {
          const body = JSON.parse(message.body);
          if (body.type === 'JOIN') {
            this.updateSoundIdList();
            this.downloadAllSounds()
            this.chatMessages.push( {sender: 'Session', message: body.sender + ' ist der aktuellen JamSession beigetreten!'} );
          } else if (body.type === 'CHAT') {
            this.chatMessages.push( {sender: body.sender, message: body.content} );
          } else if (body.type === 'SOUND') {
            this.playSound(this.downloadedSounds.get(body.instrument + body.tune + body.effect));
          } else if (body.type === 'LEAVE') {
            this.chatMessages.push( {sender: 'Session', message: body.sender + ' hat die aktuelle Session verlassen!'} );
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
      if (data !== undefined) {
        this.client = data;
        this.selectedInstrument = this.client.sounds[0].instrumentType;
        if ( this.selectedInstrument === 'DRUM') {
          for (const sound of this.client.sounds) {
            this.selectedEffect.set(sound.pitchType, sound.effect);
          }
        } else {
          this.selectedEffect.set('notdrum', this.client.sounds[0].effect);
        }
        this.subscription = this.client.client.subscribe('/jamsession/' + data.sessionId, message => {
          const body = JSON.parse(message.body);
          if (body.type === 'JOIN') {
            this.updateSoundIdList();
            this.downloadAllSounds()
            this.chatMessages.push( {sender: 'Session', message: body.sender + ' ist der aktuellen JamSession beigetreten!'} );
          } else if (body.type === 'CHAT') {
            this.chatMessages.push( {sender: body.sender, message: body.content} );
          } else if (body.type === 'SOUND') {
            this.playSound(this.downloadedSounds.get(body.instrument + body.tune + body.effect));
          } else if (body.type === 'LEAVE') {
            this.chatMessages.push( {sender: 'Session', message: body.sender + ' hat die aktuelle Session verlassen!'} );
          }
        }, error => {
          this.errorBoolean = true;
        });
        this.client.client.send('/app/jamsession/' + data.sessionId + '/sendChatMessage', {},
        JSON.stringify({sender: data.user, type: 'JOIN'}));
      }
    });
  }

  // spielt einen schon heruntergeladenen Sound ab
  playSound(soundBlobUrl: SoundBlobUrl) {
    this.audio.pause();
    this.audio.src = soundBlobUrl.url;
    this.audio.play();
  }

  sendChatMessage() {
    this.client.client.send('/app/jamsession/' + this.client.sessionId + '/sendChatMessage', {},
        JSON.stringify({sender: this.client.user, type: 'CHAT', content: this.chatFormControl.value}));
    this.chatFormControl.setValue('');
  }

  setChatFocus(bool: boolean) {
    this.chatFocus = bool;
    console.log(bool);
  }

  private updateSoundIdList() {
    this.getAllSoundIdsForSession(this.client.sessionId, this.client.password).subscribe(response => {
      this.client.sounds = response;
    }, error => {
      // handle error
    });
  }
}
