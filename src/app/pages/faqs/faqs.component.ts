import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Faq {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './faqs.component.html'
})
export class FaqsComponent {
  readonly faqs: Faq[] = [
    {
      question: 'What services does Alternative Glasses Limited provide?',
      answer: 'AGL provides aluminium windows and doors, office glass partitioning, shower cubicles, curtain walling, glass balustrades, stainless-steel railings and custom glass fabrication.'
    },
    {
      question: 'Does AGL serve clients outside Nairobi?',
      answer: 'Yes. AGL is based in Nairobi and works with homeowners, contractors, offices and commercial clients across Kenya, subject to project requirements and site logistics.'
    },
    {
      question: 'Can AGL fabricate products to custom measurements?',
      answer: 'Yes. Every project begins with measurement and specification. Products are fabricated to suit the exact opening, design and intended use.'
    },
    {
      question: 'Does AGL handle installation?',
      answer: 'Yes. AGL coordinates delivery and on-site fitting through its installation team.'
    },
    {
      question: 'What is the difference between frameless and aluminium-framed glass partitioning?',
      answer: 'Frameless partitioning uses minimal visible framing for a cleaner, more open appearance. Aluminium-framed partitioning uses aluminium profiles to create defined panels and can suit layouts that require additional structure or detailing.'
    },
    {
      question: 'How do I request a quotation?',
      answer: 'Call 0731 098 888 / 0793 079 466 or email alternativeglasslimited@gmail.com with your project location, service required and any available measurements or drawings.'
    },
    {
      question: 'Can AGL work with contractors and architects?',
      answer: 'Yes. AGL works directly with homeowners as well as contractors, architects, designers, offices and property developers.'
    }
  ];
}
