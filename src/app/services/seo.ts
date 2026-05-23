import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private document = inject(DOCUMENT);

  /**
   * Set page title & social metadata tags professionally
   */
  public setMetaTags(config: {
    title: string;
    description: string;
    keywords?: string;
    ogImage?: string;
    ogUrl?: string;
    type?: string;
  }): void {
    // 1. Title configuration
    this.titleService.setTitle(config.title);

    // 2. Base meta tags
    this.metaService.updateTag({ name: 'description', content: config.description });
    
    if (config.keywords) {
      this.metaService.updateTag({ name: 'keywords', content: config.keywords });
    } else {
      this.metaService.updateTag({ name: 'keywords', content: 'scholarships, academic funding, fully funded, postgrad, phd fellowships' });
    }

    // Open Graph
    this.metaService.updateTag({ property: 'og:title', content: config.title });
    this.metaService.updateTag({ property: 'og:description', content: config.description });
    if (config.ogImage) {
      this.metaService.updateTag({ property: 'og:image', content: config.ogImage });
    }
    if (config.ogUrl) {
      this.metaService.updateTag({ property: 'og:url', content: config.ogUrl });
    }
    this.metaService.updateTag({ property: 'og:type', content: config.type || 'website' });

    // Twitter card setup (premium search visuals)
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: config.title });
    this.metaService.updateTag({ name: 'twitter:description', content: config.description });
    if (config.ogImage) {
      this.metaService.updateTag({ name: 'twitter:image', content: config.ogImage });
    }
  }

  /**
   * Safely inject or replace structured data (Schema.org JSON-LD script block) on current page
   */
  public setSchema(schemaData: any): void {
    // Purge old schemas to keep browser indexing pristine
    const existingScript = this.document.getElementById('seo-jsonld');
    if (existingScript) {
      existingScript.remove();
    }

    if (!schemaData) return;

    try {
      const script = this.document.createElement('script');
      script.setAttribute('id', 'seo-jsonld');
      script.setAttribute('type', 'application/ld+json');
      script.textContent = JSON.stringify(schemaData);
      this.document.head.appendChild(script);
    } catch (err) {
      console.warn('Unable to append structural crawl payload inside environment:', err);
    }
  }
}
