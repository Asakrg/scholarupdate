import { Component, inject, signal, computed, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ScholarshipService, Scholarship } from '../../services/scholarship';

@Component({
  selector: 'app-cms-form',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cms-form.html',
  styles: [`
    .wysiwyg-content h3 {
      font-family: ui-sans-serif, system-ui, sans-serif;
      font-size: 1.15rem;
      font-weight: 800;
      color: #f8fafc;
      margin-top: 1.25rem;
      margin-bottom: 0.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding-bottom: 0.25rem;
    }
    .wysiwyg-content li {
      list-style-type: disc;
      margin-left: 1.25rem;
      margin-bottom: 0.25rem;
      font-size: 0.875rem;
      color: #cbd5e1;
    }
    .wysiwyg-content strong {
      font-weight: 700;
      color: #ffffff;
    }
    .wysiwyg-content {
      outline: none;
    }
    .wysiwyg-content:empty::before {
      content: attr(placeholder);
      color: #64748b;
      cursor: text;
    }
  `]
})
export class CmsFormComponent {
  public svc = inject(ScholarshipService);

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  public isEditing = signal<boolean>(false);
  public editingId = signal<string>('');
  public formError = signal<string | null>(null);

  // Uploading and drag-over
  public isUploadingImage = signal<boolean>(false);
  public dragOverActive = signal<boolean>(false);

  // Rich editor
  public editorMode = signal<'wysiwyg' | 'markdown'>('wysiwyg');
  public wysiwygHtml = signal<string>('');

  // Form signals
  public formTitle = signal<string>('');
  public formId = signal<string>('');
  public formCategory = signal<string>('Fully-Funded');
  public formAmount = signal<number>(0);
  public formAmountDisplay = signal<string>('');
  public formDeadline = signal<string>('');
  public formApplyUrl = signal<string>('');
  public formEligibility = signal<string>('');
  public formExcerpt = signal<string>('');
  public formImageUrl = signal<string>('');
  public formTagsRaw = signal<string>('');
  public formStatus = signal<'draft' | 'published'>('published');
  public formDescription = signal<string>('');
  public formMetaTitle = signal<string>('');
  public formMetaDescription = signal<string>('');

  // New taxonomy & feature fields
  public formFeatured = signal<boolean>(false);
  public formCountry = signal<string>('');
  public formField = signal<string>('');
  public formFundingType = signal<string>('');
  public formDemographic = signal<string>('');

  // Dropdown options for new fields
  public countryOptions = ['USA', 'UK', 'Europe', 'Asia', 'Africa', 'Global'];
  public fieldOptions = ['STEM', 'Arts', 'Business', 'Medicine', 'Law', 'Social-Sciences'];
  public fundingTypeOptions = ['Fully-Funded', 'Partial', 'Tuition-Waiver', 'Stipend'];
  public demographicOptions = ['International', 'Women', 'First-Gen', 'BIPOC', 'Veterans', 'Disability'];

  @Input() set scholarship(item: Scholarship | null) {
    this.formError.set(null);
    if (item) {
      this.isEditing.set(true);
      this.editingId.set(item.id);
      this.formTitle.set(item.title);
      this.formId.set(item.id);
      this.formCategory.set(item.category);
      this.formAmount.set(item.amount);
      this.formAmountDisplay.set(item.amountDisplay);
      this.formDeadline.set(item.deadline);
      this.formApplyUrl.set(item.applyUrl);
      this.formEligibility.set(item.eligibility);
      this.formExcerpt.set(item.excerpt);
      this.formImageUrl.set(item.imageUrl);
      this.formTagsRaw.set(item.tags.join(', '));
      this.formStatus.set(item.status);
      this.formDescription.set(item.description);
      this.formMetaTitle.set(item.metaTitle || '');
      this.formMetaDescription.set(item.metaDescription || '');
      this.formFeatured.set(item.featured || false);
      this.formCountry.set(item.country || '');
      this.formField.set(item.field || '');
      this.formFundingType.set(item.fundingType || '');
      this.formDemographic.set(item.demographic || '');
      this.editorMode.set('wysiwyg');
      this.wysiwygHtml.set(this.markdownToHtml(item.description));
    } else {
      this.isEditing.set(false);
      this.editingId.set('');
      this.formTitle.set('');
      this.formId.set('');
      this.formCategory.set('Fully-Funded');
      this.formAmount.set(0);
      this.formAmountDisplay.set('');
      this.formDeadline.set('');
      this.formApplyUrl.set('');
      this.formEligibility.set('');
      this.formExcerpt.set('');
      this.formImageUrl.set('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80');
      this.formTagsRaw.set('');
      this.formStatus.set('published');
      this.formDescription.set('');
      this.formMetaTitle.set('');
      this.formMetaDescription.set('');
      this.formFeatured.set(false);
      this.formCountry.set('');
      this.formField.set('');
      this.formFundingType.set('');
      this.formDemographic.set('');
      this.editorMode.set('wysiwyg');
      this.wysiwygHtml.set('');
    }
  }

  public closeForm(): void {
    this.close.emit();
  }

  public onFileDropped(event: DragEvent): void {
    event.preventDefault();
    this.dragOverActive.set(false);
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.processImageUpload(event.dataTransfer.files[0]);
    }
  }

  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOverActive.set(true);
  }

  public onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragOverActive.set(false);
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processImageUpload(input.files[0]);
    }
  }

  private async processImageUpload(file: File): Promise<void> {
    if (!file.type.startsWith('image/')) {
      this.svc.showToast('error', 'Invalid File Type', 'Please upload a valid image file suffix (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.svc.showToast('error', 'File Too Large', 'Please upload an image file smaller than 5MB.');
      return;
    }
    this.isUploadingImage.set(true);
    try {
      const url = await this.svc.uploadImage(file);
      this.formImageUrl.set(url);
    } catch (err) {
      console.error(err);
      this.svc.showToast('error', 'Upload Error', 'An error occurred during image transition processing.');
    } finally {
      this.isUploadingImage.set(false);
    }
  }

  public generateSeoMetadata(): void {
    const title = this.formTitle().trim();
    const excerpt = this.formExcerpt().trim();
    const cat = this.formCategory().trim();
    const elig = this.formEligibility().trim();

    if (!title) {
      this.svc.showToast('warning', 'Missing Scholarship Title', 'Please write a scholarship title first to generate optimized metadata.');
      return;
    }

    let metaTitle = `${title} | ${cat} Scholarship`;
    if (metaTitle.length > 60) metaTitle = metaTitle.substring(0, 57) + '...';
    this.formMetaTitle.set(metaTitle);

    let metaDesc = excerpt || `Apply for the prestigious ${title} (${cat} category). ${elig ? 'Eligibility requirements: ' + elig + '.' : ''} Find full instruction roadmaps here.`;
    if (metaDesc.length > 160) metaDesc = metaDesc.substring(0, 157) + '...';
    this.formMetaDescription.set(metaDesc);

    this.svc.showToast('success', 'SEO Performance Synced', 'Successfully generated search-optimized metadata based on active document attributes.');
  }

  public async onSaveScholarship(): Promise<void> {
    this.formError.set(null);
    const id = this.formId().trim();
    const title = this.formTitle().trim();
    const cat = this.formCategory().trim();
    const amt = this.formAmount();
    const amtDisp = this.formAmountDisplay().trim();
    const deadline = this.formDeadline().trim();
    const applyUrl = this.formApplyUrl().trim();
    const eligibility = this.formEligibility().trim();
    const excerpt = this.formExcerpt().trim();
    const desc = this.formDescription().trim();
    const img = this.formImageUrl().trim();
    const parsedTags = this.formTagsRaw().split(',').map(t => t.trim()).filter(Boolean);

    if (cat && !this.svc.categories().includes(cat)) this.svc.addCategory(cat);
    for (const tag of parsedTags) this.svc.addTag(tag);

    if (!id || !title || !amtDisp || !deadline || !applyUrl || !eligibility || !excerpt || !desc) {
      this.formError.set("Missing required fields. Provide complete scholarship attributes.");
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
      this.formError.set("Invalid custom Unique ID slug pattern: must match '^[a-zA-Z0-9_-]+$'");
      return;
    }

    if (id.length > 128) {
      this.formError.set("Unique ID slug length exceeded. Max 128 characters permitted.");
      return;
    }

    let finalMetaTitle = this.formMetaTitle().trim();
    let finalMetaDesc = this.formMetaDescription().trim();

    if (!finalMetaTitle) {
      finalMetaTitle = `${title} | ${cat} Scholarship`;
      if (finalMetaTitle.length > 60) finalMetaTitle = finalMetaTitle.substring(0, 57) + '...';
    }

    if (!finalMetaDesc) {
      finalMetaDesc = excerpt || `Apply for the prestigious ${title} (${cat} category). Find full instruction roadmaps, eligibility checks, and official application portals.`;
      if (finalMetaDesc.length > 160) finalMetaDesc = finalMetaDesc.substring(0, 157) + '...';
    }

    try {
      const payload: Scholarship = {
        id, title, excerpt, description: desc, category: cat, amount: amt, amountDisplay: amtDisp,
        deadline, applyUrl, eligibility, status: this.formStatus(), imageUrl: img, tags: parsedTags,
        views: this.isEditing() ? (this.svc.getScholarshipById(this.editingId())?.views || 0) : 0,
        metaTitle: finalMetaTitle || undefined, metaDescription: finalMetaDesc || undefined,
        featured: this.formFeatured() || undefined,
        country: this.formCountry().trim() || undefined,
        field: this.formField().trim() || undefined,
        fundingType: this.formFundingType().trim() || undefined,
        demographic: this.formDemographic().trim() || undefined
      };

      if (this.isEditing()) {
        await this.svc.updateScholarship(this.editingId(), payload);
      } else {
        if (this.svc.getScholarshipById(payload.id)) {
          this.formError.set("ID duplicate collision: an opportunity with this ID slug already exists.");
          return;
        }
        await this.svc.addScholarship(payload);
      }
      this.save.emit();
    } catch (err: unknown) {
      console.error(err);
      this.formError.set(err instanceof Error ? err.message : String(err));
    }
  }

  // WYSIWYG & Visual Markdown Interconversion Helper Engines
  public markdownToHtml(md: string): string {
    if (!md) return '';
    let html = md.replace(/\r\n/g, '\n');
    html = html.replace(/^##\s*(.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/^\-\s*(.*?)$/gm, '<li>$1</li>');
    html = html.split('\n').map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '<br>';
      if (trimmed.startsWith('<h3>') || trimmed.startsWith('<li>') || trimmed.startsWith('<strong>')) return line;
      return `<div>${line}</div>`;
    }).join('');
    return html.replace(/(<br>){3,}/g, '<br><br>');
  }

  public htmlToMarkdown(html: string): string {
    if (!html) return '';
    let md = html.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '## $1\n');
    md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n');
    md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '## $1\n');
    md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '## $1\n');
    md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
    md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    md = md.replace(/<br\s*\/?>/gi, '\n');
    md = md.replace(/<div[^>]*>(.*?)<\/div>/gi, '$1\n');
    md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
    md = md.replace(/<\/?[^>]+(>|$)/g, '');

    const lines = md.split('\n').map(l => l.trim());
    const cleaned: string[] = [];
    let consecutives = 0;
    for (const l of lines) {
      if (l === '') {
        consecutives++;
        if (consecutives <= 1) cleaned.push('');
      } else {
        consecutives = 0;
        cleaned.push(l);
      }
    }
    return cleaned.join('\n').trim();
  }

  public onWysiwygInput(html: string): void {
    this.wysiwygHtml.set(html);
    this.formDescription.set(this.htmlToMarkdown(html));
  }

  public onMarkdownInput(md: string): void {
    this.formDescription.set(md);
    this.wysiwygHtml.set(this.markdownToHtml(md));
  }

  public execEditorCommand(command: string, arg: string = ''): void {
    if (typeof document === 'undefined') return;
    document.execCommand(command, false, arg);
    const panel = document.querySelector('.wysiwyg-content');
    if (panel) this.onWysiwygInput(panel.innerHTML);
  }

  public setEditorMode(mode: 'wysiwyg' | 'markdown'): void {
    if (mode === 'wysiwyg') {
      this.wysiwygHtml.set(this.markdownToHtml(this.formDescription()));
    } else {
      const panel = document.querySelector('.wysiwyg-content');
      if (panel) this.formDescription.set(this.htmlToMarkdown(panel.innerHTML));
    }
    this.editorMode.set(mode);
  }

  public getWordCount(): number {
    const text = this.formDescription().trim();
    if (!text) return 0;
    return text.split(/\s+/).filter(Boolean).length;
  }

  public getParsedFormError(): {
    title: string; message: string; isFirebase: boolean; operation?: string; path?: string; authStatus?: string;
  } | null {
    const errorString = this.formError();
    if (!errorString) return null;
    try {
      if (errorString.startsWith('{') && errorString.endsWith('}')) {
        const info = JSON.parse(errorString);
        if (info && 'operationType' in info) {
          let friendlyTitle = 'Database Access Denied';
          let friendlyMsg = 'A security checkpoint rule has denied your write operation. Please check your credentials.';
          const rawError = (info.error || '').toLowerCase();
          if (rawError.includes('permission-denied') || rawError.includes('insufficient permissions')) {
            friendlyTitle = 'Firestore Transaction Revoked';
            if (!info.authInfo?.userId) {
              friendlyMsg = 'You are currently in local guest administrator mode. To write permanently to Firebase, please complete the Google sign in flow first.';
            } else if (info.authInfo?.emailVerified === false) {
              friendlyMsg = `Administrator email verification is incomplete. Your authenticated user '${info.authInfo.email}' needs email verification to bypass write constraints.`;
            } else {
              friendlyMsg = `The Zero-Trust firewall rules blocked your '${info.operationType}' write request on document path '${info.path}'. Your authenticated admin profile does not possess write privileges for this segment.`;
            }
          } else if (rawError.includes('offline') || rawError.includes('client is offline')) {
            friendlyTitle = 'Connection Interrupted';
            friendlyMsg = 'Unable to commit changes. The local Firebase instance reports being offline. Your edits will remain saved locally.';
          } else if (rawError.includes('quota exceeded')) {
            friendlyTitle = 'Firestore Quota Expired';
            friendlyMsg = 'The database instance has reached its daily free-tier read/write quota. Limits will reset dynamically after 24 hours.';
          } else {
            friendlyMsg = info.error;
          }
          const authSummary = info.authInfo?.userId ? `Signed In: ${info.authInfo.email || 'Admin User'}` : 'Unauthenticated / Local Guest';
          return { title: friendlyTitle, message: friendlyMsg, isFirebase: true, operation: info.operationType, path: info.path, authStatus: authSummary };
        }
      }
    } catch {
      // Fallback
    }
    return { title: 'Validation Operation Alert', message: errorString, isFirebase: false };
  }
}
