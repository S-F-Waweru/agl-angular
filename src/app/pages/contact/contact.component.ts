import { AfterViewInit, Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html'
})
export class ContactComponent implements AfterViewInit {
  constructor(private readonly host: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const form = this.host.nativeElement.querySelector<HTMLFormElement>('#contactPageForm');
    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      alert('This form is a working layout — connect it to email, WhatsApp, or a form service (e.g. Formspree) to receive submissions.');
    });
  }
}
