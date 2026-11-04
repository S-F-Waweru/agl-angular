import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ServicesComponent } from './pages/services/services.component';
import { ServiceDetailComponent } from './pages/service-detail/service-detail.component';
import { ProcessComponent } from './pages/process/process.component';
import { ContactComponent } from './pages/contact/contact.component';
import { FAQ_JSON_LD, FaqsComponent } from './pages/faqs/faqs.component';

/**
 * Route table mirroring the SEO content spec (meta title / description /
 * keywords per page). Service detail routes read their metadata from
 * SERVICE_PAGES in the component itself.
 */
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: 'Aluminium & Glass Fabrication Company in Kenya | Alternative Glasses Limited',
      description: 'Alternative Glasses Limited (AGL) provides custom aluminium, glass and stainless-steel fabrication in Kenya, including windows, doors, partitions, shower cubicles, curtain walling and railings.',
      keywords: 'Alternative Glasses Limited; aluminium and glass fabrication company in Kenya; glass and aluminium company in Nairobi'
    }
  },
  {
    path: 'about-alternative-glasses-limited',
    component: AboutComponent,
    data: {
      title: 'About Alternative Glasses Limited | Glass and Aluminium Company in Nairobi',
      description: 'Learn about Alternative Glasses Limited, a Nairobi-based glass and aluminium company providing custom fabrication and installation across Kenya.',
      keywords: 'glass and aluminium company in Nairobi; aluminium and glass fabrication Kenya; custom glass fabrication Nairobi'
    }
  },
  {
    path: 'services',
    component: ServicesComponent,
    data: {
      title: 'Glass, Aluminium & Steel Services in Kenya | Alternative Glasses Limited',
      description: 'Explore Alternative Glasses Limited services, including aluminium windows, office glass partitioning, shower cubicles, curtain walling, glass balustrades and stainless-steel railings.',
      keywords: 'glass and aluminium services Kenya; aluminium fabrication Nairobi; architectural glass solutions Kenya'
    }
  },
  {
    path: 'services/:slug',
    component: ServiceDetailComponent
  },
  {
    path: 'our-process',
    component: ProcessComponent,
    data: {
      title: 'Our Fabrication and Installation Process | Alternative Glasses Limited',
      description: 'See how Alternative Glasses Limited takes glass, aluminium and stainless-steel projects from measurement and design through fabrication and on-site installation.',
      keywords: 'glass fabrication process Kenya; aluminium installation Nairobi; custom fabrication Kenya'
    }
  },
  {
    path: 'contact',
    component: ContactComponent,
    data: {
      title: 'Contact Alternative Glasses Limited | Glass and Aluminium Fabrication Nairobi',
      description: 'Contact Alternative Glasses Limited for custom aluminium, glass and stainless-steel fabrication and installation in Nairobi and across Kenya.',
      keywords: 'glass and aluminium company Nairobi contact; aluminium fabrication Nairobi; glass installation Kenya'
    }
  },
  {
    path: 'faqs',
    component: FaqsComponent,
    data: {
      title: 'Aluminium and Glass Fabrication FAQs | Alternative Glasses Limited',
      description: 'Find answers about Alternative Glasses Limited (AGL) services, measurements, fabrication, installation and project coverage in Nairobi and across Kenya.',
      keywords: 'aluminium and glass fabrication FAQs Kenya; glass installation Nairobi; office partitions Kenya',
      jsonLd: FAQ_JSON_LD
    }
  },
  { path: '**', redirectTo: '' }
];
