import {css, html} from 'lit'
import '@material/mwc-checkbox'

import {sharedStyles} from '../SharedStyles.js'
import {GrampsjsConnectedComponent} from './GrampsjsConnectedComponent.js'
import {fireEvent} from '../util.js'

export class GrampsjsFilterTags extends GrampsjsConnectedComponent {
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
    }
  }

  constructor() {
    super()
    this.filters = []
  }

  renderContent() {
    return html`
      <h3>${this._('Tags')}</h3>
      ${this._data.data.map(
        tag => html`
          <mwc-formfield label="${tag.name}">
            <mwc-checkbox
              id="${tag.handle}"
              @change="${this._handleChange}"
              ?checked="${this.filters
                .filter(rule => rule.name === 'HasTag')
                .filter(rule => rule.values[0] === tag.name).length > 0}"
            ></mwc-checkbox>
          </mwc-formfield>
        `
      )}
    `
  }

  // eslint-disable-next-line class-methods-use-this
  getUrl() {
    return '/api/tags/'
  }

  _handleChange() {
    const checkboxes = this.renderRoot.querySelectorAll('mwc-checkbox')
    const rules = [...checkboxes]
      .map(box => this._checkboxToTag(box))
      .filter(el => el.checked)
      .map(rule => ({name: 'HasTag', values: rule.values}))
    fireEvent(this, 'filter:changed', {filters: {rules}, replace: 'HasTag'})
  }

  _checkboxToTag(checkbox) {
    const handle = checkbox.id
    const [tag] = this._data.data.filter(tag_ => tag_.handle === handle)
    return {values: [tag.name], checked: checkbox.checked}
  }
}

window.customElements.define('grampsjs-filter-tags', GrampsjsFilterTags)
