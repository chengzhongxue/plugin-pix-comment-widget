import { css } from 'lit';

const baseStyles = css`
  *,
  ::before,
  ::after {
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
  }

  :host {
    font-size: var(--base-font-size);
    line-height: var(--base-line-height);
    font-family: var(--base-font-family);
    -webkit-text-size-adjust: 100%;
    -moz-tab-size: 4;
    tab-size: 4;
    font-feature-settings: normal;
    font-variation-settings: normal;
  }

  hr {
    height: 0;
    color: inherit;
    border-top-width: 1px;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: inherit;
    font-weight: inherit;
  }

  h1, h2, h3, h4, p, input {
    font-family: var(--base-font-family);
  }

  a {
    text-decoration: none;
    cursor: pointer;
  }

  b,
  strong {
    font-weight: bolder;
  }

  code,
  kbd,
  samp,
  pre {
    font-size: 0.875em;
  }

  small {
    font-size: 80%;
  }

  sub,
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }

  sub {
    bottom: -0.25em;
  }

  sup {
    top: -0.5em;
  }

  button:not(.emoji-button),
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit;
    font-feature-settings: inherit;
    font-variation-settings: inherit;
    font-size: 100%;
    font-weight: inherit;
    line-height: inherit;
    color: inherit;
    margin: 0;
    padding: 0;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }


  button:not(.emoji-button),
  [type="button"],
  [type="reset"],
  [type="submit"] {
    -webkit-appearance: button;
  }

  button:not(.emoji-button),
  input[type="button"],
  input[type="reset"],
  input[type="submit"] {
    border: 1px solid;
    border-color: #ccc #ccc #bbb;
    border-radius: 3px;
    background: #e6e6e6;
    color: rgba(0, 0, 0, 0.8);
    line-height: 1;
    padding: 0.6em 1em 0.4em;
  }

  button:not(.emoji-button):hover,
  input[type="button"]:hover,
  input[type="reset"]:hover,
  input[type="submit"]:hover {
    border-color: #ccc #bbb #aaa;
  }



  blockquote,
  dl,
  dd,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  hr,
  figure,
  p,
  pre {
    margin: 0;
  }

  ol,
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  pre {
    font-family: var(--base-font-family);
  }

  canvas, img, svg, video {
    max-width: 100%;
    height: auto;
    box-sizing: border-box;
  }
`;

export default baseStyles;
