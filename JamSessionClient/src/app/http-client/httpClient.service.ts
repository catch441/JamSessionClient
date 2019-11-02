import { OnInit } from '@angular/core';
import { HttpErrorResponse, HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SoundInterface } from './SoundInterface';

export class HttpClientService implements OnInit {

    constructor(private http: HttpClient) {}

    errorMessage: string;
    errorBoolean = false;

    ngOnInit() {}
    // http anfrage für alle verfügbaren Sessions
    getAllSessions(): Observable<Array<string>> {
      return this.http.get<Array<string>>('http://localhost:8080/jamSessions');
    }
    // http anfrage für alle pitches
    getAllPitches(): Observable<Array<string>> {
      return this.http.get<Array<string>>('http://localhost:8080/pitches');
    }
    // http anfrage für eine soundfile
    getSoundFile(instrument: string, pitch: string, effect: string): Observable<Blob> {
      // tslint:disable-next-line:max-line-length
      return this.http.get('http://localhost:8080/jamSessionSoundFiles?instrumentType=' + instrument
                            + '&pitchType=' + pitch + '&effectType=' + effect, { responseType: 'blob' });
    }
    //http Anfrage für alle Sound Ids einer Session
    getAllSoundIdsForSession(sessionId: string,password: string): Observable<Array<SoundInterface>> {
      return this.http.get<Array<SoundInterface>>('http://localhost:8080/jamSessionSoundsIds?jamSessionName=' + sessionId + '&password=' + password);
    }
    // http anfrage für alle verfügbaren Instrumente
    getAllInstruments(): Observable<Array<string>> {
      return this.http.get<Array<string>>('http://localhost:8080/instruments');
    }
    // http anfrage für alle verfügbaren Effekte für ein Instrument // nicht für DRUM nutzen
    getAllEffectsByInstrument(instrument: string): Observable<Array<string>> {
      return this.http.get<Array<string>>('http://localhost:8080/effects?instrumentType=' + instrument);
    }
    // http anfrage für alle verfügbaren Effekte nur für Drum 
    getAllEffectsByDrumPitch(pitch: string): Observable<Array<string>> {
      return this.http.get<Array<string>>('http://localhost:8080/drumEffects?pitchType=' + pitch);
    }
    // http post um Sound zu einem Spieler hinzuzufügen
    addSoundsToPlayer(jamSessionName: string, playerName: string,password: string, sounds: Array<SoundInterface>): Observable<any> {
      // tslint:disable-next-line:max-line-length
      return this.http.post<any>('http://localhost:8080/jamSessionSounds?jamSessionName=' + jamSessionName + "&password=" + password + '&player=' + playerName, sounds);
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
