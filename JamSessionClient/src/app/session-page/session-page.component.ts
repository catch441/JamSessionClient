import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientService } from '../http-client/httpClient.service';
import { MatDialog } from '@angular/material';
import { CreateDialogComponent } from '../create-dialog/create-dialog.component';
import { SessionClient } from '../create-dialog/SessionClient';

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
  currentSubscription = null;

  constructor(private http2: HttpClient, public dialog: MatDialog) {
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

  // Anfrage für alle verfügbaren Soundfiles (nicht getestet)
  requestAllSounds() {
    if (this.selectedSessionName !== null && this.playerName !== null) {
      this.getSoundFile('DRUM', 'CRASH', 'NOISE').subscribe((data: Blob) => {
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
        /*
        this.currentSubscription = this.client.client.subscribe('/app/jamsession/' + data.sessionId, (message) => {
          console.log('test');
          console.log(message);
        }, error => {
          this.errorBoolean = true;
        });*/
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
        // funktioniert noch nicht
        /*
        this.currentSubscription = this.client.client.subscribe('/app/jamsession/' + data.sessionId, (message) => {
          console.log('test');
          console.log(message);
        }, error => {
          this.errorBoolean = true;
        });*/
      }
    });
  }


  private updateSoundIdList() {
    this.getAllSoundIdsForSession(this.client.sessionId,this.client.password).subscribe(response => {
      this.client.sounds = response;
      console.log(this.client.sounds);
    }, error => {
      //handle error
    });
  }
}
