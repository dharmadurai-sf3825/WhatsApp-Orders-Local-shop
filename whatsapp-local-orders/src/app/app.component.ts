import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <span>{{ currentLang === 'ta' ? 'வாட்ஸ்அப் ஆர்டர்' : 'WhatsApp Order' }}</span>
      <span class="spacer"></span>
      <button mat-icon-button [matMenuTriggerFor]="langMenu">
        <mat-icon>language</mat-icon>
      </button>
      <mat-menu #langMenu="matMenu">
        <button mat-menu-item (click)="switchLanguage('ta')">
          <mat-icon>{{ currentLang === 'ta' ? 'check' : '' }}</mat-icon>
          தமிழ் (Tamil)
        </button>
        <button mat-menu-item (click)="switchLanguage('en')">
          <mat-icon>{{ currentLang === 'en' ? 'check' : '' }}</mat-icon>
          English
        </button>
      </mat-menu>
    </mat-toolbar>
    <main class="app-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .app-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background-color: var(--whatsapp-green);
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .app-content {
      min-height: calc(100vh - 64px);
      padding-bottom: 20px;
    }
    
    @media (max-width: 768px) {
      .app-content {
        min-height: calc(100vh - 56px);
      }
    }
  `]
})
export class AppComponent implements OnInit {
  currentLang = 'ta';

  constructor(private languageService: LanguageService) {}

  ngOnInit() {
    this.currentLang = this.languageService.getCurrentLanguage();
    this.languageService.language$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  switchLanguage(lang: string) {
    this.languageService.setLanguage(lang);
  }
}
