import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from '../models/Member';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(private http:HttpClient) { }
  GetAllMembers() : Observable<Member[]> {
    return this.http.get<Member[]>("https://backend-l96g.onrender.com");
  }

}
