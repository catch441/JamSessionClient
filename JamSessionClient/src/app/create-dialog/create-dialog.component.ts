import { Component, OnInit } from '@angular/core';
import * as SockJS from 'sockjs-client';


@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.css']
})
export class CreateDialogComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  createSession() {
    const playername = 'play';
    const sessionId = 'sessionNaddsdme';
    // hier muss noch ne hash funktion rein
    const passwordHash = 'tesmp';
    this.setCookie('name', playername);
    this.setCookie('sessionId', sessionId);
    this.setCookie('sessionPasswordHash', passwordHash);
    const socket = new SockJS('ws://localhost:8080/ws');


    const stompClient = Stomp.over(socket);

    stompClient.connect({}, null, null);
    //  event.preventDefault();
  }

  private setCookie(name: string, val: string) {
    const date = new Date();
    const value = val;

    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));

    document.cookie = name + '=' + value + '; expires=' + date.toUTCString() + '; path=/';
}

}
