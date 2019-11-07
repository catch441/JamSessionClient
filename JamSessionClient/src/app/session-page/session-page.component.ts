import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientService } from '../http-client/httpClient.service';
import { MatDialog } from '@angular/material';
import { CreateDialogComponent } from '../create-dialog/create-dialog.component';
import { SessionClient } from '../create-dialog/SessionClient';
import { StompSubscription } from '@stomp/stompjs';

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

  client: SessionClient;
  subscription: StompSubscription;

  constructor(private http2: HttpClient, public dialog: MatDialog) {
    super(http2);
  }

  ngOnInit() {
    this.requestAllSessions();
    document.addEventListener('keypress',e => {
      if(this.client != null) {
        switch(e.code) {
          case 'q': break; // c
          case 'w': break; // d
          case 'e': break; // e
          case 'r': break; // f
          case 't': break; // g
          case 'z': break; // a
          case 'u': break; // h
          case '2': break; // cis
          case '3': break; // dis
          case '5': break; // fis
          case 'w': break; // gis
          case '7': break; // ais
          case 'v': break; // c
          case 'b': break; // d
          case 'n': break; // e
          case 'm': break; // f
          case ',': break; // g
          case '.': break; // a
          case '-': break; // h
          case 'g': break; // cis
          case 'h': break; // dis
          case 'k': break; // fis
          case 'l': break; // gis
          case 'ö': break; // ais
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
        // funktioniert noch nicht
        this.subscription = this.client.client.subscribe('/jamsession/' + data.sessionId, message => {
          const body = JSON.parse(message.body);
          if(body.type = "JOIN") {
            this.updateSoundIdList();
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
        this.subscription = this.client.client.subscribe('/jamsession/' + data.sessionId, message => {
          const body = JSON.parse(message.body);
          if(body.type = "JOIN") {
            this.updateSoundIdList();
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
