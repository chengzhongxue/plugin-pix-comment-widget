import { LitElement, css, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { CommentVoList, User } from '@halo-dev/api-client';
import { repeat } from 'lit/directives/repeat.js';
import baseStyles from './styles/base';
import { provide } from '@lit/context';
import {
  allowAnonymousCommentsContext,
  baseUrlContext,
  currentUserContext,
  emojiDataUrlContext,
  groupContext,
  kindContext,
  nameContext,
  replySizeContext,
  toastContext,
  versionContext,
  withRepliesContext,
} from './context';
import './comment-form';
import './comment-item';
import './comment-pagination';
import varStyles from './styles/var';
import { ToastManager } from './lit-toast';

export class CommentWidget extends LitElement {
  @provide({ context: baseUrlContext })
  @property({ type: String, attribute: 'base-url' })
  baseUrl = '';

  @provide({ context: kindContext })
  @property({ type: String })
  kind = '';

  @provide({ context: groupContext })
  @property({ type: String })
  group = '';

  @provide({ context: versionContext })
  @property({ type: String })
  version = '';

  @provide({ context: nameContext })
  @property({ type: String })
  name = '';

  @provide({ context: withRepliesContext })
  @property({ type: Boolean, attribute: 'with-replies' })
  withReplies = false;

  @provide({ context: replySizeContext })
  @property({ type: Number, attribute: 'reply-size' })
  replySize = 10;

  @provide({ context: emojiDataUrlContext })
  @property({ type: String, attribute: 'emoji-data-url' })
  emojiDataUrl = 'https://unpkg.com/@emoji-mart/data';

  @provide({ context: currentUserContext })
  @state()
  currentUser: User | undefined;

  @provide({ context: allowAnonymousCommentsContext })
  @state()
  allowAnonymousComments = false;

  @provide({ context: toastContext })
  @state()
  toastManager: ToastManager | undefined;

  @state()
  comments: CommentVoList = {
    page: 1,
    size: 20,
    total: 0,
    items: [],
    first: true,
    last: false,
    hasNext: false,
    hasPrevious: false,
    totalPages: 0,
  };

  @state()
  loading = false;

  get shouldDisplayPagination() {
    if (this.loading) {
      return false;
    }

    return this.comments.hasNext || this.comments.hasPrevious;
  }

  override render() {
    return html`<div class="topic_comments comments comments-area">
      <div class="comments-title">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14 22.5L11.2 19H6C5.44772 19 5 18.5523 5 18V7.10256C5 6.55028 5.44772 6.10256 6 6.10256H22C22.5523 6.10256 23 6.55028 23 7.10256V18C23 18.5523 22.5523 19 22 19H16.8L14 22.5ZM15.8387 17H21V8.10256H7V17H11.2H12.1613L14 19.2984L15.8387 17ZM2 2H19V4H3V15H1V3C1 2.44772 1.44772 2 2 2Z"></path></svg>
        Comments | <span class="noticom"><a>${this.comments.total} 评论</a> </span>
      </div>
      <div class="toi_comments_main">
        <comment-form
            @reload="${() => this.fetchComments({ page: 1, scrollIntoView: true })}"
        ></comment-form>
        ${this.loading
            ? html`<loading-block></loading-block>`
            : html`
              <div class="commentshow">
                ${this.comments.total>0 ? html`<ul class="comment-list">
                  ${repeat(
                      this.comments.items,
                      (item) => item.metadata.name,
                      (item) => html`<comment-item .comment=${item}></comment-item>`
                  )}
                </ul>`
                    : html`<ul class="comment-list">
                      <p class="nodata"><i class="ri-ghost-line"></i>空空如也！</p>
                    </ul>`}
                
                ${this.shouldDisplayPagination
                    ? html`
                    <comment-pagination
                      .total=${this.comments.total}
                      .page=${this.comments.page}
                      .size=${this.comments.size}
                      @page-change=${this.onPageChange}
                    ></comment-pagination>
                  `
                    : ''}
                <div
          `}
        </div>
      
      
    </div>`;
  }

  async fetchGlobalInfo() {
    try {
      const response = await fetch(`${this.baseUrl}/actuator/globalinfo`, {
        method: 'get',
        credentials: 'same-origin',
      });

      const data = await response.json();
      this.allowAnonymousComments = data.allowAnonymousComments;
    } catch (error) {
      console.error('Failed to fetch global info', error);
    }
  }

  async fetchCurrentUser() {
    const response = await fetch(`${this.baseUrl}/apis/api.console.halo.run/v1alpha1/users/-`);
    const data = await response.json();
    this.currentUser = data.user.metadata.name === 'anonymousUser' ? undefined : data.user;
  }

  async fetchComments(options?: { page?: number; scrollIntoView?: boolean }) {
    const { page, scrollIntoView } = options || {};
    try {
      if (this.comments.items.length === 0) {
        this.loading = true;
      }

      if (page) {
        this.comments.page = page;
      }

      const queryParams = [
        `group=${this.group}`,
        `kind=${this.kind}`,
        `name=${this.name}`,
        `page=${this.comments.page}`,
        `size=${this.comments.size}`,
        `version=${this.version}`,
        `withReplies=${this.withReplies}`,
        `replySize=${this.replySize}`,
      ];

      const response = await fetch(
        `${this.baseUrl}/apis/api.halo.run/v1alpha1/comments?${queryParams.join('&')}`
      );

      if (!response.ok) {
        throw new Error('评论列表加载失败，请稍后重试');
      }

      const data = await response.json();
      this.comments = data;
    } catch (error) {
      if (error instanceof Error) {
        this.toastManager?.error(error.message);
      }
    } finally {
      this.loading = false;

      if (scrollIntoView) {
        this.scrollIntoView({ block: 'start', inline: 'start', behavior: 'smooth' });
      }
    }
  }

  async onPageChange(e: CustomEvent) {
    const data = e.detail;
    this.comments.page = data.page;
    await this.fetchComments({ scrollIntoView: true });
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.toastManager = new ToastManager();
    this.fetchCurrentUser();
    this.fetchComments();
    this.fetchGlobalInfo();
  }

  static override styles = [
    varStyles,
    baseStyles,
    css`
      .comments-title {
        font-size: 14px;
        display: flex;
        align-items: center;
        color: #516181;
      }
      .comments-title i {
        margin-right: 3px;
      }
      .comments-title span {
        margin-left: 3px;
      }
      .comments-title a {
        color: #516181;
      }
      .comments-title svg {
        height: 1em;
        width: 1em;
        margin-right: 3px;
      }

      .commentshow {
        margin-top: 40px;
      }
      .comment-list p.nodata {
        display: flex;
        justify-content: center;
        color: var(--text-color);
        margin: 0 0 20px 0;
      }
      
    `,
  ];
}

customElements.get('comment-widget') || customElements.define('comment-widget', CommentWidget);

declare global {
  interface HTMLElementTagNameMap {
    'comment-widget': CommentWidget;
  }
}
