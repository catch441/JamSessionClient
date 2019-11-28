import { Component, OnInit, Inject } from '@angular/core';
import * as Stomp from 'stompjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClientService } from '../http-client/httpClient.service';
import { HttpClient } from '@angular/common/http';
import { SessionClient } from './SessionClient';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.css']
})
export class CreateDialogComponent extends HttpClientService implements OnInit {

  webSocket: WebSocket;
  client: Stomp.Client;

  instruments: Array<string> = [];
  effects: Array<string> = [];
  crashEffectList = [];
  hithatEffectList = [];
  kickEffectList = [];
  snareEffectList = [];
  tomEffectList = [];

  //information for join dialog
  sessionId = '';

  nameFormControl = new FormControl('',Validators.required);
  sessionNameFormControl = new FormControl('',Validators.required);
  passwordFormControl = new FormControl('',Validators.required);
  effectFormControl = new FormControl('',Validators.required);
  crashEffectFormControl = new FormControl('',Validators.required);
  hithatEffectFormControl = new FormControl('',Validators.required);
  kickEffectFormControl = new FormControl('',Validators.required);
  snareEffectFormControl = new FormControl('',Validators.required);
  tomEffectFormControl = new FormControl('',Validators.required);
  instrumentFormControl = new FormControl('',Validators.required);
  octaveFormControl = new FormControl('',Validators.required);

  onlyJoin = false;
  static errorBoolean = false;
  isDrum = false;
  instrumentIsSelected = false;
  spinningBool = false;


  constructor(private http2: HttpClient, public dialogRef: MatDialogRef<CreateDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { 
    super(http2);
    if(data.onlyJoin) {
      this.onlyJoin = data.onlyJoin;
      this.sessionId = data.sessionId;
    }
  }

  ngOnInit() {
    this.getAllInstruments().subscribe((data: Array<string>) => {
      this.instruments = data;
      this.errorBoolean = false;
    }, error => {
      this.errorBoolean = true;
    });
  }

  createJoinSession() {
    this.errorBoolean = false;
    if(this.nameFormControl.status == 'VALID' && (this.sessionNameFormControl.status == 'VALID' || this.onlyJoin) &&
     this.passwordFormControl.status == 'VALID'&& this.instrumentFormControl.status == 'VALID') {
      if(!this.onlyJoin) {
        this.sessionId = this.sessionNameFormControl.value;
      }
      if(this.instrumentFormControl.value == "DRUM") {
        if(this.snareEffectFormControl.status == 'VALID' && this.tomEffectFormControl.status == 'VALID' && this.hithatEffectFormControl.status == 'VALID'
            && this.crashEffectFormControl.status == 'VALID' && this.kickEffectFormControl.status == 'VALID') {
          this.connect(this.nameFormControl.value,this.sessionId,this.passwordFormControl.value,true);
        } else {
          this.errorBoolean = true;
        }
      } else if(this.octaveFormControl.status == 'VALID'){
        if(this.effectFormControl.status == 'VALID') {
          this.connect(this.nameFormControl.value,this.sessionId,this.passwordFormControl.value,false);
        } else {
          this.errorBoolean = true;
        }
      }
    } else {
      this.errorBoolean = true;
    }
  }

  private connect(playername: string, sessionId: string, password: string,drum: boolean) {
    const passwordHash = password;
    this.setCookie('name', playername);
    this.setCookie('sessionId', sessionId);
    this.setCookie('sessionPasswordHash', passwordHash);
      this.webSocket = new WebSocket('ws://localhost:8080/ws');
      this.webSocket.onerror = () => {
        this.errorBoolean = true;
      };
      
    this.client = Stomp.over(this.webSocket);

    this.client.connect({}, () => {
      if(drum) {
        this.sessionWithDrum();
      } else {
        this.sessionNoDrum();
      }
    });
    
  }

  private sessionWithDrum() {
    const data = {user: this.nameFormControl.value,client: this.client,sessionId: this.sessionId, password: this.passwordFormControl.value,sounds: [
      {effect: this.crashEffectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "CRASH",data: null},
      {effect: this.hithatEffectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "HITHAT",data: null},
      {effect: this.tomEffectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "TOM",data: null},
      {effect: this.snareEffectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "SNARE",data: null},
      {effect: this.kickEffectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "KICK",data: null}
    ]};
    this.spinningBool = true;
    this.addSoundsToPlayer(this.sessionId, this.nameFormControl.value,this.passwordFormControl.value, data.sounds).subscribe(response => {
      this.spinningBool = false;
      this.closeDialog(data);
    }, error => {
      this.errorBoolean = true;
    });
  }

  private sessionNoDrum() {
    const octave1 = this.octaveFormControl.value;
    const octave2 = this.octaveFormControl.value + 1;
    const data = {user: this.nameFormControl.value,client: this.client,sessionId: this.sessionId, password: this.passwordFormControl.value,octave: octave1,sounds: [
      {effect: this.effectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "C_" + octave1,data: null},
      {effect: this.effectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "CIS_DES_" + octave1,data: null},
      {effect: this.effectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "D_" + octave1,data: null},
      {effect: this.effectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "DIS_ES_" + octave1,data: null},
      {effect: this.effectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "E_" + octave1,data: null},
      {effect: this.effectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "F_" + octave1,data: null},
      {effect: this.effectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "FIS_GES_" + octave1,data: null},
      {effect: this.effectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "G_" + octave1,data: null},
      {effect: this.effectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "GIS_AS_" + octave1,data: null},
      {effect: this.effectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "A_" + octave1,data: null},
      {effect: this.effectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "AIS_B_" + octave1,data: null},
      {effect: this.effectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "H_" + octave1,data: null},
      {effect: this.effectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "C_" + octave2,data: null},
      {effect: this.effectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "CIS_DES_" + octave2,data: null},
      {effect: this.effectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "D_" + octave2,data: null},
      {effect: this.effectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "DIS_ES_" + octave2,data: null},
      {effect: this.effectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "E_" + octave2,data: null},
      {effect: this.effectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "F_" + octave2,data: null},
      {effect: this.effectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "FIS_GES_" + octave2,data: null},
      {effect: this.effectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "G_" + octave2,data: null},
      {effect: this.effectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "GIS_AS_" + octave2,data: null},
      {effect: this.effectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "A_" + octave2,data: null},
      {effect: this.effectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "AIS_B_" + octave2,data: null},
      {effect: this.effectFormControl.value, instrumentType: this.instrumentFormControl.value, pitchType: "H_" + octave2,data: null},
    ]};
    this.spinningBool = true;
    this.addSoundsToPlayer(this.sessionId, this.nameFormControl.value,this.passwordFormControl.value, data.sounds).subscribe(response => {
      this.spinningBool = false;
      this.closeDialog(data);
    }, error => {
      this.errorBoolean = true;
    });
  }

  closeDialog(sessionClient: SessionClient) {
    this.dialogRef.close(sessionClient);
  }

  onSelectInstrument(instrument: string) {
    this.instrumentIsSelected = true;
    this.errorBoolean = false;
    if(instrument == "DRUM") {
      this.effects = [];
      this.isDrum = true;
      this.getAllEffectsByDrumPitch("TOM").subscribe((data: Array<string>) => {
        this.tomEffectList = data;
      }, error => {
        this.errorBoolean = true;
      });
      this.getAllEffectsByDrumPitch("SNARE").subscribe((data: Array<string>) => {
        this.snareEffectList = data;
      }, error => {
        this.errorBoolean = true;
      });
      this.getAllEffectsByDrumPitch("HITHAT").subscribe((data: Array<string>) => {
        this.hithatEffectList = data;
      }, error => {
        this.errorBoolean = true;
      });
      this.getAllEffectsByDrumPitch("KICK").subscribe((data: Array<string>) => {
        this.kickEffectList = data;
      }, error => {
        this.errorBoolean = true;
      });
      this.getAllEffectsByDrumPitch("CRASH").subscribe((data: Array<string>) => {
        this.crashEffectList = data;
      }, error => {
        this.errorBoolean = true;
      });
    } else {
      this.crashEffectList = [];
      this.kickEffectList = [];
      this.snareEffectList = [];
      this.hithatEffectList = [];
      this.tomEffectList = [];
      this.getAllEffectsByInstrument(instrument).subscribe((data: Array<string>) => {
        this.effects = data;
      }, error => {
        this.errorBoolean = true;
      });
      this.isDrum = false;
    }
    
  }

  private setCookie(name: string, val: string) {
    const date = new Date();
    const value = val;
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
    document.cookie = name + '=' + value + '; expires=' + date.toUTCString() + '; path=/';
  }

}
