import {LitElement, css, html} from 'lit'

import {hex6ToCss, hex12ToCss} from '../color.js'
import {sharedStyles} from '../SharedStyles.js'
import '@material/mwc-icon-button'

import './GrampsjsFormNewTag.js'
import './GrampsjsTooltip.js'
import {GrampsjsTranslateMixin} from '../mixins/GrampsjsTranslateMixin.js'

export class GrampsjsTagsSmall extends GrampsjsTranslateMixin(LitElement) {
  static get styles() {
    return [
      sharedStyles,
      css`
        .chip {
          font-size: 11px;
          font-weight: 500;
          font-family: var(--grampsjs-body-font-family);
          padding: 0px 12px;
          border-radius: 6px;
          margin: 0 6px;
          height: 24px;
        }

        .tags {
          clear: left;
          margin: 5px 0px;
          align-items: center;
          display: inline-flex;
          padding: 5px;
        }

        .chip mwc-icon-button {
          --mdc-icon-size: 14px;
          --mdc-icon-button-size: 18px;
        }
      `,
    ]
  }

  static get properties() {
    return {
      data: {type: Array},
    }
  }

  constructor() {
    super()
    this.data = []
  }

  render() {
    if (Object.keys(this.data).length === 0) {
      return html``
    }
    return html`
      <div class="tags">
        ${this.data.map(obj => {
          let color =
            obj.color?.length > 7
              ? hex12ToCss(obj.color, 0.8)
              : hex6ToCss(obj.color, 0.8)
          color = color || 'rgba(0, 0, 0, 0.6)'
          return html`
            <span class="chip" style="background-color:${color};color:white;"
              >${obj.name}</span
            >
          `
        })}
      </div>
    `
  }

  _handleList() {
    return this.data.map(_obj => _obj.handle)
  }
}

window.customElements.define('grampsjs-tags-small', GrampsjsTagsSmall)
