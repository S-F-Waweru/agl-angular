import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

type Category = 'shower' | 'office' | 'curtain' | 'railing';

interface ShowroomItem {
  cat: Category;
  tag: string;
  title: string;
  desc: string;
  specs: Record<string, string>;
  /** Project photo from /images; falls back to the line-art icon when absent. */
  img?: string;
}

const ICONS: Record<Category, string> = {
  shower: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="10" y="6" width="28" height="36" rx="1"/><path d="M10 6 L38 6 M24 6 L24 42" opacity="0.5"/><circle cx="30" cy="24" r="1.6" fill="currentColor" stroke="none"/><path d="M16 30c2-2 4-2 6 0s4 2 6 0" opacity="0.6"/></svg>`,
  office: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="6" y="10" width="36" height="28" rx="1"/><path d="M16 10v28M28 10v28M6 24h36" opacity="0.5"/></svg>`,
  curtain: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="8" y="4" width="32" height="40" rx="1"/><path d="M8 12h32M8 20h32M8 28h32M8 36h32M16 4v40M24 4v40M32 4v40" opacity="0.4"/></svg>`,
  railing: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M6 40h36"/><path d="M10 40V16M18 40V16M26 40V16M34 40V16"/><path d="M6 16h36" opacity="0.6"/></svg>`
};

const ITEMS: ShowroomItem[] = [
  {cat:'shower', tag:'Shower Cubicles', title:'Frameless Corner Enclosure', desc:'Two fixed panels and a hinged door, minimal aluminium contact for a clean sightline. Suited to walk-in corner showers.', specs:{Glass:'8mm tempered, clear', Frame:'Frameless, polished edges', Hardware:'Stainless hinges & handle', Finish:'Anti-water-spot coating'}, img:'/images/frameless-shower-cubicle.jpg'},
  // {cat:'shower', tag:'Shower Cubicles', title:'Semi-Frameless Sliding Door', desc:'Aluminium top and bottom track with a sliding tempered glass door — a durable option for family bathrooms.', specs:{Glass:'6mm tempered, clear or frosted', Frame:'Slim aluminium track', Hardware:'Soft-close sliders', Finish:'Matte black or silver'}, img:'/images/aluminium-frame-shower-cubicle.jpg'},
  {cat:'shower', tag:'Shower Cubicles', title:'Fixed Screen + Door', desc:'A fixed glass screen paired with a hinged door, for straight-wall shower bays.', specs:{Glass:'8mm tempered', Frame:'Frameless', Hardware:'Wall-mounted hinges', Finish:'Clear or lightly tinted'},img:'/images/aluminium-frame-shower-cubicle.jpg'},
  {cat:'office', tag:'Office Partitioning', title:'Full-Height Glass Partition', desc:'Floor-to-ceiling aluminium-framed glass partitioning for meeting rooms and private offices.', specs:{Glass:'10mm tempered/laminated', Frame:'Slim-profile aluminium', Acoustic:'Optional acoustic seal', Finish:'Clear, frosted or manifested'}, img:'/images/aluminium-frame-office-partitioning.jpg'},
  // {cat:'office', tag:'Office Partitioning', title:'Framed Modular Partition', desc:'Demountable partition system that can be reconfigured as office layouts change.', specs:{Glass:'6-8mm tempered', Frame:'Aluminium modular grid', Install:'Demountable', Finish:'Powder-coated frame'}},
  {cat:'office', tag:'Office Partitioning', title:'Frosted Privacy Screen', desc:'Sandblasted or frosted glass panels for meeting rooms and private workstations that need visual privacy.', specs:{Glass:'6mm frosted/sandblasted', Frame:'Aluminium', Privacy:'Full or half-height', Finish:'Matte frost'}, img:'/images/office-partitioning.jpg'},
  {cat:'curtain', tag:'Curtain Walling', title:'Structural Glass Facade', desc:'Engineered aluminium mullion-and-transom curtain wall system for commercial building exteriors.', specs:{Glass:'Insulated/laminated units', Frame:'Structural aluminium mullions', Rating:'Weather & wind-load engineered', Finish:'Powder-coated or anodised'}, img:'/images/structural-facade.jpg'},
  {cat:'curtain', tag:'Curtain Walling', title:'Shopfront Glazing', desc:'Ground-floor aluminium-framed glazing for retail and office shopfronts, built for daily traffic.', specs:{Glass:'10-12mm tempered/laminated', Frame:'Heavy-duty aluminium', Doors:'Integrated entry doors', Finish:'Anodised aluminium'}, img:'/images/shopfront-glazing.jpg'},
  {cat:'curtain', tag:'Curtain Walling', title:'Spider-Fitted Glass Wall', desc:'Frameless glass wall held by stainless steel spider fittings, for a minimal structural look.', specs:{Glass:'12mm tempered, laminated', Fixing:'Stainless spider fittings', Frame:'Minimal / frameless', Finish:'Mirror-polished steel'}, img:'/images/spider-fitted-glass-wall.jpg'},
  {cat:'railing', tag:'Stainless Steel Railings', title:'Glass Balustrade Railing', desc:'Stainless steel posts and handrail with tempered glass infill — for staircases and balconies.', specs:{Steel:'Grade 304 stainless', Glass:'10mm tempered infill', Finish:'Brushed or mirror', Application:'Staircase / balcony'}, img:'/images/balustrade.jpg'},
  {cat:'railing', tag:'Stainless Steel Railings', title:'Bar Handrail System', desc:'Vertical stainless steel bar railing with a rounded handrail, for walkways and terraces.', specs:{Steel:'Grade 304 stainless', Style:'Vertical bar infill', Finish:'Brushed satin', Application:'Walkway / terrace'}, img:'/images/stainless-steel-handrail.jpg'},
  // {cat:'railing', tag:'Stainless Steel Railings', title:'Cable Wire Balustrade', desc:'Slim stainless posts with tensioned cable infill, for an open, low-profile balcony rail.', specs:{Steel:'Grade 316 marine stainless', Infill:'Tensioned cable wire', Finish:'Brushed', Application:'Balcony / outdoor'}}
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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private readonly cleanup: Array<() => void> = [];
  private currentIdx = 0;

  /** Partners for the hero marquee. Drop real logo files into public/partners and update these paths. */
  readonly partners: { name: string; logo: string }[] = [
    { name: 'Sunrise Contractors', logo: '/partners/sunrise.svg' },
    { name: 'Capstone Builders', logo: '/partners/capstone.svg' },
    { name: 'BlueCrest Architects', logo: '/partners/bluecrest.svg' },
    { name: 'Mavuno Interiors', logo: '/partners/mavuno.svg' },
    { name: 'Rift Valley Glass', logo: '/partners/rift-valley.svg' },
    { name: 'Equinox Projects', logo: '/partners/equinox.svg' },
    { name: 'Penta Construction', logo: '/partners/penta.svg' },
    { name: 'Greenline Facilities', logo: '/partners/greenline.svg' }
  ];

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
  }

  ngOnDestroy(): void {
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
        <div class="art">${item.img ? `<img src="${item.img}" alt="${item.title}" loading="lazy">` : ICONS[item.cat]}</div>
        <div class="tag">${item.tag}</div>
        <div class="expand">＋</div>
        <div class="cap"><h4>${item.title}</h4><span>${item.cat}</span></div>
      </div>
    `).join('');

    this.queryAll<HTMLElement>('.show-card').forEach((card) => {
      this.listen(card, 'click', () => this.openLightbox(Number(card.dataset['idx'])));
    });
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
    this.byId('lbArt').innerHTML = item.img ? `<img src="${item.img}" alt="${item.title}">` : ICONS[item.cat];
    this.byId('lbTag').textContent = item.tag;
    this.byId('lbTitle').textContent = item.title;
    this.byId('lbDesc').textContent = item.desc;
    this.byId('lbSpecs').innerHTML = Object.entries(item.specs)
      .map(([key, value]) => `<div><span>${key}</span><span>${value}</span></div>`)
      .join('');
    this.byId('lightbox').classList.add('open');
  }

  private bindContactForm(): void {
    this.listen(this.byId('quoteForm'), 'submit', (event) => {
      event.preventDefault();
      alert('This form is a working layout — connect it to email, WhatsApp, or a form service (e.g. Formspree) to receive submissions.');
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
}
