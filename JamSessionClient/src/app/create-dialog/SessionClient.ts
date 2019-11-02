import * as Stomp from 'stompjs';
import { SoundInterface } from '../http-client/SoundInterface';

export interface SessionClient {
    user: string,
    client: Stomp.Client,
    sessionId: string,
    password: string,
    sounds: SoundInterface[]
}