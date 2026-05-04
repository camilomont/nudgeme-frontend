import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import anime from 'animejs';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
}

const PASTEL_COLORS = [
  'rgba(196,181,253,0.6)',  // lavender
  'rgba(186,230,253,0.6)',  // sky
  'rgba(187,247,208,0.6)',  // mint
  'rgba(253,186,116,0.5)',  // peach
  'rgba(254,200,211,0.5)',  // blush
];

@Component({
  selector: 'nm-floating-particles',
  standalone: true,
  template: `
    <canvas
      #canvas
      class="pointer-events-none fixed inset-0 z-0"
      [width]="width"
      [height]="height"
    ></canvas>
  `,
})
export class FloatingParticlesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  width = window.innerWidth;
  height = window.innerHeight;

  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId = 0;
  private animeInstance: anime.AnimeInstance | null = null;

  ngOnInit() {
    this.particles = Array.from({ length: 25 }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      size: Math.random() * 4 + 2,
      color: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)],
      opacity: Math.random() * 0.5 + 0.2,
    }));
  }

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.animateParticles();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
    this.animeInstance?.pause();
  }

  private animateParticles() {
    const targets = this.particles.map((p) => ({ ...p }));

    this.animeInstance = anime({
      targets,
      y: () => `-=${Math.random() * 80 + 20}`,
      x: () => `+=${(Math.random() - 0.5) * 60}`,
      opacity: [
        { value: 0.8, duration: 1000 },
        { value: 0.2, duration: 1000 },
      ],
      duration: () => Math.random() * 3000 + 3000,
      delay: () => Math.random() * 2000,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutSine',
      update: () => this.draw(),
    });
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.particles.forEach((p) => {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
    });
  }
}
