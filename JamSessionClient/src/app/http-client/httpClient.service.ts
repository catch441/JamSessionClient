import { OnInit } from '@angular/core';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class HttpClientService implements OnInit {

    constructor(private http: HttpClient) {}

    errorMessage: string;
    errorBoolean = false;

    ngOnInit() {}

    getHttpAllSessions(): Observable<Array<string>> {
      return this.http.get<Array<string>>('http://localhost:8080/jamSessions');
    }

    // handles response errors from request
  handleError(error: HttpErrorResponse) {
    if (typeof error !== 'undefined') {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error);
      }  else {
        // The backend returned an unsuccessful response code.
        console.error(
          `Backend returned code: ${error.status}, ` +
          `message: ${error.error}`);
        this.errorMessage = error.error;
        this.errorBoolean = true;
      }
    }
  }
}
