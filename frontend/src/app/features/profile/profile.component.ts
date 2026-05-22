import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h1>User Profile</h1>
      <p class="hint">This calls <code>GET /api/user/profile</code> — any authenticated user can access it (no role check).</p>

      @if (loading()) {
        <p>Loading...</p>
      } @else if (error()) {
        <div class="card error">
          <strong>Error {{ error()?.status }}</strong>: {{ error()?.message }}
        </div>
      } @else if (profile()) {
        <div class="card">
          <table>
            @for (entry of objectEntries(profile()!); track entry[0]) {
              <tr>
                <td class="label">{{ entry[0] }}</td>
                <td>{{ entry[1] }}</td>
              </tr>
            }
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
    .card { background: #f5f5f5; border-radius: 8px; padding: 1.5rem; margin-top: 1rem; }
    .card.error { background: #fdecea; border-left: 4px solid #f44336; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 0.5rem; border-bottom: 1px solid #ddd; }
    .label { font-weight: bold; width: 150px; }
    code { background: #eee; padding: 2px 6px; border-radius: 3px; }
    .hint { color: #555; font-size: 0.9rem; }
  `]
})
export class ProfileComponent implements OnInit {
  private http = inject(HttpClient);

  profile = signal<Record<string, string> | null>(null);
  loading = signal(true);
  error = signal<{ status: number; message: string } | null>(null);

  objectEntries = Object.entries;

  ngOnInit() {
    this.http.get<Record<string, string>>('/api/user/profile').subscribe({
      next: data => { this.profile.set(data); this.loading.set(false); },
      error: err => {
        this.error.set({ status: err.status, message: err.message });
        this.loading.set(false);
      },
    });
  }
}
