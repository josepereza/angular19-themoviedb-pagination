import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private http = inject(HttpClient);
  private apiKey = 'b2b2b544b98945b0423554da4ff5209b'; // Reemplaza con tu API key de TMDB
  private baseUrl = 'https://api.themoviedb.org/3';
  private urlTrending = 'https://api.themoviedb.org/3/trending/movie/day?language=de-DE';

  searchMovies(query: string,page:number): Observable<any> {
    return this.http.get(`${this.baseUrl}/search/movie?&page=${page}`, {
      params: {
        api_key: this.apiKey,
        query: query,
        language: 'de-DE'
      }
    });
  }

  searchTrending(page:number): Observable<any> {
    return this.http.get(`${this.urlTrending}&page=${page}`, {
      params: {
        api_key: this.apiKey,
        language: 'de-DE'
      }
    });
  }
}
