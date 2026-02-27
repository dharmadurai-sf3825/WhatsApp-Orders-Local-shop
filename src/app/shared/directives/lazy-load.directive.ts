import { Directive, ElementRef, Renderer2, Input, OnInit, OnDestroy } from '@angular/core';

/**
 * LazyLoadDirective: Lazy-loads images using Intersection Observer API
 * Improves performance by only loading images as they come into view
 * 
 * Usage:
 *   <img [src]="placeholderUrl" [appLazyLoad]="actualImageUrl" />
 * 
 * Features:
 * - Automatic fallback if image fails to load
 * - Support for eager-loading of above-fold items (first N items)
 * - Minimal CPU overhead using native browser IntersectionObserver
 */

@Directive({
  selector: '[appLazyLoad]',
  standalone: true
})
export class LazyLoadDirective implements OnInit, OnDestroy {
  @Input() appLazyLoad: string = ''; // Actual image URL to lazy-load
  @Input() lazyLoadFallback: string = '/assets/placeholder-product.svg'; // Fallback if load fails
  @Input() lazyLoadEager: boolean = false; // Force eager load for above-fold items

  private intersectionObserver: IntersectionObserver | null = null;

  constructor(
    private el: ElementRef<HTMLImageElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if (this.lazyLoadEager) {
      // Eager load for above-fold images (first 3 items)
      this.loadImage();
    } else {
      // Lazy load using Intersection Observer
      this.observeImage();
    }
  }

  private observeImage(): void {
    // Check for browser support
    if (!('IntersectionObserver' in window)) {
      // Fallback for old browsers: load immediately
      this.loadImage();
      return;
    }

    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '50px', // Start loading 50px before image enters viewport
      threshold: 0.01
    };

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadImage();
            if (this.intersectionObserver) {
              this.intersectionObserver.unobserve(this.el.nativeElement);
            }
          }
        });
      },
      options
    );

    this.intersectionObserver.observe(this.el.nativeElement);
  }

  private loadImage(): void {
    if (!this.appLazyLoad) {
      return;
    }

    const img = new Image();
    const nativeElement = this.el.nativeElement;

    img.onload = () => {
      this.renderer.setAttribute(nativeElement, 'src', this.appLazyLoad);
      this.renderer.addClass(nativeElement, 'lazy-loaded');
    };

    img.onerror = () => {
      console.warn(`Failed to load image: ${this.appLazyLoad}`);
      this.renderer.setAttribute(nativeElement, 'src', this.lazyLoadFallback);
      this.renderer.addClass(nativeElement, 'lazy-load-error');
    };

    img.src = this.appLazyLoad;
  }

  ngOnDestroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }
}
