/** This is a service code*/
/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/** rxjs Imports */
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

/** EmbedDashboard SDK import */
import { embedDashboard } from '@superset-ui/embedded-sdk';
import { DomSanitizer } from '@angular/platform-browser';

/** 
 * Superset Service
 */
@Injectable({
    providedIn: 'root'
})
export class SupersetService {

    /**
     * API URL of Superset to send request
     */
    //private apiUrl = 'http://localhost:8088/api/v1/security';
    private apiUrl = 'http://202.21.38.245:8088/api/v1/security';
    /**
     * @param {HttpClient} http Http Client to send requests.
     */
    constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

    /**
     * 
     * @returns { access token }
     */
    private fetchAccessToken(): Observable<any> {
       // debugger;
        const body = {
            "username": "admin",
            "password": "admin",
            "provider": "db",
            "refresh": true
        };

        const headers = new HttpHeaders({ "Access-Control-Allow-Origin": "*.*", "Content-Type": "application/json", "allow_headers": "*" });
        // let dataurl = this.sanitizer.bypassSecurityTrustResourceUrl();
        console.log(this.http.post<any>(`${this.apiUrl}/login`, body, { headers }))
        return this.http.post<any>(`${this.apiUrl}/login`, body, { headers });
    }

    /**
     * 
     * @returns { guest token } using @param { accessToken }
     */
    private fetchGuestToken(accessToken: any, dashboardid:any): Observable<any> {
       // debugger;
        const body = {
            "resources": [
                {
                    "type": "dashboard",
                    "id": dashboardid,
                }
            ],
            /**
             * rls: Row Level Security, this differs for client to client ,like what to show each client
             */
            "rls": [],
            "user": {
                "username": "admin",
                "first_name": "admin",
                "last_name": "admin",
            }
        };

        const acc = accessToken["access_token"]; //accessToken is an object in which there are two tokens access_token and refresh_token ,out of which we just need to send access_token to get guest_token
        const headers = new HttpHeaders({
            "Content-Type": "application/json",
            "Authorization": `Bearer ${acc}`,
        });

        //guest_token URL should end with forward_slash(/)
        return this.http.post<any>(`${this.apiUrl}/guest_token/`, body, { headers });
    }
    /**
     * 
     * @returns { guest Token }
     */
    getGuestToken(dashboardid): Observable<any> {
       // debugger;
        return this.fetchAccessToken().pipe(
            catchError((error) => {
                console.error(error);
                return throwError(error);
            }),
            switchMap((accessToken: any) => this.fetchGuestToken(accessToken, dashboardid))
        );
    }
    /**
     * 
     * @returns { dashboard }
     */
     fetchGuestTokenFromBackend = async () => {
        // Implement fetching of guest token from your backend
        // This function should return the guest token needed for embedding
         return "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7Imxhc3RfbmFtZSI6ImFkbWluIiwidXNlcm5hbWUiOiJhZG1pbiIsImZpcnN0X25hbWUiOiJhZG1pbiJ9LCJyZXNvdXJjZXMiOlt7InR5cGUiOiJkYXNoYm9hcmQiLCJpZCI6IjdmY2I1NzU5LWI2YzgtNGQwNS1iNzg1LTkzOTgxMTZkNmEwMSJ9XSwicmxzX3J1bGVzIjpbXSwiaWF0IjoxNjk4MjIyNTIwLjk1ODIzMDMsImV4cCI6MTY5ODI1ODUyMC45NTgyMzAzLCJhdWQiOiJodHRwOi8vc3VwZXJzZXQ6ODA4OC8iLCJ0eXBlIjoiZ3Vlc3QifQ.5EIHOQsuA6AMchy-6XIdCT0OqSHFTCkUP5Ljab_0Cr8"
    };
    embedDashboard(dom,dashboardid): Observable<void> {

        return new Observable((observer) => {
            this.getGuestToken(dashboardid).subscribe(
                (token) => {
                    embedDashboard({
                        id: dashboardid, // Replace with your dashboard ID
                        // id:'12',
                        supersetDomain: 'http://202.21.38.245:8088',
                        mountPoint: dom,
                        fetchGuestToken: () => token["token"],
                        dashboardUiConfig: {
                            hideTitle: true,
                            hideChartControls: true,
                            hideTab: true,
                            filters: {
                                visible:false,
                                       
                                    }
                        },
                    });
                    observer.next();
                    observer.complete();
                },
                (error) => {
                    observer.error(error);
                }
            );
        });
    }
}