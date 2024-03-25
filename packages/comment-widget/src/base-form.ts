import './emoji-button';
import { LitElement, css, html } from 'lit';
import { Ref, createRef, ref } from 'lit/directives/ref.js';
import {
  allowAnonymousCommentsContext,
  baseUrlContext,
  currentUserContext,
  groupContext,
  kindContext,
  nameContext,
} from './context';
import { state,property } from 'lit/decorators.js';
import type { User } from '@halo-dev/api-client';
import baseStyles from './styles/base';
import { consume } from '@lit/context';
import varStyles from './styles/var';

export class BaseForm extends LitElement {
  @consume({ context: baseUrlContext })
  @state()
  baseUrl = '';

  @consume({ context: currentUserContext, subscribe: true })
  @state()
  currentUser: User | undefined;

  @consume({ context: allowAnonymousCommentsContext, subscribe: true })
  @state()
  allowAnonymousComments = false;

  @consume({ context: groupContext })
  @state()
  group = '';

  @consume({ context: kindContext })
  @state()
  kind = '';

  @consume({ context: nameContext })
  @state()
  name = '';

  textareaRef: Ref<HTMLTextAreaElement> = createRef<HTMLTextAreaElement>();

  @state()
  profilePickerVisible = false;

  @state()
  @property({ type: String })
  editDisplayName = this.customAccount.displayName || '' ;
  @state()
  @property({ type: String })
  editEmail = this.customAccount.email || '';

  get customAccount() {
    return JSON.parse(localStorage.getItem('halo-comment-custom-account') || '{}');
  }

  get loginUrl() {
    const parentDomId = `#comment-${[this.group?.replaceAll('.', '-'), this.kind, this.name]
      .join('-')
      .replaceAll(/-+/g, '-')}`;

    return `/console/login?redirect_uri=${encodeURIComponent(window.location.href + parentDomId)}`;
  }

  handleOpenLoginPage() {
    window.location.href = this.loginUrl;
  }

  async handleLogout() {
    if (window.confirm('确定要退出登录吗？')) {
      try {
        const response = await fetch(`${this.baseUrl}/logout`, {
          method: 'POST',
          headers: {
            'X-Xsrf-Token':
              document.cookie
                .split('; ')
                .find((row) => row.startsWith('XSRF-TOKEN'))
                ?.split('=')[1] || '',
          },
          credentials: 'same-origin',
        });

        if (!response.ok) {
          throw new Error('Failed to logout');
        }

        window.location.reload();
      } catch (error) {
        console.error('Failed to logout', error);
      }
    }
  }

  renderAccountInfo() {
    return html`
      <a class="edit-profile login_avatar"
         @click=${this.handleLogout} target="_top">
        ${this.currentUser?.spec.avatar ? html`<img src=${this.currentUser.spec.avatar} />` 
            : '<img src="https://cravatar.cn/avatar/?d=mp">'}
        <small>${this.currentUser?.spec.displayName || this.currentUser?.metadata.name} , 登出</small>
      </a>
      `;
  }

  onContentInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    // reset height to auto to make sure it can grow
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
  }

  onDisplayNameInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.editDisplayName = target.value;
  }

  onEmailInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.editEmail = target.value;
  }


  onEmojiSelect(e: CustomEvent) {
    const data = e.detail;
    if (this.textareaRef.value) {
      this.textareaRef.value.value += data.native;
      this.textareaRef.value.focus();
    }
  }

  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      const form = this.shadowRoot?.querySelector('form');
      e.preventDefault();
      form?.requestSubmit();
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('keydown', this.onKeydown);
    document.addEventListener('click', this.handleClickOutside.bind(this),true);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.onKeydown);
    document.removeEventListener('click', this.handleClickOutside.bind(this),true);
  }

  handleClickOutside(event: MouseEvent) {
    if (this.profilePickerVisible==true){
        const path = event.composedPath();
        let containsClassName = false;
        for (let i = 0; i < path.length; i++) {
          const element = path[i] as HTMLElement;
          if (typeof element.className === 'string') {
            if (element.className &&
                (element.className?.includes('commentput shadow uk-drop') || element.className?.includes('vi_avatar_box'))) {
              containsClassName = true;
              break; // 找到符合条件的元素就跳出循环
            }
          }
        }
        if (!containsClassName) {
          this.profilePickerVisible = false;
        }
    }
  }

  async handleOpenProfilePicker() {
    if (this.profilePickerVisible) {
      this.profilePickerVisible = false;
      return;
    }

    if (!this.profilePickerVisible) {
      this.profilePickerVisible = true;
      return;
    }
  }


  override render() {
    return html`
      <form id="t_commentform" @submit="${this.onSubmit}">
        <div class="vi_avatar_box">
          <a class="edit_comment_info">
            ${this.currentUser ? this.renderAccountInfo() : ''}
            ${!this.currentUser && !this.allowAnonymousComments
                ? html`
                <a class="edit-profile login_avatar"
                   @click=${this.handleOpenLoginPage} target="_top">
                  <img src="https://cravatar.cn/avatar/?d=mp">
                  <small>登录</small>
                </a>
               ` : ''}
            ${!this.currentUser && this.allowAnonymousComments
                ? html`<a class="edit-profile edit-card" @click=${this.handleOpenProfilePicker}><img
                  src="https://cravatar.cn/avatar/?d=mp" height="50" width="50"
                  class="v-avatar avatar avatar-50"><small>${this.editProfile()? this.editDisplayName+' , 编辑' : '点击填写昵称和邮箱，方可发布评论'}</small></a>` : ''}
          </a>
            ${!this.currentUser && this.allowAnonymousComments
                ? html`
                    <div id="ava-content"  class="commentput shadow uk-drop"
                         uk-drop="mode:click;offset: 10;toggle:.edit-card;pos:bottom-left;animation:uk-animation-scale-down"
                         style="display: ${this.profilePickerVisible ? 'block' : 'none'}">
                      <div id="comment-author-info" class="card">
                        <p>*邮箱和昵称必须填写</p>
                        <input type="text" name="displayName" @input="${this.onDisplayNameInput}" value=${this.customAccount.displayName} required size="22" placeholder="昵称" tabindex="1" >
                        <label for="author"></label>
                        <input type="email" name="email" @input="${this.onEmailInput}" value=${this.customAccount.email}  required size="22" placeholder="地址邮箱" tabindex="2">
                        <label for="email"></label>
                        <input type="url" name="website" value=${this.customAccount.website} size="22" placeholder="http://" tabindex="3">
                        <label for="url"></label>
                      </div>
                  </div>`
                : ''}
          </div>
        </div>
        <div class="clear"></div>

        <div class="ava_comments">
          <div class="avaleft">
            <div id="ava-popover" class="visitor-avatar">
              
            </div>
          </div>
        </div>
        <textarea
            id="comment"
            class="comment"
            ${ref(this.textareaRef)}
            placeholder="不准备说点什么"
            name="content"
            required
            @input=${this.onContentInput}
        ></textarea>
        <div class="topic_comments_foobar">
          <div class="left">
            <div class="comment_smile_box">
              ${!this.currentUser && this.allowAnonymousComments
               ? html`<a href=${this.loginUrl} rel="nofollow"> （已有该站点的账号） </a>` : ''}
            </div>
          </div>
          <div class="right">
            <div class="comment-form-validate">
              <emoji-button @emoji-select=${this.onEmojiSelect}></emoji-button>
            </div>
            <div class="com_push">
              <input class="push_comment" type="submit" id="push_comment" tabindex="5" value="发送">
            </div>
          </div>
        </div>
      </form>
    `;
  }


  editProfile(){
    if (this.editDisplayName.trim() === '' || this.editEmail.trim() === '') {
      return false
    }else {
      return true
    }
  }

  onSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // store account info
    localStorage.setItem(
      'halo-comment-custom-account',
      JSON.stringify({
        displayName: data.displayName,
        email: data.email,
        website: data.website,
      })
    );

    const event = new CustomEvent('submit', {
      detail: data,
    });
    this.dispatchEvent(event);
  }

  resetForm() {
    const form = this.shadowRoot?.querySelector('form');
    form?.reset();
  }

  setFocus() {
    this.textareaRef.value?.focus();
  }

  static override styles = [
    varStyles,
    baseStyles,
    css`

      textarea {
        width: 100%;
      }
      
      #t_commentform {
        padding: 10px;
        background: var(--component-form-input-bg-color);
        border-radius: 5px;
        border: 1px solid var(--component-form-input-border-color);
        margin: 15px 0 25px;
      }
      #t_commentform:focus-within {
        border-color: var(--btn-active-color);
      }

      small {
        font-size: 80%;
      }

      a.edit-profile img {
        width: 24px;
        height: 24px;
        object-fit: cover;
        border-radius: 50%;
        margin-right: 5px;
      }
      a.edit-profile {
        display: flex;
        align-items: center;
        flex-direction: row;
        flex-wrap: nowrap;
        font-size: 13px;
        color: #576889;
      }

      #ava-content {
        background: var(--ava-content-background);
        border-radius: 8px;
        padding: 15px;
        width: 240px;
        margin-top: 8px;
      }

      #comment-author-info p {
        font-size: 13px;
        margin-bottom: 5px;
        color: var(--time-color);
      }
      #comment-author-info input {
        outline: none;
        font-size: 13px;
        padding: 7px 5px;
        width: 100%;
        margin-bottom: 7px;
        border-radius: 5px;
        border-color: #d0dada;
        color: var(--component-form-input-color);
        background: var(--comment-author-info-input);
      }
      
      .vi_avatar_box {
        margin-bottom: 10px;
      }
      textarea#comment {
        border-color: var(--component-form-input-border-color);
      }
      textarea#comment {
        border: none;
        background: var(--component-form-input-bg-color);
        font-size: 13px;
        height: 50px;
        outline: none;
        resize: none;
        color: var(--component-form-input-color);
        border-bottom: 1px solid var(--component-form-input-border-color);
        border-radius: 0px;
      }
      
      .topic_comments_foobar {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: nowrap;
        align-items: center;
      }

      .topic_comments_foobar .right {
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: flex-start;
        flex-wrap: nowrap;
      }
      .com_push {
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: flex-start;
      }
      input#push_comment {
        font-size: 13px;
        border: none;
        display: flex;
        align-items: center;
        padding: 8px 18px;
        cursor: pointer;
        background: #22bb6d;
        color: #fff;
        border-radius: 5px;
      }
      input#push_comment {
        background: var(--component-form-button-submit-bg-color);
        color: var(--component-form-button-submit-color);
      }
      .comment-form-validate {
        display: inline-block;
        position: relative;
        margin-right: 10px;
        padding-top: 4px;
      }
      .uk-drop {
        display: none;
        position: absolute;
        z-index: 1020;
        --uk-position-offset: 20px;
        --uk-position-viewport-offset: 15px;
        box-sizing: border-box;
        width: 300px;
      }
      .shadow {
        -webkit-box-shadow: 0px 3px 14px 1px var(--component-webkit-box-shadow);
        box-shadow: 0px 3px 14px 1px var(--component-box-shadow);
      }
      .comment_smile_box {
        font-size: 14px;
      }
    `,
  ];
}

customElements.get('base-form') || customElements.define('base-form', BaseForm);

declare global {
  interface HTMLElementTagNameMap {
    'base-form': BaseForm;
  }
}
