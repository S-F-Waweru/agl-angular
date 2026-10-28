import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { SERVICE_PAGES, ServicePage } from '../../data/services.data';

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
    private readonly title: Title,
    private readonly meta: Meta
  ) {
    this.paramSub = this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      const service = SERVICE_PAGES.find((entry) => entry.slug === slug);
      if (!service) {
        void this.router.navigate(['/services']);
        return;
      }
      this.service = service;
      this.title.setTitle(service.metaTitle);
      this.meta.updateTag({ name: 'description', content: service.metaDescription });
      this.meta.updateTag({ name: 'keywords', content: service.keywords });
    });
  }

  ngOnDestroy(): void {
    this.paramSub.unsubscribe();
  }
}
