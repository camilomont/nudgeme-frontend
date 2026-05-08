import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

const T = (code: string) => `https://cdn.jsdelivr.net/npm/twemoji@latest/2/svg/${code}.svg`;

@Component({
  selector: 'db-energy-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './db-energy-widget.component.html',
  styleUrl: './db-energy-widget.component.scss',
})
export class DbEnergyWidgetComponent {
  readonly energyLevel = signal(80);

  readonly energyColor = computed(() => {
    const v = this.energyLevel();
    if (v < 25) return '#EF4444';
    if (v < 50) return '#F97316';
    if (v < 75) return '#FACC15';
    return '#22C55E';
  });

  readonly boltLeft = computed(() => {
    const v = this.energyLevel();
    return `calc(${v}% + ${(50 - v) * 0.4}px)`;
  });

  readonly activeEmojiIndex = computed(() => {
    const v = this.energyLevel();
    if (v < 12.5) return 0;
    if (v < 37.5) return 1;
    if (v < 62.5) return 2;
    if (v < 87.5) return 3;
    return 4;
  });

  readonly energyEmojis = [
    { icon: T('1f621') },
    { icon: T('1f614') },
    { icon: T('1f610') },
    { icon: T('1f60a') },
    { icon: T('1f604') },
  ];

  setEnergyLevel(e: Event) {
    this.energyLevel.set(+(e.target as HTMLInputElement).value);
  }
}
