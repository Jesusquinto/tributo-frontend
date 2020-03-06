import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class EndpointsService {
    public endpoints: BehaviorSubject<any> = new BehaviorSubject<any>({});
   constructor(private http: HttpClient) {}

  load(url: string) {
    return new Promise((resolve) => {
      this.http.get<JSON>(url).subscribe(
        endpoints => {console.log('ENDPOINTS CARGADOS: ', endpoints); this.endpoints.next(endpoints); }),
    resolve();
  });
}

}
