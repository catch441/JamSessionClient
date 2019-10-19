import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientService } from '../http-client/httpClient.service';

@Component({
  selector: 'app-session-page',
  templateUrl: './session-page.component.html',
  styleUrls: ['./session-page.component.css']
})
export class SessionPageComponent extends HttpClientService implements OnInit {

  spinningBool = false;
  sessions: Array<string>;
  noSessions = false;

  constructor(private http2: HttpClient) {
    super(http2);
  }

  ngOnInit() {
    this.requestAllSessions();
  }

  requestAllSessions() {
    this.spinningBool = true;
    this.getHttpAllSessions().subscribe((data: Array<string>) => {
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

}
