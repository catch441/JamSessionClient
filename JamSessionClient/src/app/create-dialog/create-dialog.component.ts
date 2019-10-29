import { Component, OnInit } from '@angular/core';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';


@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.css']
})
export class CreateDialogComponent implements OnInit {

  webSocket: WebSocket;
  client: Stomp.Client;
  sessionId: string;
  playername: string;

  constructor() { }

  ngOnInit() {
  }

  createSession() {
    this.playername = 'play';
    this.sessionId = 'sessionNaddsdme';
    // hier muss noch ne hash funktion rein
    const passwordHash = 'tesmp';
    this.setCookie('name', this.playername);
    this.setCookie('sessionId', this.sessionId);
    this.setCookie('sessionPasswordHash', passwordHash);
    this.webSocket = new WebSocket('ws://localhost:8080/ws');

    this.client = Stomp.over(this.webSocket);

    this.client.connect({}, () => {
      this.client.send('/app/jamsession/' + + '/addUser',
      {},
      JSON.stringify({sender: this.playername, type: 'JOIN'})
      );
      this.client.subscribe('/jamsession/' + this.sessionId, (item) => {
        // TODO
      });
    });

  }

  private setCookie(name: string, val: string) {
    const date = new Date();
    const value = val;

    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));

    document.cookie = name + '=' + value + '; expires=' + date.toUTCString() + '; path=/';
  }

  test1() {

  }
  test2() {

  }

}
