import { css } from 'lit';

const varStyles = css`
  :host {
    /* Base */
    --base-color: var(--halo-comment-widget-base-color, #333);
    --base-info-color: var(--halo-comment-widget-base-info-color, #4b5563);
    --base-border-radius: var(--halo-comment-widget-base-border-radius, 0.4em);
    --base-font-size: var(--halo-comment-widget-base-font-size, 1rem);
    --base-line-height: var(--halo-comment-widget-base-line-height, 1.25em);
    --base-font-family: var(
      --halo-comment-widget-base-font-family,
      ui-sans-serif,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      Segoe UI,
      Roboto,
      Helvetica Neue,
      Arial,
      Noto Sans,
      sans-serif,
      'Apple Color Emoji',
      'Segoe UI Emoji',
      Segoe UI Symbol,
      'Noto Color Emoji'
    );

    --component-form-input-bg-color: var(--halo-comment-widget-component-form-input-pix-bg-color, #f7f9f7);
    
    --component-form-input-color: var(--halo-comment-widget-component-form-input-color, #3b4351);

    --component-form-input-border-color: var(
            --halo-comment-widget-component-form-input-border-color,
            #deece2
    );

    /* Components */
    --component-form-button-submit-bg-color: var(
      --halo-comment-widget-component-form-button-submit-pix-bg-color,
      #22bb6d
    );
    --component-form-button-submit-color: var(
            --halo-comment-widget-component-form-button-submit-pix-color,
            #f6f7ff
    );
    
    --comment-author-info-input: var(--halo-comment-widget-component-comment-author-info-input,#ebf2ed);
    
    --component-form-button-emoji-color: var(
      --halo-comment-widget-component-form-button-emoji-color,
      #4b5563
    );

    --component-comment-item-action-bg-color-hover: var(
      --halo-comment-widget-component-comment-item-action-bg-color-hover,
      #f3f4f6
    );
    --component-comment-item-action-color-hover: var(
      --halo-comment-widget-component-comment-item-action-color-hover,
      #333
    );
    
    --component-pagination-button-bg-color-hover: var(
      --halo-comment-widget-component-pagination-button-pix-bg-color-hover,
      #22bb6d
    );
    
    --component-pagination-button-bg-color-active: var(
      --halo-comment-widget-component-pagination-button-pix-bg-color-active,
      #d2ddd5
    );
    --component-pagination-button-border-color-active: var(
      --halo-comment-widget-component-pagination-button-pix-border-color-active,
      #76937f
    );

    --component-emoji-picker-rgb-color: var(
      --halo-comment-widget-component-emoji-picker-rgb-color,
      34,
      36,
      39
    );
    --component-emoji-picker-rgb-accent: var(
      --halo-comment-widget-component-emoji-picker-rgb-accent,
      34,
      102,
      237
    );
    --component-emoji-picker-rgb-background: var(
      --halo-comment-widget-component-emoji-picker-rgb-background,
      255,
      255,
      255
    );
    --component-emoji-picker-rgb-input: var(
      --halo-comment-widget-component-emoji-picker-rgb-input,
      255,
      255,
      255
    );
    --component-emoji-picker-color-border: var(
      --halo-comment-widget-component-emoji-picker-color-border,
      rgba(0, 0, 0, 0.05)
    );
    --component-emoji-picker-color-border-over: var(
      --halo-comment-widget-component-emoji-picker-color-border-over,
      rgba(0, 0, 0, 0.1)
    );
    
    --ava-content-background: var(--halo-comment-widget-ava-content-background,#fff);
    --a-color: var(--halo-comment-widget-a-color,#5d7099);
    --time-color: var(--halo-comment-widget-time-color,#98ad9e);
    --parents_at-color: var(--halo-comment-widget-parents_at-color,#22bb6d);
    --text-color: var(--halo-comment-widget-text-color,#5e5e5e);

    --component-webkit-box-shadow: var(--halo-comment-widget-component-webkit-box-shadow,#d0dada);
    --component-box-shadow: var(--halo-comment-widget-component-box-shadow,#d0dadab5);
    --component-border-bottom-color: var(--halo-comment-widget-component-border-bottom-color,#f7f7ff);
    --btn-active-color: var(--halo-comment-widget-component-btn-active-color,#22bb6d);
    
  }
`;

export default varStyles;
