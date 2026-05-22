import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-protected',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h1>Protected Data</h1>
      <p class="hint">
        This calls <code>GET /api/protected/data</code> — requires the <code>client</code> realm role.<br>
        <strong>alice</strong> (has role) → 200 OK &nbsp;|&nbsp; <strong>bob</strong> (no role) → 403 Forbidden
      </p>

      @if (loading()) {
        <p>Loading...</p>
      } @else if (error()) {
        <div class="card error">
          <h3>{{ error()?.status === 403 ? '403 Forbidden' : 'Error ' + error()?.status }}</h3>
          <p>{{ error()?.status === 403
            ? 'Your token is valid but you lack the required role: client'
            : error()?.message }}</p>
        </div>
      } @else if (data()) {
        <div class="card success">
          <p>{{ data()?.message }}</p>
          <p>User: <strong>{{ data()?.user }}</strong></p>
          <p>Token issued at: {{ data()?.issuedAt }}</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
    .card { border-radius: 8px; padding: 1.5rem; margin-top: 1rem; }
    .card.error { background: #fdecea; border-left: 4px solid #f44336; }
    .card.success { background: #e8f5e9; border-left: 4px solid #4caf50; }
    code { background: #eee; padding: 2px 6px; border-radius: 3px; }
    .hint { color: #555; font-size: 0.9rem; }
  `]
})
export class ProtectedComponent implements OnInit {
  private http = inject(HttpClient);

  data = signal<{ message: string; user: string; issuedAt: string } | null>(null);
  loading = signal(true);
  error = signal<{ status: number; message: string } | null>(null);

  ngOnInit() {
    this.http.get<{ message: string; user: string; issuedAt: string }>('/api/protected/data').subscribe({
      next: d => { this.data.set(d); this.loading.set(false); },
      error: err => {
        this.error.set({ status: err.status, message: err.message });
        this.loading.set(false);
      },
    });
  }
}
