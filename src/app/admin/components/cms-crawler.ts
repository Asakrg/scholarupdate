import { Component, inject, signal, computed, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ScholarshipService, Scholarship } from '../../services/scholarship';

@Component({
  selector: 'app-cms-crawler',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cms-crawler.html'
})
export class CmsCrawlerComponent {
  public svc = inject(ScholarshipService);

  @Output() reviewDraft = new EventEmitter<Scholarship>();

  // Continent & Opportunity Type Selection Signals
  public selectedContinent = signal<string>('Global');
  public selectedType = signal<string>('Fully-Funded');

  // Crawler log terminal signal
  public terminalLogs = signal<{ time: string; type: 'firecrawl' | 'computer-use' | 'system'; text: string }[]>([]);

  public aiLoading = signal<boolean>(false);
  public aiResults = signal<Scholarship[] | null>(null);
  public aiCitations = signal<{ title: string; uri: string }[] | null>(null);
  public aiSuccessMessage = signal<string | null>(null);
  public aiErrorMessage = signal<string | null>(null);

  // Firecrawl automated search and structured extraction flow
  public async onAiSearch(): Promise<void> {
    const continentVal = this.selectedContinent();
    const typeVal = this.selectedType();

    this.aiLoading.set(true);
    this.aiErrorMessage.set(null);
    this.aiSuccessMessage.set(null);
    this.aiResults.set(null);
    this.aiCitations.set(null);
    
    // Set initial loading log
    const timeStr = new Date().toLocaleTimeString();
    this.terminalLogs.set([
      { time: timeStr, type: 'system', text: `Initiating Firecrawl scraping request for Continent: "${continentVal}", Type: "${typeVal}"...` },
      { time: timeStr, type: 'firecrawl', text: `Connecting to crawling agent API endpoint at /api/firecrawl-computer-use` }
    ]);

    try {
      const res = await fetch('/api/firecrawl-computer-use', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          continent: continentVal,
          opportunityType: typeVal,
          categories: this.svc.categories(),
          tags: this.svc.tags()
        })
      });

      let text = '';
      try {
        text = await res.text();
      } catch (textErr) {
        throw new Error(`Failed to read response body. Status: ${res.status}`);
      }

      if (!res.ok) {
        let errMsg = `HTTP error! Status: ${res.status}`;
        try {
          const errData = JSON.parse(text);
          if (errData && errData.error) {
            errMsg = errData.error;
          }
        } catch {
          if (text && text.trim().startsWith('<!DOCTYPE')) {
            errMsg = `Server returned HTML instead of JSON. Ensure the Node backend (server.js on port 3000) is running and active. Status: ${res.status}`;
          } else if (text) {
            errMsg = text.substring(0, 150);
          }
        }
        throw new Error(errMsg);
      }

      let data: any;
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        if (text && text.trim().startsWith('<!DOCTYPE')) {
          throw new Error(`Received HTML response instead of JSON. This typically means the Node backend API server (server.js) is not running on port 3000. Please start the server (e.g. using 'npm start').`);
        }
        throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
      }
      
      // Update logs from the server response
      if (data.logs && Array.isArray(data.logs)) {
        this.terminalLogs.set(data.logs);
      } else {
        this.terminalLogs.update(logs => [
          ...logs,
          { time: new Date().toLocaleTimeString(), type: 'system', text: `Received successful response from server.` }
        ]);
      }

      this.aiResults.set(data.opportunities || []);
      this.aiCitations.set(data.citations || []);
      
      if (!data.opportunities || data.opportunities.length === 0) {
        this.aiErrorMessage.set("No academic opportunities returned for this crawler search criteria.");
        this.terminalLogs.update(logs => [
          ...logs,
          { time: new Date().toLocaleTimeString(), type: 'system', text: `Extraction complete. Zero matching opportunities mapped.` }
        ]);
      } else {
        try {
          // Automatically save to database as drafts
          await this.svc.addDraftScholarships(data.opportunities);
          this.aiSuccessMessage.set(`Successfully parsed, extracted, and saved ${data.opportunities.length} opportunities as Drafts in the database!`);
          this.terminalLogs.update(logs => [
            ...logs,
            { time: new Date().toLocaleTimeString(), type: 'system', text: `Automation complete! Saved ${data.opportunities.length} drafts successfully in database.` }
          ]);
        } catch (saveErr) {
          console.error('Failed to auto-save drafts:', saveErr);
          this.aiSuccessMessage.set(`Extracted ${data.opportunities.length} opportunities, but auto-saving them failed.`);
          this.terminalLogs.update(logs => [
            ...logs,
            { time: new Date().toLocaleTimeString(), type: 'system', text: `Auto-save database write failed.` }
          ]);
        }
      }

    } catch (err: unknown) {
      console.error('Firecrawl search/scrape flow failed:', err);
      const msg = err instanceof Error ? err.message : String(err);
      this.aiErrorMessage.set(`Automation Failure: ${msg}`);
      this.terminalLogs.update(logs => [
        ...logs,
        { time: new Date().toLocaleTimeString(), type: 'system', text: `Fatal automation failure: ${msg}` }
      ]);
    } finally {
      this.aiLoading.set(false);
    }
  }

  public setParamsAndSearch(continent: string, type: string): void {
    this.selectedContinent.set(continent);
    this.selectedType.set(type);
    this.onAiSearch();
  }

  public async publishAiOpportunity(item: Scholarship): Promise<void> {
    this.aiErrorMessage.set(null);
    this.aiSuccessMessage.set(null);

    // Ensure the ID is uniquely sluggified in the database
    let finalId = item.id;
    let count = 1;
    while (this.svc.getScholarshipById(finalId)) {
      finalId = `${item.id}-${count}`;
      count++;
    }

    const payload: Scholarship = {
      ...item,
      id: finalId,
      status: 'published',
      views: 0
    };

    try {
      await this.svc.addScholarship(payload);
      
      // Update result cards to filter out the published items smoothly
      if (this.aiResults()) {
        this.aiResults.update(current => current ? current.filter(o => o.id !== item.id) : null);
      }

      this.aiSuccessMessage.set(`Instantly published "${payload.title}" directly to the indexes!`);
      setTimeout(() => this.aiSuccessMessage.set(null), 5000);
    } catch (err: unknown) {
      console.error('Failed to post AI opportunity:', err);
      const msg = err instanceof Error ? err.message : String(err);
      this.aiErrorMessage.set(`Publish Failure: ${msg}`);
    }
  }

  public loadAiOpportunityIntoForm(item: Scholarship): void {
    this.reviewDraft.emit(item);
  }
}
