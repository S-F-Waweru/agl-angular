import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/** Address lines shown as text under the map heading. */
const ADDRESS_LINES = ['Business District, Plot 209, ICD Road', 'Off Mombasa Road', 'Nairobi, Kenya'];

/** What Google Maps searches for, for both the embedded map and the "Open in Google Maps" link. */
const MAP_QUERY = 'Alternative Glasses Limited, Plot 209, ICD Road, off Mombasa Road, Nairobi, Kenya';

/** Workshop location snapshot (address + map) shown under the quote / site-visit forms. */
@Component({
  selector: 'app-location-map',
  standalone: true,
  template: `
    <div class="loc-map">
      <div class="loc-map-head">
        <span class="loc-map-k">Find our Offices</span>
<!--        <a [href]="linkUrl" target="_blank" rel="noopener">Open in Google Maps &#8599;</a>-->
      </div>
      <address class="loc-map-addr">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>
        <span>
          <strong>Alternative Glasses Limited</strong>
          @for (line of addressLines; track line) { <span class="loc-map-line">{{ line }}</span> }
        </span>
      </address>
<!--      <div class="loc-map-frame">-->
<!--        <iframe-->
<!--          [src]="embedUrl"-->
<!--          title="Alternative Glasses Limited location map"-->
<!--          loading="lazy"-->
<!--          referrerpolicy="no-referrer-when-downgrade"-->
<!--          allowfullscreen></iframe>-->
<!--      </div>-->
    </div>
  `
})
export class LocationMapComponent {
  readonly addressLines = ADDRESS_LINES;
  readonly linkUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;
  readonly embedUrl: SafeResourceUrl;

  constructor(sanitizer: DomSanitizer) {
    // Constant, trusted Google Maps URL — safe to bypass resource-URL sanitisation.
    this.embedUrl = sanitizer.bypassSecurityTrustResourceUrl(
      `https://maps.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&z=15&output=embed`
    );
  }
}
