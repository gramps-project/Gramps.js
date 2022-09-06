import {LitElement, css, html} from 'lit'
import '@material/mwc-checkbox'

import {sharedStyles} from '../SharedStyles.js'
import {GrampsjsTranslateMixin} from '../mixins/GrampsjsTranslateMixin.js'
import {fireEvent} from '../util.js'

export class GrampsjsFilterProperties extends GrampsjsTranslateMixin(
  LitElement
) {
  static get styles() {
    return [
      sharedStyles,
      css`
        h3 {
          font-size: 14px;
          text-transform: uppercase;
          font-family: Roboto;
          font-weight: 500;
          color: var(--mdc-theme-primary);
          border-color: var(--mdc-theme-primary);
          border-bottom-width: 1px;
        }
      `,
    ]
  }

  static get properties() {
    return {
      filters: {type: Array},
      props: {type: Object},
      hasCount: {type: Boolean},
      label: {type: String},
    }
  }

  constructor() {
    super()
    this.filters = []
    this.props = {}
    this.hasCount = false
    this.label = 'Properties'
  }

  render() {
    return html`
      <h3>${this._(this.label)}</h3>
      ${Object.keys(this.props).map(
        key => html`
          <mwc-formfield
            label="${this._(this.props[key] || '').replace(/<[^>]+>/, '')}"
          >
            <mwc-checkbox
              id="${key}"
              @change="${this._handleChange}"
              ?checked="${this.filters.filter(rule => rule.name === key)
                .length > 0}"
            ></mwc-checkbox>
          </mwc-formfield>
        `
      )}
    `
  }

  _handleChange(event) {
    const name = event.target.id
    const rule = this.hasCount ? {name, values: ['0', 'greater than']} : {name}
    const rules = event.target.checked ? [rule] : []
    fireEvent(this, 'filter:changed', {filters: {rules}, replace: name})
  }
}

window.customElements.define(
  'grampsjs-filter-properties',
  GrampsjsFilterProperties
)
