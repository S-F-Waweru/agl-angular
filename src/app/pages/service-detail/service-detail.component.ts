import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { SERVICE_PAGES, ServicePage } from '../../data/services.data';
import { SITE_URL, SeoService } from '../../seo';

/**
 * Renders a single service page from SERVICE_PAGES and applies its spec
 * metadata. Unknown slugs fall back to the services hub. The route carries
 * no `data`, so the shell's metadata logic stays out of the way here.
 */
@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './service-detail.component.html'
})
export class ServiceDetailComponent implements OnDestroy {
  service?: ServicePage;
  private readonly paramSub: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly seo: SeoService
  ) {
    this.paramSub = this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      const service = SERVICE_PAGES.find((entry) => entry.slug === slug);
      if (!service) {
        void this.router.navigate(['/services']);
        return;
      }
      this.service = service;
      const url = `${SITE_URL}/services/${service.slug}`;
      this.seo.apply({
        title: service.metaTitle,
        description: service.metaDescription,
        keywords: service.keywords,
        path: `/services/${service.slug}`,
        image: SITE_URL + service.image,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'Service',
          '@id': `${url}#service`,
          name: service.name,
          serviceType: service.name,
          description: service.metaDescription,
          url,
          image: SITE_URL + service.image,
          provider: { '@id': `${SITE_URL}/#business` },
          areaServed: { '@type': 'Country', name: 'Kenya' }
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.paramSub.unsubscribe();
  }
}
