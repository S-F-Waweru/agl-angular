import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocationMapComponent } from '../../components/location-map/location-map.component';
import { readQuoteForm, submitQuoteRequest } from '../../data/quote-request';

type Category = 'shower' | 'office' | 'curtain' | 'railing' | 'window' | 'custom';

interface ShowroomItem {
  cat: Category;
  tag: string;
  title: string;
  desc: string;
  specs: Record<string, string>;
  /** Project photo(s) from /images; several photos render as a carousel. Falls back to the line-art icon when absent. */
  img?: string | string[];
}

const ICONS: Record<Category, string> = {
  shower: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="10" y="6" width="28" height="36" rx="1"/><path d="M10 6 L38 6 M24 6 L24 42" opacity="0.5"/><circle cx="30" cy="24" r="1.6" fill="currentColor" stroke="none"/><path d="M16 30c2-2 4-2 6 0s4 2 6 0" opacity="0.6"/></svg>`,
  office: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="6" y="10" width="36" height="28" rx="1"/><path d="M16 10v28M28 10v28M6 24h36" opacity="0.5"/></svg>`,
  curtain: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="8" y="4" width="32" height="40" rx="1"/><path d="M8 12h32M8 20h32M8 28h32M8 36h32M16 4v40M24 4v40M32 4v40" opacity="0.4"/></svg>`,
  railing: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M6 40h36"/><path d="M10 40V16M18 40V16M26 40V16M34 40V16"/><path d="M6 16h36" opacity="0.6"/></svg>`,
  window: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="7" y="8" width="34" height="32" rx="1"/><path d="M24 8v32M7 24h34" opacity="0.5"/><circle cx="28.5" cy="24" r="1.5" fill="currentColor" stroke="none"/></svg>`,
  custom: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M6 15h36M9 15v27M39 15v27"/><path d="M6 15l5-7h26l5 7" opacity="0.6"/><path d="M17 15v27M24 15v27M31 15v27" opacity="0.35"/></svg>`
};

const ITEMS: ShowroomItem[] = [
  {cat:'shower', tag:'Shower Cubicles', title:'Frameless Corner Enclosure', desc:'Two fixed panels and a hinged door, minimal aluminium contact for a clean sightline. Suited to walk-in corner showers.', specs:{Glass:'8mm tempered, clear', Frame:'Frameless, polished edges', Hardware:'Stainless hinges & handle', Finish:'Anti-water-spot coating'}, img:'/images/frameless-shower-cubicle.jpg'},
  // {cat:'shower', tag:'Shower Cubicles', title:'Semi-Frameless Sliding Door', desc:'Aluminium top and bottom track with a sliding tempered glass door — a durable option for family bathrooms.', specs:{Glass:'6mm tempered, clear or frosted', Frame:'Slim aluminium track', Hardware:'Soft-close sliders', Finish:'Matte black or silver'}, img:'/images/aluminium-frame-shower-cubicle.jpg'},
  {cat:'shower', tag:'Shower Cubicles', title:'Fixed Screen + Door', desc:'A fixed glass screen paired with a hinged door, for straight-wall shower bays.', specs:{Glass:'8mm tempered', Frame:'Frameless', Hardware:'Wall-mounted hinges', Finish:'Clear or lightly tinted'},img:'/images/aluminium-frame-shower-cubicle.jpg'},
  {cat:'shower', tag:'Shower Cubicles', title:'Compact Bathroom Screen', desc:'A single fixed glass panel zoning a narrow shower bay, stayed with a stainless stabiliser and grab rail — keeping a small bathroom open and light.', specs:{Glass:'8mm tempered', Frame:'Minimal, polished edges', Hardware:'Stainless stabiliser & grab rail', Finish:'Clear'}, img:'/images/shower-cubicle.jpg'},
  {cat:'office', tag:'Office Partitioning', title:'Full-Height Glass Partition', desc:'Floor-to-ceiling aluminium-framed glass partitioning for meeting rooms and private offices.', specs:{Glass:'10mm tempered/laminated', Frame:'Slim-profile aluminium', Acoustic:'Optional acoustic seal', Finish:'Clear, frosted or manifested'}, img:'/images/aluminium-frame-office-partitioning.jpg'},
  // {cat:'office', tag:'Office Partitioning', title:'Framed Modular Partition', desc:'Demountable partition system that can be reconfigured as office layouts change.', specs:{Glass:'6-8mm tempered', Frame:'Aluminium modular grid', Install:'Demountable', Finish:'Powder-coated frame'}},
  {cat:'office', tag:'Office Partitioning', title:'Frosted Privacy Screen', desc:'Sandblasted or frosted glass panels for meeting rooms and private workstations that need visual privacy.', specs:{Glass:'6mm frosted/sandblasted', Frame:'Aluminium', Privacy:'Full or half-height', Finish:'Matte frost'}, img:'/images/office-partitioning.jpg'},
  {cat:'office', tag:'Office Partitioning', title:'Black-Framed Partition Suite', desc:'Slim black aluminium frames with full-height clear glass, dividing a corridor into meeting rooms and private offices.', specs:{Glass:'10mm tempered, clear', Frame:'Aluminium, matte black', Layout:'Corridor with framed doors', Finish:'Flush ironmongery'}, img:'/images/office-partitioning-izwof.jpg'},
  {cat:'office', tag:'Office Partitioning', title:'Reception Glass Wall & Door', desc:'A glazed reception wall with a matching framed glass door, screening the front desk from the floor behind it.', specs:{Glass:'10mm tempered', Frame:'Aluminium, black anodised', Door:'Framed leaf with patch fittings', Finish:'Clear'}, img:'/images/office-reception-glass-wall.jpg'},
  {cat:'curtain', tag:'Curtain Walling', title:'Structural Glass Facade', desc:'Engineered aluminium mullion-and-transom curtain wall system for commercial building exteriors.', specs:{Glass:'Insulated/laminated units', Frame:'Structural aluminium mullions', Rating:'Weather & wind-load engineered', Finish:'Powder-coated or anodised'}, img:'/images/structural-facade.jpg'},
  {cat:'curtain', tag:'Curtain Walling', title:'Shopfront Glazing', desc:'Ground-floor aluminium-framed glazing for retail and office shopfronts, built for daily traffic.', specs:{Glass:'10-12mm tempered/laminated', Frame:'Heavy-duty aluminium', Doors:'Integrated entry doors', Finish:'Anodised aluminium'}, img:'/images/shopfront-glazing.jpg'},
  {cat:'curtain', tag:'Curtain Walling', title:'Spider-Fitted Glass Wall', desc:'Frameless glass wall held by stainless steel spider fittings, for a minimal structural look.', specs:{Glass:'12mm tempered, laminated', Fixing:'Stainless spider fittings', Frame:'Minimal / frameless', Finish:'Mirror-polished steel'}, img:'/images/spider-fitted-glass-wall.jpg'},
  {cat:'curtain', tag:'Curtain Walling', title:'Residential Feature Facade', desc:'A full-height glazed feature strip running the height of a residential block, set in aluminium mullions.', specs:{Glass:'Laminated safety units', Frame:'Aluminium mullion & transom', Storeys:'Six floors', Finish:'Powder-coated'}, img:'/images/residential-curtain-wall.jpg'},
  {cat:'curtain', tag:'Curtain Walling', title:'Townhouse Feature Glazing', desc:'Tall narrow strips of full-height glazing set into a rendered townhouse elevation, pulling light deep into the plan.', specs:{Glass:'10mm tempered, clear', Frame:'Aluminium cassette system', Panels:'Full-height fixed lights', Finish:'Dark anodised'}, img:'/images/curtain-wall-town-house.jpg'},
  {cat:'railing', tag:'Stainless Steel Railings', title:'Glass Balustrade Railing', desc:'Stainless steel posts and handrail with tempered glass infill — for staircases and balconies.', specs:{Steel:'Grade 304 stainless', Glass:'10mm tempered infill', Finish:'Brushed or mirror', Application:'Staircase / balcony'}, img:'/images/balustrade.jpg'},
  {cat:'railing', tag:'Stainless Steel Railings', title:'Bar Handrail System', desc:'Vertical stainless steel bar railing with a rounded handrail, for walkways and terraces.', specs:{Steel:'Grade 304 stainless', Style:'Vertical bar infill', Finish:'Brushed satin', Application:'Walkway / terrace'}, img:'/images/stainless-steel-handrail.jpg'},
  {cat:'railing', tag:'Stainless Steel Railings', title:'Stair Balustrade, Glass Infill', desc:'Round stainless posts and a tubular handrail with clear glass panels, running the flight and landing of an internal staircase.', specs:{Steel:'Grade 304 stainless', Glass:'10mm tempered infill', Finish:'Brushed', Application:'Internal staircase'}, img:'/images/stairs-balustrade.jpg'},
  // {cat:'railing', tag:'Stainless Steel Railings', title:'Cable Wire Balustrade', desc:'Slim stainless posts with tensioned cable infill, for an open, low-profile balcony rail.', specs:{Steel:'Grade 316 marine stainless', Infill:'Tensioned cable wire', Finish:'Brushed', Application:'Balcony / outdoor'}}
  {cat:'window', tag:'Windows & Doors', title:'Projected Window Bank', desc:'A run of projected windows in dark aluminium frames, venting an office while leaving the view out unbroken.', specs:{Profile:'Aluminium, black anodised', Opening:'Projected, top-hung', Glass:'6mm clear tempered', Hardware:'Friction stays & handle'}, img:'/images/projected-windows.jpg'},
  {cat:'window', tag:'Windows & Doors', title:'Frameless Glass Swing Doors', desc:'Frameless glass leaves with fixed side panels, opening an entrance to the full width of the storefront.', specs:{Glass:'12mm tempered', Frame:'Frameless', Hardware:'Patch fittings & floor spring', Finish:'Polished stainless'}, img:'/images/frameless-swing-door.jpg'},
  {cat:'window', tag:'Windows & Doors', title:'Residential Sliding window', desc:'Full-width sliding windows in an apartment, dark frames with a clear view out to the grounds.', specs:{Profile:'Aluminium, black', Opening:'Sliding, interlocking', Glass:'6mm tempered clear', Hardware:'Flush pull handle'}, img:'/images/sliding-windows-residential.jpg'},
  {cat:'window', tag:'Windows & Doors', title:'Sliding Window Pair', desc:'Two-track sliding windows with slim dark frames, sized for the main openings of a townhouse.', specs:{Profile:'Aluminium, powder-coated', Opening:'Sliding, two tracks', Glass:'6mm clear', Screen:'Optional insect screen'}, img:'/images/sliding-window-town-house.jpg'},
  {cat:'window', tag:'Windows & Doors', title:'Sliding Window & Balcony Glazing', desc:'A tall sliding window paired with a glass balcony panel, set into a feature arch on a townhouse elevation.', specs:{Profile:'Aluminium, dark', Opening:'Sliding, two tracks', Glass:'6mm clear', Balcony:'Fixed glass panel'}, img:'/images/sliding-window-balcony-balustrade.jpg'},
  {cat:'window', tag:'Windows & Doors', title:'Townhouse Window Set', desc:'A repeated set of fixed and sliding windows glazing a terrace of townhouse units, matched to the gate finishes.', specs:{Profile:'Aluminium, dark anodised', Units:'Mixed fixed and sliding', Glass:'6mm clear tempered', Install:'Programme of units'}, img:['/images/sliding-windows-town-house-row.jpg', '/images/sliding-windows-town-house-detail.jpg']},
  {cat:'custom', tag:'Pergolas & Custom', title:'Glass Pergola Canopy', desc:'An aluminium-framed canopy of tempered glass panels over an entrance, throwing rain clear of the doorway.', specs:{Frame:'Aluminium beams, powder-coated', Glass:'Laminated tempered panels', Drainage:'Falls to the side', Finish:'Clear or tinted'}, img:'/images/glass-pergola-canopy.jpg'}
];

/** Slides for the About-section photo carousel (project photos from /images). */
const ABOUT_SLIDES: { img: string; label: string }[] = [
  { img: '/images/aluminium-frame-office-partitioning.jpg', label: 'Office Partitioning' },
  { img: '/images/frameless-shower-cubicle.jpg', label: 'Shower Cubicles' },
  { img: '/images/structural-facade.jpg', label: 'Curtain Walling' },
  { img: '/images/balustrade.jpg', label: 'Glass Balustrades' },
  { img: '/images/shopfront-glazing.jpg', label: 'Shopfront Glazing' },
  { img: '/images/stainless-steel-handrail.jpg', label: 'Stainless Railings' }
];

/** Slides for the hero carousel — a cross-section of finished AGL work. */
const HERO_SLIDES: { img: string; label: string }[] = [
  { img: '/images/structural-facade.jpg', label: 'Curtain Walling' },
  { img: '/images/frameless-shower-cubicle.jpg', label: 'Shower Cubicles' },
  { img: '/images/aluminium-frame-office-partitioning.jpg', label: 'Office Partitioning' },
  { img: '/images/shopfront-glazing.jpg', label: 'Shopfront Glazing' },
  { img: '/images/balustrade.jpg', label: 'Glass Balustrades' }
];

/** Partner logos for the hero marquee — files live in public/partners/LOGOS, slug-cased and capped at 600px. */
const PARTNERS: { name: string; logo: string }[] = [
  { name: 'ABC Tiles', logo: '/partners/LOGOS/abc-tiles.jpg' },
  { name: 'Air Arabia', logo: '/partners/LOGOS/air-arabia.png' },
  { name: 'Amara Gardens', logo: '/partners/LOGOS/amara-gardens.jpg' },
  { name: 'Business Bay Square', logo: '/partners/LOGOS/business-bay-square.jpg' },
  { name: 'Chicken Cottage', logo: '/partners/LOGOS/chicken-cottage.jpg' },
  { name: "CJ's", logo: '/partners/LOGOS/cjs.jpg' },
  { name: 'City Oil', logo: '/partners/LOGOS/city-oil.png' },
  { name: 'Eldo Plaza', logo: '/partners/LOGOS/eldo-plaza.jpg' },
  { name: 'Epic Ceramics', logo: '/partners/LOGOS/epic-ceramics.png' },
  { name: 'Ingenious Solution', logo: '/partners/LOGOS/ingenious-solution.jpg' },
  { name: 'IZWOF', logo: '/partners/LOGOS/izwof.jpg' },
  { name: 'Khalif Modern Homes', logo: '/partners/LOGOS/khalif-homes.jpg' },
  { name: 'Luqman', logo: '/partners/LOGOS/luqman.png' },
  { name: 'Macaash', logo: '/partners/LOGOS/macaash.png' },
  { name: 'OKA Group', logo: '/partners/LOGOS/oka-group.jpg' },
  { name: "Papa John's", logo: '/partners/LOGOS/papa-johns.png' },
  { name: 'Prime Brick Developers', logo: '/partners/LOGOS/prime-brick.png' },
  { name: 'Rubis', logo: '/partners/LOGOS/rubis.jpg' },
  { name: 'Somerica', logo: '/partners/LOGOS/somerica.png' },
  { name: 'Tanzil Gardens', logo: '/partners/LOGOS/tanzil-gardens.png' },
  { name: 'Union Homes', logo: '/partners/LOGOS/union-homes.png' },
  { name: 'Wakefield', logo: '/partners/LOGOS/wakefield.png' }
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, LocationMapComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private readonly cleanup: Array<() => void> = [];
  private currentIdx = 0;
  private disposeLightboxGallery?: () => void;

  /** Partners for the hero marquee. */
  readonly partners = PARTNERS;

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.renderShowroom();
    this.bindTabs();
    this.bindShowroomLinks();
    this.bindProductPanes();
    this.bindLightbox();
    this.bindContactForm();
    this.setupCarousel('aboutCarousel', ABOUT_SLIDES, 4500);
    this.setupCarousel('heroCarousel', HERO_SLIDES, 5200);
    this.bindPartnersMarquee();
  }

  ngOnDestroy(): void {
    this.disposeLightboxGallery?.();
    this.cleanup.forEach((dispose) => dispose());
  }

  private query<T extends Element>(selector: string): T {
    const element = this.host.nativeElement.querySelector<T>(selector);
    if (!element) throw new Error(`Missing element: ${selector}`);
    return element;
  }

  private queryAll<T extends Element>(selector: string): T[] {
    return Array.from(this.host.nativeElement.querySelectorAll<T>(selector));
  }

  private byId(id: string): HTMLElement {
    return this.query<HTMLElement>(`#${id}`);
  }

  private listen(target: EventTarget, event: string, callback: EventListener): void {
    target.addEventListener(event, callback);
    this.cleanup.push(() => target.removeEventListener(event, callback));
  }

  private renderShowroom(): void {
    const grid = this.byId('showGrid');
    grid.innerHTML = ITEMS.map((item, index) => `
      <div class="show-card" data-cat="${item.cat}" data-idx="${index}">
        <div class="art">${this.artMarkup(item, true)}</div>
        <div class="tag">${item.tag}</div>
        <div class="expand">＋</div>
        <div class="cap"><h4>${item.title}</h4><span>${item.cat}</span></div>
      </div>
    `).join('');

    this.queryAll<HTMLElement>('.show-card').forEach((card) => {
      this.listen(card, 'click', () => this.openLightbox(Number(card.dataset['idx'])));
      const gallery = card.querySelector<HTMLElement>('.sg');
      if (gallery) this.cleanup.push(this.bindGallery(gallery, 4000));
    });
  }

  private photos(item: ShowroomItem): string[] {
    if (!item.img) return [];
    return Array.isArray(item.img) ? item.img : [item.img];
  }

  /** Single photo, a photo carousel (2+ photos), or the line-art icon. */
  private artMarkup(item: ShowroomItem, lazy: boolean): string {
    const photos = this.photos(item);
    const loading = (i: number): string => (lazy || i > 0 ? ' loading="lazy"' : '');
    if (photos.length === 0) return ICONS[item.cat];
    if (photos.length === 1) return `<img src="${photos[0]}" alt="${item.title}"${loading(0)}>`;
    return `
      <div class="sg">
        ${photos.map((src, i) => `
          <div class="ac-slide sg-slide${i === 0 ? ' active' : ''}" data-i="${i}">
            <img src="${src}" alt="${item.title} — photo ${i + 1} of ${photos.length}"${loading(i)}>
          </div>`).join('')}
        <button type="button" class="ac-btn sg-btn sg-prev" aria-label="Previous photo">&#8592;</button>
        <button type="button" class="ac-btn sg-btn sg-next" aria-label="Next photo">&#8594;</button>
        <div class="sg-dots">${photos.map((_, i) => `<button type="button" class="ac-dot${i === 0 ? ' active' : ''}" data-i="${i}" aria-label="Show photo ${i + 1}"></button>`).join('')}</div>
      </div>`;
  }

  /** Wires a photo carousel rendered by artMarkup. Returns a disposer. autoMs = 0 disables auto-advance. */
  private bindGallery(gallery: HTMLElement, autoMs: number): () => void {
    const slides = Array.from(gallery.querySelectorAll<HTMLElement>('.sg-slide'));
    const dots = Array.from(gallery.querySelectorAll<HTMLElement>('.ac-dot'));
    const disposers: Array<() => void> = [];
    let index = 0;
    let timer: ReturnType<typeof setInterval> | undefined;

    const on = (target: EventTarget, event: string, cb: EventListener): void => {
      target.addEventListener(event, cb);
      disposers.push(() => target.removeEventListener(event, cb));
    };
    const show = (next: number): void => {
      index = ((next % slides.length) + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    };
    const stop = (): void => { if (timer) { clearInterval(timer); timer = undefined; } };
    const start = (): void => {
      stop();
      if (!autoMs || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
      timer = setInterval(() => show(index + 1), autoMs);
    };
    // Controls must not bubble up to the card (which opens the lightbox).
    const control = (action: () => void): EventListener => (event) => { event.stopPropagation(); action(); };

    on(gallery.querySelector('.sg-prev')!, 'click', control(() => show(index - 1)));
    on(gallery.querySelector('.sg-next')!, 'click', control(() => show(index + 1)));
    dots.forEach((dot, i) => on(dot, 'click', control(() => show(i))));
    on(gallery, 'mouseenter', stop);
    on(gallery, 'mouseleave', start);
    start();

    return () => { stop(); disposers.forEach((dispose) => dispose()); };
  }

  private bindTabs(): void {
    const tabs = this.queryAll<HTMLElement>('.tab');
    tabs.forEach((tab) => {
      this.listen(tab, 'click', () => {
        tabs.forEach((entry) => entry.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset['tab'];
        this.queryAll<HTMLElement>('.show-card').forEach((card) => {
          card.classList.toggle('hide', filter !== 'all' && card.dataset['cat'] !== filter);
        });
      });
    });
  }

  private bindShowroomLinks(): void {
    this.queryAll<HTMLElement>('[data-goto]').forEach((link) => {
      this.listen(link, 'click', (event) => {
        event.preventDefault();
        const target = this.host.nativeElement.querySelector<HTMLElement>(`.tab[data-tab="${link.dataset['goto']}"]`);
        target?.click();
        this.byId('showroom').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  private bindProductPanes(): void {
    this.queryAll<HTMLElement>('.pane').forEach((pane) => {
      this.listen(pane, 'click', (event) => {
        if ((event.target as Element).closest('a')) return;
        const filter = pane.dataset['filter'];
        if (!filter) return;
        const target = this.host.nativeElement.querySelector<HTMLElement>(`.tab[data-tab="${filter}"]`);
        if (!target) return;
        target.click();
        this.byId('showroom').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  private bindLightbox(): void {
    const lightbox = this.byId('lightbox');
    this.listen(this.byId('lbClose'), 'click', () => lightbox.classList.remove('open'));
    this.listen(lightbox, 'click', (event) => {
      if (event.target === lightbox) lightbox.classList.remove('open');
    });
    this.listen(this.byId('lbPrev'), 'click', () => {
      this.openLightbox((this.currentIdx - 1 + ITEMS.length) % ITEMS.length);
    });
    this.listen(this.byId('lbNext'), 'click', () => {
      this.openLightbox((this.currentIdx + 1) % ITEMS.length);
    });
    this.listen(document, 'keydown', (event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (!lightbox.classList.contains('open')) return;
      if (keyboardEvent.key === 'Escape') lightbox.classList.remove('open');
      if (keyboardEvent.key === 'ArrowRight') this.byId('lbNext').click();
      if (keyboardEvent.key === 'ArrowLeft') this.byId('lbPrev').click();
    });
  }

  private openLightbox(index: number): void {
    this.currentIdx = index;
    const item = ITEMS[index];
    if (!item) return;
    this.disposeLightboxGallery?.();
    this.disposeLightboxGallery = undefined;
    const art = this.byId('lbArt');
    art.innerHTML = this.artMarkup(item, false);
    const gallery = art.querySelector<HTMLElement>('.sg');
    if (gallery) this.disposeLightboxGallery = this.bindGallery(gallery, 0);
    this.byId('lbTag').textContent = item.tag;
    this.byId('lbTitle').textContent = item.title;
    this.byId('lbDesc').textContent = item.desc;
    this.byId('lbSpecs').innerHTML = Object.entries(item.specs)
      .map(([key, value]) => `<div><span>${key}</span><span>${value}</span></div>`)
      .join('');
    this.byId('lightbox').classList.add('open');
  }

  private bindContactForm(): void {
    const form = this.byId('quoteForm') as HTMLFormElement;
    this.listen(form, 'submit', (event) => {
      event.preventDefault();
      submitQuoteRequest(readQuoteForm(form));
    });
  }

  private setupCarousel(id: string, slides: { img: string; label: string }[], intervalMs: number): void {
    const frame = this.byId(id);
    frame.innerHTML = `
      <div class="ac-track">
        ${slides.map((slide, i) => `
          <div class="ac-slide${i === 0 ? ' active' : ''}" data-i="${i}">
            <img src="${slide.img}" alt="${slide.label} project photo" loading="${i === 0 ? 'eager' : 'lazy'}">
          </div>`).join('')}
      </div>
      <div class="ac-nav">
        <button class="ac-btn ac-prev" aria-label="Previous photo">&#8592;</button>
        <button class="ac-btn ac-next" aria-label="Next photo">&#8594;</button>
      </div>
      <div class="ac-foot">
        <div class="ac-cap"><span class="ac-num">01</span><span class="ac-label">${slides[0]!.label}</span></div>
        <div class="ac-dots">${slides.map((_, i) => `<button class="ac-dot${i === 0 ? ' active' : ''}" data-i="${i}" aria-label="Show photo ${i + 1}"></button>`).join('')}</div>
      </div>`;

    let index = 0;
    let timer: ReturnType<typeof setInterval> | undefined;

    const show = (next: number): void => {
      index = ((next % slides.length) + slides.length) % slides.length;
      frame.querySelectorAll<HTMLElement>('.ac-slide').forEach((slide) => {
        slide.classList.toggle('active', Number(slide.dataset['i']) === index);
      });
      frame.querySelectorAll<HTMLElement>('.ac-dot').forEach((dot) => {
        dot.classList.toggle('active', Number(dot.dataset['i']) === index);
      });
      frame.querySelector('.ac-num')!.textContent = String(index + 1).padStart(2, '0');
      frame.querySelector('.ac-label')!.textContent = slides[index]!.label;
    };

    const restart = (): void => {
      if (timer) clearInterval(timer);
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
      timer = setInterval(() => show(index + 1), intervalMs);
    };

    const manual = (action: () => void): EventListener => () => { action(); restart(); };
    frame.querySelectorAll<HTMLElement>('.ac-dot').forEach((dot) => {
      this.listen(dot, 'click', manual(() => show(Number(dot.dataset['i']))));
    });
    this.listen(frame.querySelector('.ac-prev')!, 'click', manual(() => show(index - 1)));
    this.listen(frame.querySelector('.ac-next')!, 'click', manual(() => show(index + 1)));
    this.listen(frame, 'mouseenter', () => { if (timer) { clearInterval(timer); timer = undefined; } });
    this.listen(frame, 'mouseleave', restart);
    restart();
    this.cleanup.push(() => { if (timer) clearInterval(timer); });
  }

  /**
   * Auto-scrolls the partners band by moving the viewport's scrollLeft, so the
   * same strip can also be swiped/dragged by hand (a CSS transform animation
   * can't be). The track holds the logos twice; crossing the halfway point
   * jumps back by half, which is seamless because both halves are identical.
   */
  private bindPartnersMarquee(): void {
    const viewport = this.host.nativeElement.querySelector<HTMLElement>('.pm-viewport');
    const track = viewport?.querySelector<HTMLElement>('.pm-track');
    if (!viewport || !track) return;

    const LOOP_SECONDS = 80; // time to travel one full set of logos
    const RESUME_DELAY_MS = 1500; // pause after the user lets go
    let pos = viewport.scrollLeft; // fractional position; scrollLeft rounds on some browsers
    let last = 0;
    let frame = 0;
    let holding = false;
    let resumeAt = 0;

    const half = (): number => track.scrollWidth / 2;
    const wrap = (value: number): number => {
      const h = half();
      if (h <= 0) return value;
      if (value >= h) return value - h;
      if (value <= 0) return value + h;
      return value;
    };

    const tick = (now: number): void => {
      const dt = last ? Math.min(now - last, 100) : 0;
      last = now;
      if (!holding && now >= resumeAt && half() > viewport.clientWidth / 2) {
        pos = wrap(pos + (half() / LOOP_SECONDS) * (dt / 1000));
        viewport.scrollLeft = pos;
      }
      frame = requestAnimationFrame(tick);
    };

    const hold = (): void => { holding = true; };
    const release = (): void => { holding = false; resumeAt = performance.now() + RESUME_DELAY_MS; };
    const onScroll = (): void => {
      // Manual swipes (and momentum) move scrollLeft directly — follow them and keep the loop endless.
      if (Math.abs(viewport.scrollLeft - pos) > 1) {
        pos = wrap(viewport.scrollLeft);
        if (pos !== viewport.scrollLeft) viewport.scrollLeft = pos;
        resumeAt = performance.now() + RESUME_DELAY_MS;
      }
    };

    // Desktop: drag with the mouse to scroll, same as swiping on touch.
    let dragX = 0;
    let dragStart = 0;
    const onMouseDown = (event: Event): void => {
      const e = event as MouseEvent;
      e.preventDefault();
      hold();
      dragX = e.clientX;
      dragStart = pos;
      viewport.style.cursor = 'grabbing';
    };
    const onMouseMove = (event: Event): void => {
      if (!holding || !dragX) return;
      pos = wrap(dragStart - ((event as MouseEvent).clientX - dragX));
      viewport.scrollLeft = pos;
    };
    const onMouseUp = (): void => {
      if (!dragX) return;
      dragX = 0;
      viewport.style.cursor = '';
      release();
    };

    this.listen(viewport, 'touchstart', hold);
    this.listen(viewport, 'touchend', release);
    this.listen(viewport, 'touchcancel', release);
    this.listen(viewport, 'mousedown', onMouseDown);
    this.listen(window, 'mousemove', onMouseMove);
    this.listen(window, 'mouseup', onMouseUp);
    this.listen(viewport, 'scroll', onScroll);
    const onWheel = (): void => { resumeAt = performance.now() + RESUME_DELAY_MS; };
    viewport.addEventListener('wheel', onWheel, { passive: true });
    this.cleanup.push(() => viewport.removeEventListener('wheel', onWheel));
    viewport.style.cursor = 'grab';

    frame = requestAnimationFrame(tick);
    this.cleanup.push(() => cancelAnimationFrame(frame));
  }
}
