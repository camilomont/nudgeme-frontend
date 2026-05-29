import { Component, inject } from '@angular/core';
import { ToastService } from '@shared/services/toast.service';
import {
  LucideAngularModule,
  LucideIconProvider,
  LUCIDE_ICONS,
  X,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
} from 'lucide-angular';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [LucideAngularModule],
  providers: [
    { provide: LUCIDE_ICONS, useValue: new LucideIconProvider({ X, CheckCircle2, AlertTriangle, AlertCircle, Info }), multi: true },
  ],
  template: `
    <div class="toast-wrapper">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast toast-{{ toast.type }}">
          <lucide-icon [img]="iconMap[toast.type]" [size]="18" [strokeWidth]="2" />
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" (click)="toastService.dismiss(toast.id)">
            <lucide-icon [img]="X" [size]="14" [strokeWidth]="2" />
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-wrapper {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 24rem;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      padding: 0.75rem 1rem;
      border-radius: 0.75rem;
      color: white;
      font-size: 0.875rem;
      line-height: 1.4;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      animation: toast-in 0.3s ease-out;
    }

    .toast-message { flex: 1; }

    .toast-close {
      background: none;
      border: none;
      color: rgba(255,255,255,0.7);
      cursor: pointer;
      padding: 2px;
      display: flex;
      transition: color 0.15s;
    }
    .toast-close:hover { color: white; }

    .toast-success { background: #059669; }
    .toast-error   { background: #DC2626; }
    .toast-warning { background: #D97706; }
    .toast-info    { background: #2563EB; }

    @keyframes toast-in {
      from { opacity: 0; transform: translateX(100%); }
      to   { opacity: 1; transform: translateX(0); }
    }
  `],
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);

  readonly X = X;
  readonly iconMap: Record<string, typeof X> = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };
}
