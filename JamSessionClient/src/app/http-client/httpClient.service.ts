import { OnInit } from '@angular/core';
import { HttpClient } from 'selenium-webdriver/http';
import { HttpErrorResponse } from '@angular/common/http';

export class HttpClientService implements OnInit {

    constructor(private http: HttpClient) {}

    errorMessage: string;
    errorBoolean = false;

    ngOnInit() {}

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
