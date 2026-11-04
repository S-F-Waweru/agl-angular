import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

/** Production origin used for canonical URLs, social tags and structured data. */
export const SITE_URL = 'https://agl.co.ke';
export const SITE_NAME = 'Alternative Glasses Limited';
const DEFAULT_IMAGE = `${SITE_URL}/images/structural-facade.jpg`;

export interface PageSeo {
  title: string;
  description: string;
  keywords?: string;
  /** Path for the canonical URL, e.g. `/services`. Defaults to the current location. */
  path?: string;
  image?: string;
  /** Page-specific JSON-LD (FAQPage, Service, ...). Cleared on the next page. */
  jsonLd?: object | null;
}

/**
 * Keeps <title>, description, canonical, Open Graph / Twitter tags and an
 * optional page-level JSON-LD block in sync with the current route.
 * The business-level JSON-LD lives statically in index.html.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  apply(page: PageSeo): void {
    const path = page.path ?? this.doc.location?.pathname ?? '/';
    const url = SITE_URL + (path === '/' ? '/' : path.replace(/\/+$/, ''));
    const image = page.image ?? DEFAULT_IMAGE;

    this.title.setTitle(page.title);
    this.meta.updateTag({ name: 'description', content: page.description });
    if (page.keywords) this.meta.updateTag({ name: 'keywords', content: page.keywords });

    this.meta.updateTag({ property: 'og:title', content: page.title });
    this.meta.updateTag({ property: 'og:description', content: page.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ name: 'twitter:title', content: page.title });
    this.meta.updateTag({ name: 'twitter:description', content: page.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    this.setCanonical(url);
    this.setPageJsonLd(page.jsonLd ?? null);
  }

  private setCanonical(url: string): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setPageJsonLd(data: object | null): void {
    const existing = this.doc.head.querySelector('script[data-page-jsonld]');
    existing?.remove();
    if (!data) return;
    const script = this.doc.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-page-jsonld', '');
    script.textContent = JSON.stringify(data);
    this.doc.head.appendChild(script);
  }
}
