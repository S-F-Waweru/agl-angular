import { AfterViewInit, Component, ElementRef, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Subscription, filter } from 'rxjs';

interface RouteSeoData {
  title?: string;
  description?: string;
  keywords?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private readonly cleanup: Array<() => void> = [];
  private observer?: IntersectionObserver;
  private readonly routerSub: Subscription;

  constructor(
    private readonly host: ElementRef<HTMLElement>,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly title: Title,
    private readonly meta: Meta
  ) {
    this.routerSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.onNavigationEnd());
  }

  ngAfterViewInit(): void {
    this.bindMobileMenu();
    this.byId('year').textContent = String(new Date().getFullYear());
    this.observeReveals();
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
    this.observer?.disconnect();
    this.cleanup.forEach((dispose) => dispose());
  }

  private query<T extends Element>(selector: string): T {
    const element = this.host.nativeElement.querySelector<T>(selector);
    if (!element) throw new Error(`Missing element: ${selector}`);
    return element;
  }

  private byId(id: string): HTMLElement {
    return this.query<HTMLElement>(`#${id}`);
  }

  private listen(target: EventTarget, event: string, callback: EventListener): void {
    target.addEventListener(event, callback);
    this.cleanup.push(() => target.removeEventListener(event, callback));
  }

  private onNavigationEnd(): void {
    this.applyRouteMetadata();
    this.closeMobileMenu();
    requestAnimationFrame(() => this.observeReveals());
  }

  /**
   * Applies the SEO metadata of the deepest route that carries a `data`
   * block. Service detail pages have no data and set their own metadata.
   */
  private applyRouteMetadata(): void {
    let current = this.route.firstChild;
    let snapshot = this.route.snapshot;
    while (current) {
      snapshot = current.snapshot;
      current = current.firstChild;
    }
    const data = snapshot.data as RouteSeoData;
    if (data['title']) this.title.setTitle(data['title']);
    if (data['description']) this.meta.updateTag({ name: 'description', content: data['description'] });
    if (data['keywords']) this.meta.updateTag({ name: 'keywords', content: data['keywords'] });
  }

  private closeMobileMenu(): void {
    this.host.nativeElement.querySelector<HTMLElement>('.nav-links')?.removeAttribute('style');
  }

  /**
   * Reveal-on-scroll for `.reveal` elements. The shell stays alive across
   * navigations, so each newly rendered page is observed after its elements
   * appear. The `data-reveal-bound` marker keeps observation single-pass.
   */
  private observeReveals(): void {
    if (!this.observer) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('in');
        });
      }, { threshold: 0.12 });
    }
    this.host.nativeElement
      .querySelectorAll<HTMLElement>('.reveal:not([data-reveal-bound])')
      .forEach((element) => {
        element.setAttribute('data-reveal-bound', '');
        this.observer?.observe(element);
      });
  }

  private bindMobileMenu(): void {
    const burger = this.query<HTMLElement>('.burger');
    const navLinks = this.query<HTMLElement>('.nav-links');
    this.listen(burger, 'click', () => {
      const open = navLinks.style.display === 'flex';
      if (open) {
        navLinks.removeAttribute('style');
      } else {
        navLinks.style.cssText = 'display:flex;position:absolute;top:82px;left:0;right:0;background:#fdf3e0;flex-direction:column;padding:24px 32px;border-bottom:1px solid rgba(42,42,40,0.14);';
      }
    });
  }
}
