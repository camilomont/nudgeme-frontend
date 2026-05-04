import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import anime from 'animejs';

export type AnimePreset = 'slideUp' | 'fadeIn' | 'scaleIn' | 'floatIn';

@Directive({
  selector: '[animeEntrance]',
  standalone: true,
})
export class AnimeEntranceDirective implements OnInit {
  @Input('animeEntrance') preset: AnimePreset = 'fadeIn';
  @Input() animeDelay = 0;
  @Input() animeDuration = 600;

  private readonly el = inject(ElementRef);

  private readonly presets: Record<AnimePreset, anime.AnimeParams> = {
    fadeIn: {
      opacity: [0, 1],
      duration: this.animeDuration,
      easing: 'easeOutQuad',
    },
    slideUp: {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: this.animeDuration,
      easing: 'easeOutExpo',
    },
    scaleIn: {
      opacity: [0, 1],
      scale: [0.85, 1],
      duration: this.animeDuration,
      easing: 'easeOutBack',
    },
    floatIn: {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: this.animeDuration,
      easing: 'spring(1, 80, 10, 0)',
    },
  };

  ngOnInit() {
    const el = this.el.nativeElement as HTMLElement;
    el.style.opacity = '0';

    anime({
      targets: el,
      delay: this.animeDelay,
      ...this.presets[this.preset],
    });
  }
}
