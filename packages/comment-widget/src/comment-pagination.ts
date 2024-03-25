import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import baseStyles from './styles/base';
import varStyles from './styles/var';

export class CommentPagination extends LitElement {
  @property({ type: Number })
  total = 0;
  @property({ type: Number })
  page = 1;
  @property({ type: Number })
  size = 10;

  get totalPages() {
    return Math.ceil(this.total / this.size);
  }

  renderPageNumbers() {
    const pageNumbers = [];
    const currentPage = this.page;
    const totalPageNumbersToShow = 3;
    let startPage, endPage;

    if (this.totalPages <= totalPageNumbersToShow) {
      startPage = 1;
      endPage = this.totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = totalPageNumbersToShow;
      } else if (currentPage + 2 >= this.totalPages) {
        startPage = this.totalPages - (totalPageNumbersToShow - 1);
        endPage = this.totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < this.totalPages) {
      if (endPage < this.totalPages - 1) pageNumbers.push('...');
      pageNumbers.push(this.totalPages);
    }

    return pageNumbers.map((number) => {
      if (number === '...') {
        return html`
          <li class="pagination__dot">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
          >
            <path
              d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z"
              fill="currentColor"
              fill-rule="evenodd"
              clip-rule="evenodd"
            ></path>
          </svg>
        </li>`;
      } else {
        if (this.page === number){
          return html`<span aria-current="page" class="page-numbers current">${number}</span>`;
        }else {
          return html`
            <a class="page-numbers" @click=${() => this.gotoPage(number)} >${number}</a>`;
        }

      }
    });
  }

  gotoPage(page: number | string) {
    if (page !== this.page) {
      this.dispatchEvent(
        new CustomEvent('page-change', {
          detail: { page },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  override render() {
    return html`
      <nav class="commentnav" data-fuck="326">
        ${this.page === 1 ? '' 
            : html`<a class="prev page-numbers"
                      @click=${() => this.gotoPage(this.page - 1)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24">
                <path
                    fill="none"
                    stroke="#888888"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m15 6l-6 6l6 6"
                />
              </svg>
            </a>` }
        ${this.renderPageNumbers()}
        ${this.page === this.totalPages ? '' 
        : html`<a class="next page-numbers"
                     @click=${() => this.gotoPage(this.page + 1)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24">
                <path 
                    fill="none" 
                    stroke="#888888" 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="m9 6l6 6l-6 6"></path>
              </svg>
        </a>` }
      </nav>
    `;
  }

  static override styles = [
    varStyles,
    baseStyles,
    css`
      
      .commentnav {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        margin-top: 20px;
      }
      .commentnav a {
        padding: 3px 7px;
        background: var(--component-pagination-button-bg-color-active);
        margin: 0 2px;
        font-size: 13px;
        color: var(--light-text-color);
        border-radius: 2px;
        display: flex;
        align-items: center;
      }
      .commentnav span.page-numbers.current {
        padding: 3px 7px;
        background: var(--component-pagination-button-bg-color-hover);
        margin: 0 2px;
        font-size: 13px;
        color: #ffffff;
        border-radius: 2px;
      }
      .pagination__dot {
        padding: 0.4em 0.875em;
      }
      @media (max-width: 768px) {
        .pagination__dot {
          display: none !important;
        }
      }
    `,
  ];
}

customElements.get('comment-pagination') ||
  customElements.define('comment-pagination', CommentPagination);

declare global {
  interface HTMLElementTagNameMap {
    'comment-pagination': CommentPagination;
  }
}
