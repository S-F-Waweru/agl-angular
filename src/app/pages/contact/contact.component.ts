import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { LocationMapComponent } from '../../components/location-map/location-map.component';
import { readQuoteForm, submitQuoteRequest } from '../../data/quote-request';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [LocationMapComponent],
  templateUrl: './contact.component.html'
})
export class ContactComponent implements AfterViewInit {
  constructor(private readonly host: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const form = this.host.nativeElement.querySelector<HTMLFormElement>('#contactPageForm');
    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      submitQuoteRequest(readQuoteForm(form, 'cf-'));
    });
  }
}
