import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ScholarshipService, Subscriber, WhitelistedUser } from '../../services/scholarship';

@Component({
  selector: 'app-cms-users-subs',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Administrative Access & Role Strategy Configuration (Dark Glassmorphic) -->
    <section id="user-access-whitelist-canvas" class="border border-white/10 bg-slate-950/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl mt-8 text-slate-200">
      <div class="flex items-center justify-between border-b border-white/10 pb-3 mb-5">
        <div class="flex items-center gap-2">
          <mat-icon class="!w-5 !h-5 !text-[20px] text-indigo-400">verified_user</mat-icon>
          <h2 class="text-base font-display font-bold text-slate-100">Administrative Security & Whitelist Directory</h2>
        </div>
        <span class="px-2 py-0.5 text-[8.5px] font-mono rounded bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 font-bold uppercase tracking-wider">Super-Admin Panel</span>
      </div>

      @if (svc.isSuperAdmin()) {
        <p class="text-xs text-slate-400 font-sans leading-relaxed mb-5">
          Welcome Super-Admin. Manage, edit, and control whitelisted administrators. Set credentials, reset security passwords, toggle active status blocks, and adjust operational clearance scopes.
        </p>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Left 1 part: Add User Whitelist Form -->
          <div class="lg:col-span-1 space-y-3.5 border-r border-white/5 pr-0 lg:pr-6">
            <span class="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Grant Access Clearance</span>
            
            <div>
              <label class="block text-[10px] font-mono font-semibold text-slate-500 mb-1">EMAIL ADDRESS</label>
              <input type="email" #userEmailInput [value]="newUserEmail()" (input)="newUserEmail.set(userEmailInput.value)"
                     placeholder="editor@scholarshiphub.com"
                     class="w-full px-3 py-2 text-xs rounded-lg border border-white/10 bg-slate-900/60 text-slate-200 placeholder-slate-500 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
            </div>

            <div>
              <label class="block text-[10px] font-mono font-semibold text-slate-500 mb-1">ASSIGNED SYSTEM ROLE</label>
              <select #userRoleSelect [value]="newUserRole()" (change)="newUserRole.set(userRoleSelect.value === 'super-admin' ? 'super-admin' : 'content-editor')"
                      class="w-full px-3 py-2 text-xs rounded-lg border border-white/10 bg-slate-900/60 text-slate-200 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500/50 cursor-pointer">
                <option value="content-editor">Content Editor (Publish/Edit only)</option>
                <option value="super-admin">Super-Admin (Full clearances)</option>
              </select>
            </div>

            <div>
              <label class="block text-[10px] font-mono font-semibold text-slate-500 mb-1">SECURITY PASSWORD (OPTIONAL)</label>
              <input type="password" #userPasswordInput [value]="newUserPassword()" (input)="newUserPassword.set(userPasswordInput.value)"
                     placeholder="DefaultPassword123!"
                     class="w-full px-3 py-2 text-xs rounded-lg border border-white/10 bg-slate-900/60 text-slate-200 placeholder-slate-500 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
            </div>

            <button (click)="onAddUser()"
                    class="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 border border-white/10 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-500/10 transition-colors cursor-pointer select-none">
              <mat-icon class="!w-4 !h-4 !text-[14px]">person_add</mat-icon>
              <span>Whitelist User</span>
            </button>

            @if (userFormError()) {
              <div class="p-2.5 bg-rose-950/30 text-rose-350 text-[11px] rounded-lg border border-rose-500/25 font-sans mt-2 shadow-inner">
                {{ userFormError() }}
              </div>
            }

            @if (userFormSuccess()) {
              <div class="p-2.5 bg-emerald-950/30 text-emerald-300 text-[11px] rounded-lg border border-emerald-500/25 font-sans mt-2 shadow-inner">
                {{ userFormSuccess() }}
              </div>
            }
          </div>

          <!-- Right 2 parts: Active Users Whitelist Catalog -->
          <div class="lg:col-span-2 space-y-3">
            <span class="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Active Clearance Staff Directory ({{ svc.authorizedUsers().length }})</span>
            
            <div class="divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden bg-slate-900/30">
              @for (user of svc.authorizedUsers(); track user.email) {
                <div class="p-4 bg-slate-900/20 hover:bg-slate-900/40 transition-all">
                  @if (editingUserEmail() === user.email) {
                    <!-- Inline editing form -->
                    <div class="space-y-3 font-sans text-xs">
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label class="block text-[9px] font-mono font-semibold text-slate-500 mb-1">EMAIL ADDRESS</label>
                          <input type="email" #editEmailInput [value]="editEmailValue()" (input)="editEmailValue.set(editEmailInput.value)"
                                 class="w-full px-3 py-1.5 text-xs rounded border border-white/10 bg-slate-950 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
                        </div>
                        <div>
                          <label class="block text-[9px] font-mono font-semibold text-slate-500 mb-1">CLEARANCE LEVEL</label>
                          <select #editRoleSelect [value]="editRoleValue()" (change)="editRoleValue.set(editRoleSelect.value === 'super-admin' ? 'super-admin' : 'content-editor')"
                                  class="w-full px-3 py-1.5 text-xs rounded border border-white/10 bg-slate-950 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 cursor-pointer">
                            <option value="content-editor">Content Editor (No Whitelist Controls)</option>
                            <option value="super-admin">Super-Admin (Full clearances)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label class="block text-[9px] font-mono font-semibold text-slate-500 mb-1">UPDATE PASSWORD</label>
                        <input type="text" #editPassInput [value]="editPassValue()" (input)="editPassValue.set(editPassInput.value)"
                               placeholder="Set custom password"
                               class="w-full px-3 py-1.5 text-xs rounded border border-white/10 bg-slate-950 text-slate-200 placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
                      </div>

                      <div class="flex items-center justify-between gap-3 pt-2">
                        <div class="flex items-center gap-2">
                          <button (click)="onSaveEdit(user.email)"
                                  class="px-3 py-1.5 bg-indigo-650 hover:bg-indigo-550 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors shadow">
                            Save Changes
                          </button>
                          <button (click)="onCancelEdit()"
                                  class="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-350 rounded-lg text-[10px] cursor-pointer transition-colors border border-white/10">
                            Cancel
                          </button>
                        </div>
                        <button (click)="onResetPassword(user.email)"
                                class="px-2.5 py-1.5 border border-amber-500/30 bg-amber-950/20 hover:bg-amber-900/30 text-amber-350 rounded-lg text-[10px] font-semibold cursor-pointer transition-colors flex items-center gap-1">
                          <mat-icon class="!w-3 !h-3 !text-[12px]">lock_reset</mat-icon>
                          <span>Reset Password</span>
                        </button>
                      </div>
                    </div>
                  } @else {
                    <!-- View mode row -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div class="flex items-center gap-2 flex-wrap">
                          <span class="font-sans font-bold text-slate-200">{{ user.email }}</span>
                          
                          <!-- Role Badge -->
                          @if (user.role === 'super-admin') {
                            <span class="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-slate-950 text-slate-200 uppercase border border-white/10">SUPER-ADMIN</span>
                          } @else {
                            <span class="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-indigo-950/40 text-indigo-300 uppercase border border-indigo-900/30">CONTENT EDITOR</span>
                          }

                          <!-- Blocked Status Badge -->
                          @if (user.blocked) {
                            <span class="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-rose-950/60 text-rose-350 uppercase border border-rose-500/30">BLOCKED</span>
                          } @else {
                            <span class="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-emerald-950/40 text-emerald-300 uppercase border border-emerald-900/30">ACTIVE</span>
                          }

                          @if (user.email === 'aliyusahmad01@gmail.com') {
                            <span class="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider">(Creator)</span>
                          }
                        </div>

                        <!-- Password display helper -->
                        <div class="text-[10px] font-mono text-slate-450 mt-1 flex items-center gap-2 flex-wrap">
                          <span>Password:</span>
                          <code class="text-slate-350">{{ user.password ? '••••••••' : '(Not configured)' }}</code>
                          @if (user.password) {
                            <button (click)="toggleShowPassword(user.email)" class="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer border-0 bg-transparent py-0 px-1">
                              {{ showPasswordEmails().includes(user.email) ? 'Hide' : 'Reveal' }}
                            </button>
                            @if (showPasswordEmails().includes(user.email)) {
                              <code class="text-indigo-300 font-bold px-1.5 py-0.5 bg-slate-950 rounded border border-white/5">{{ user.password }}</code>
                            }
                          }
                        </div>
                      </div>

                      <div class="flex items-center gap-2 self-end sm:self-center">
                        <!-- Block/Unblock toggle button -->
                        <button (click)="onToggleBlock(user)" [disabled]="user.email === 'aliyusahmad01@gmail.com'"
                                [class]="'inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed text-[10px] font-semibold bg-white/5 border-white/10 ' + 
                                         (user.blocked 
                                           ? 'text-emerald-400 hover:bg-emerald-950/40' 
                                           : 'text-rose-400 hover:bg-rose-950/40')"
                                [title]="user.blocked ? 'Unblock user' : 'Block user'">
                          <mat-icon class="!w-3.5 !h-3.5 !text-[13px]">
                            {{ user.blocked ? 'lock_open' : 'block' }}
                          </mat-icon>
                          <span>{{ user.blocked ? 'Unblock' : 'Block' }}</span>
                        </button>
                        <!-- Edit Button -->
                        <button (click)="onStartEdit(user)"
                                class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer text-[10px] font-semibold">
                          <mat-icon class="!w-3.5 !h-3.5 !text-[13px]">edit</mat-icon>
                          <span>Edit</span>
                        </button>

                        <!-- Direct Reset Password Button -->
                        <button (click)="onDirectResetPassword(user.email)"
                                class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-amber-950/40 text-slate-300 hover:text-amber-400 transition-all cursor-pointer text-[10px] font-semibold"
                                title="Instantly reset and reveal user password">
                          <mat-icon class="!w-3.5 !h-3.5 !text-[13px]">lock_reset</mat-icon>
                          <span>Reset</span>
                        </button>

                        <!-- Revoke Button -->
                        <button (click)="onRevokeUser(user.email)" [disabled]="user.email === 'aliyusahmad01@gmail.com'"
                                class="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-white/5 bg-slate-950/20 text-slate-500 hover:text-rose-455 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer focus:outline-none transition-colors"
                                title="Revoke clearance mapping">
                          <mat-icon class="!w-4 !h-4 !text-[16px]">person_remove</mat-icon>
                        </button>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          </div>

        </div>
      } @else {
        <!-- Non-super-admins: content-editor locked panel -->
        <div class="text-center py-8 px-4 border border-indigo-500/20 bg-indigo-950/20 rounded-2xl max-w-xl mx-auto space-y-3 font-sans">
          <mat-icon class="!w-10 !h-10 !text-[44px] text-indigo-400 animate-pulse">lock</mat-icon>
          <h3 class="text-xs font-mono font-bold text-indigo-300 uppercase tracking-widest">Locked Security Dashboard</h3>
          <p class="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            The User access control matrices and direct system directories are restricted exclusively to Super-Admins. Your Clearance Rank is <strong class="text-slate-200 uppercase">[Content Editor]</strong>.
          </p>
          <span class="px-2.5 py-0.5 text-[8.5px] font-mono rounded bg-indigo-950 border border-indigo-850 text-indigo-300 font-bold inline-block">SECURITY PROTOCOL INSTALLED</span>
        </div>
      }

      <!-- Newsletter waitlist list segment -->
      <div class="mt-8 border-t border-white/10 pt-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div class="flex items-center gap-2">
            <mat-icon class="!w-5 !h-5 !text-[20px] text-indigo-400">mail</mat-icon>
            <h3 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Priority Alert Waitlist Subscribers</h3>
          </div>
          <!-- Waitlist search bar -->
          <div class="relative w-full sm:w-64 flex items-center">
            <span class="absolute left-3 text-slate-500">
              <mat-icon class="!w-4 !h-4 !text-[16px]">search</mat-icon>
            </span>
            <input type="text" [value]="subQuery()" (input)="subQuery.set($any($event.target).value)"
                   placeholder="Search subscriber emails..."
                   class="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-white/10 bg-slate-900/60 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 font-sans" />
          </div>
        </div>

        @if (filteredSubs().length === 0) {
          <div class="py-8 text-center text-slate-500 border border-dashed border-white/10 bg-slate-950/20 rounded-xl">
            <p class="text-xs">No matching subscribers in the Priority waitlist.</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (sub of filteredSubs(); track sub.email) {
              <div class="p-3 border border-white/5 bg-slate-900/40 hover:bg-slate-900/60 rounded-xl flex items-center justify-between gap-3 text-xs hover:border-white/15 transition-all shadow-lg">
                <div class="min-w-0">
                  <span class="font-sans font-bold text-slate-200 block truncate" [title]="sub.email">{{ sub.email }}</span>
                  <span class="text-[9px] font-mono text-slate-500 block mt-0.5">Joined: {{ sub.subscribedAt | date:'medium' }}</span>
                </div>
                <button (click)="onRemoveSubscriber(sub.email)"
                        class="text-slate-500 hover:text-rose-450 cursor-pointer focus:outline-none transition-colors border-0 bg-transparent p-1"
                        title="Remove subscriber">
                  <mat-icon class="!w-4 !h-4 !text-[16px]">delete</mat-icon>
                </button>
              </div>
            }
          </div>
        }
      </div>
    </section>
  `
})
export class CmsUsersSubsComponent {
  public svc = inject(ScholarshipService);

  // Whitelist UI signals
  public newUserEmail = signal<string>('');
  public newUserRole = signal<'super-admin' | 'content-editor'>('content-editor');
  public newUserPassword = signal<string>('');
  public userFormError = signal<string | null>(null);
  public userFormSuccess = signal<string | null>(null);

  // Inline Editing signals
  public editingUserEmail = signal<string | null>(null);
  public editEmailValue = signal<string>('');
  public editRoleValue = signal<'super-admin' | 'content-editor'>('content-editor');
  public editPassValue = signal<string>('');
  public showPasswordEmails = signal<string[]>([]);

  // Subscriber UI signals
  public subQuery = signal<string>('');

  public filteredSubs = computed(() => {
    const query = this.subQuery().trim().toLowerCase();
    const subs = this.svc.newsletterSubscriptions();
    if (!query) return subs;
    return subs.filter(s => s.email.toLowerCase().includes(query));
  });

  public onAddUser(): void {
    this.userFormError.set(null);
    this.userFormSuccess.set(null);
    const email = this.newUserEmail().trim();
    const role = this.newUserRole();
    const password = this.newUserPassword().trim();
    if (!email) {
      this.userFormError.set("Provide a valid email address.");
      return;
    }
    if (!email.includes('@')) {
      this.userFormError.set("Please provide a well-formed email.");
      return;
    }
    const success = this.svc.addAuthorizedUser(email, role, password || undefined);
    if (!success) {
      this.userFormError.set(`User "${email}" is already whitelisted.`);
      return;
    }
    this.newUserEmail.set('');
    this.newUserPassword.set('');
    this.userFormSuccess.set(`Successfully added ${email} as a ${role}!`);
    setTimeout(() => this.userFormSuccess.set(null), 4000);
  }

  public onStartEdit(user: WhitelistedUser): void {
    this.editingUserEmail.set(user.email);
    this.editEmailValue.set(user.email);
    this.editRoleValue.set(user.role);
    this.editPassValue.set(user.password || '');
  }

  public onCancelEdit(): void {
    this.editingUserEmail.set(null);
  }

  public onSaveEdit(originalEmail: string): void {
    const freshEmail = this.editEmailValue().trim().toLowerCase();
    const role = this.editRoleValue();
    const password = this.editPassValue().trim();

    if (!freshEmail || !freshEmail.includes('@')) {
      this.svc.showToast('error', 'Validation Failed', 'Please input a valid email address.');
      return;
    }

    // Safety checks for self lockout/immutability of master admin
    if (originalEmail === 'aliyusahmad01@gmail.com') {
      if (freshEmail !== 'aliyusahmad01@gmail.com') {
        this.svc.showToast('warning', 'Security Safeguard', 'You cannot alter the master developer email address.');
        return;
      }
      if (role !== 'super-admin') {
        this.svc.showToast('warning', 'Security Safeguard', 'You cannot demote the master developer role.');
        return;
      }
    }

    // Duplication verification
    const emailExists = this.svc.authorizedUsers().some(u => 
      u.email.toLowerCase() === freshEmail && u.email.toLowerCase() !== originalEmail.toLowerCase()
    );
    if (emailExists) {
      this.svc.showToast('error', 'Duplicate Email', 'A whitelisted user with this email address already exists.');
      return;
    }

    this.svc.updateAuthorizedUser(originalEmail, { 
      email: freshEmail, 
      role, 
      password: password || undefined 
    });

    this.editingUserEmail.set(null);
    this.svc.showToast('success', 'User Configured', `Updated clearance matrices for "${freshEmail}" successfully.`);
  }

  public onResetPassword(email: string): void {
    const tempPassword = 'ResetPassword123!';
    this.editPassValue.set(tempPassword);
    this.svc.showToast('info', 'Credentials Reset', `Password reset value loaded into editor. Click "Save Changes" to save.`);
  }

  public onDirectResetPassword(email: string): void {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$';
    let newPassword = '';
    for (let i = 0; i < 10; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Append a number and symbol to satisfy potential password requirements
    newPassword += Math.floor(Math.random() * 10) + '!';

    this.svc.updateAuthorizedUser(email, { password: newPassword });
    
    // Automatically reveal the password for this email
    if (!this.showPasswordEmails().includes(email)) {
      this.showPasswordEmails.update(list => [...list, email]);
    }

    this.svc.showToast('success', 'Password Reset Successfully', `New password for "${email}" generated: "${newPassword}". Copy it before leaving.`);
  }

  public onToggleBlock(user: WhitelistedUser): void {
    if (user.email === 'aliyusahmad01@gmail.com') {
      this.svc.showToast('warning', 'Security Block Denied', 'Master admin profile cannot be blocked.');
      return;
    }
    const nextBlocked = !user.blocked;
    this.svc.updateAuthorizedUser(user.email, { blocked: nextBlocked });
    this.svc.showToast(nextBlocked ? 'warning' : 'success', 
      nextBlocked ? 'Personnel Blocked' : 'Personnel Restored', 
      `Access clearance status for "${user.email}" updated successfully.`
    );
  }

  public toggleShowPassword(email: string): void {
    this.showPasswordEmails.update(list => 
      list.includes(email) ? list.filter(e => e !== email) : [...list, email]
    );
  }

  public onRevokeUser(email: string): void {
    if (email === 'aliyusahmad01@gmail.com') {
      this.svc.showToast('warning', 'Administrative Lockout', 'Master admin credentials are secure and immutable.');
      return;
    }
    if (confirm(`Are you sure you want to revoke access credentials for ${email}?`)) {
      this.svc.removeAuthorizedUser(email);
      this.userFormSuccess.set(`Revoked credentials for ${email}.`);
      setTimeout(() => this.userFormSuccess.set(null), 4000);
    }
  }

  public async onRemoveSubscriber(email: string): Promise<void> {
    if (confirm(`Are you sure you want to remove "${email}" from priority waitlist alerts?`)) {
      await this.svc.removeSubscriber(email);
    }
  }
}
