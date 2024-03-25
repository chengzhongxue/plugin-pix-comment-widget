import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { formatDate, timeAgo } from './utils/date';
import baseStyles from './styles/base';
import varStyles from './styles/var';

export class BaseCommentItem extends LitElement {
  @property({ type: String })
  userAvatar: string | undefined;

  @property({ type: String })
  userDisplayName: string | undefined;

  @property({ type: String })
  userWebsite: string | undefined;

  @property({ type: String })
  creationTime: string | undefined;

  @property({ type: Boolean })
  approved: boolean | undefined;

  @property({ type: Boolean })
  breath: boolean | undefined;

  @property({ type: String })
  content = '';

  @property({ type: Boolean })
  isReplys: boolean | undefined;


  override render() {
    return html`<li class="comment alt thread-even ${this.isReplys ? 'depth-2' : 'depth-1'} ${this.breath ? 'item--animate-breath' : ''}">
      <div  class="comment_body contents">
        <div class="profile">
          
          <a ${this.userWebsite ? html`href=${this.userWebsite}` : ''}  target="_blank">
            <img src="${this.userAvatar || 'https://cravatar.cn/avatar/?d=mp'}"
                 alt="${this.userDisplayName || ''}"
                 class="avatar avatar-50 photo" height="50" width="50"
                 loading="lazy" decoding="async"></a>
        </div>
        <div class="com_right">
          <section class="commeta">
            <div class="left">
              <h4 class="author"><a ${this.userWebsite ? html`href=${this.userWebsite}` : ''} target="_blank">${this.userDisplayName}</a></h4>
              <time itemprop="datePublished" datetime="${formatDate(this.creationTime)}"> · ${timeAgo(this.creationTime)}</time>
              ${!this.approved ? html`<div class="item__meta-info">审核中</div>` : ''}
            </div>
            <div class="right">
              <div class="info">
                <slot name="action"></slot>
              </div>
            </div>
          </section>
          <div class="body">
            <p><slot name="pre-content"></slot>${this.content}</p>
          </div>
          <div class="comment_list_footer">
          </div>
        </div>
      </div>
      <slot name="footer"></slot>
    </li>`;
  }

  static override styles = [
    varStyles,
    baseStyles,
    css`

      li {
        list-style: none;
        margin-bottom: 25px;
        border-bottom: 1px solid var(--component-border-bottom-color);
      }

      li.depth-2 {
        padding: 0;
        margin: 0;
        border: none;
      }

      li .comment_body {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        margin-bottom: 25px;
      }
      
      li .profile {
        width: 42px;
        height: 42px;
        margin-right: 8px;
      }

      .depth-2 .profile {
        width: 35px;
        height: 35px;
        margin-right: 8px;
      }

      .depth-2 .profile a {
        width: 35px;
        height: 35px;
        display: block;
      }

      li .profile a {
        width: 42px;
        height: 42px;
        display: block;
      }

      li .profile a img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 8px;
      }

      li .com_right {
        width: 100%;
      }

      li .com_right .commeta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        align-content: center;
        line-height: 1;
      }

      li .com_right .left {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
      }

      li .com_right .left h4 {
        margin: 0;
        font-size: 16px;
        margin-right: 5px;
        display: flex;
        align-items: center;
        flex-direction: row;
        align-content: center;
        flex-wrap: nowrap;
        justify-content: flex-start;
      }

      li .com_right .left h4 a {
        color: var(--a-color);
      }

      li .com_right .left time {
        font-size: 13px;
        color: var(--time-color);
      }

      a.comment-reply-link {
        color:var(--light-text-color);
      }

      li .com_right .body {
        margin-top: 5px;
      }

      li .com_right .body p {
        font-size: 14px;
        color: var(--text-color);
        margin: 0;
        white-space: pre-line;
      }
      .item--animate-breath {
        animation: breath 1s ease-in-out infinite;
      }

      @keyframes breath {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.02);
        }
        100% {
          transform: scale(1);
        }
      }
      .item__meta-info {
        font-size: 13px;
        color: var(--time-color);
        margin-left: 3px;
      }
    `,
  ];
}

customElements.get('base-comment-item') ||
  customElements.define('base-comment-item', BaseCommentItem);

declare global {
  interface HTMLElementTagNameMap {
    'base-comment-item': BaseCommentItem;
  }
}
