import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginPopupService {

  public popup: Subject<any> = new Subject<any>();

  constructor() { }
}
