import {css, html} from 'lit'
import '@material/mwc-select'
import '@material/mwc-checkbox'
import '@material/mwc-button'
import '@material/mwc-icon'
import '@material/mwc-list'
import '@material/mwc-list/mwc-list-item'

import {GrampsjsView} from './GrampsjsView.js'
import {apiGet} from '../api.js'
import {reportCategoryIcon, fireEvent} from '../util.js'

export class GrampsjsViewReports extends GrampsjsView {
  static get styles() {
    return [
      super.styles,
      css`
        .hidden {
          display: none;
        }
      `,
    ]
  }

  static get properties() {
    return {
      data: {type: Array},
      _formData: {type: Object},
      _queryUrl: {type: String},
    }
  }

  constructor() {
    super()
    this.data = []
    this._formData = {exporter: 'gramps', options: {compress: true}}
    this._queryUrl = ''
  }

  renderContent() {
    return html`
      <h2>${this._('_Reports').replace('_', '')}</h2>
      <mwc-list>
        ${this.data.map(item => this._selectListItem(item))}
      </mwc-list>
    `
  }

  _selectListItem(report) {
    return html`
      <li divider role="separator" padded></li>
      <mwc-list-item
        twoline
        graphic="icon"
        @click="${() => this._handleItemClick(report.id)}"
      >
        <mwc-icon slot="graphic"
          >${reportCategoryIcon[report.category] || 'menu_book'}</mwc-icon
        >
        <span>${this._(report.name)}</span>
        <span slot="secondary">${this._(report.description)}</span>
      </mwc-list-item>
    `
  }

  _handleItemClick(reportId) {
    fireEvent(this, 'nav', {path: `report/${reportId}`})
  }

  async _fetchData() {
    this.loading = true
    const data = await apiGet('/api/reports/')
    this.loading = false
    if ('data' in data) {
      this.error = false
      this.data = data.data
    } else if ('error' in data) {
      this.error = true
      this._errorMessage = data.error
    }
  }

  firstUpdated() {
    if ('__lang__' in this.strings) {
      // don't load before we have strings
      this._fetchData(this.strings.__lang__)
    }
  }

  connectedCallback() {
    super.connectedCallback()
    window.addEventListener('language:changed', e =>
      this._fetchData(e.detail.lang)
    )
  }
}

window.customElements.define('grampsjs-view-reports', GrampsjsViewReports)
