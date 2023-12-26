import {html} from 'lit'
import '@material/mwc-button'

import {GrampsjsView} from './GrampsjsView.js'
import {apiGet, getRecentObjects, setRecentObjects} from '../api.js'
import '../components/GrampsjsSearchResultList.js'

export class GrampsjsViewRecentObject extends GrampsjsView {
  static get properties() {
    return {
      _data: {type: Array},
      _searchResult: {type: Array},
      _isStale: {type: Boolean},
    }
  }

  constructor() {
    super()
    this._searchResult = []
    this._data = []
    this._isStale = false
  }

  connectedCallback() {
    super.connectedCallback()
    this._boundHandleEvent = this._handleEvent.bind(this)
    window.addEventListener('object:loaded', this._boundHandleEvent)
    this._boundStorageHandler = this._handleStorage.bind(this)
    window.addEventListener('storage', this._boundStorageHandler)
    this._handleStorage()
    window.addEventListener('language:changed', e =>
      this._handleLanguageChanged(e)
    )
  }

  _handleLanguageChanged(e) {
    if (this._hasFirstUpdated) {
      this._fetchData(e.detail.lang)
    }
  }

  _handleStorage() {
    const recentObjects = getRecentObjects()
    if (recentObjects !== undefined && recentObjects !== null) {
      this._data = recentObjects
      if (this._hasFirstUpdated) {
        this._fetchData(this.strings.__lang__)
      }
    }
  }

  _handleEvent(event) {
    this._data = this._data.filter(
      obj =>
        obj.grampsId !== event.detail.grampsId ||
        obj.className !== event.detail.className
    )
    this._data.push(event.detail)
    this._data = this._data.slice(-20)
    setRecentObjects(this._data)
    if (this.active) {
      this._fetchData(this.strings.__lang__)
    } else {
      this._isStale = true
    }
  }

  _handleClear() {
    this._data = []
    setRecentObjects(this._data)
  }

  render() {
    return html` <mwc-button
        raised
        label="${this._('Clear')}"
        class="float-right"
        icon="clear_all"
        @click="${this._handleClear}"
        ?disabled=${this._data.length === 0}
      ></mwc-button>
      <h2>${this._('Recently browsed objects')}</h2>
      ${this._data.length === 0
        ? html` <p>${this._('No items')}.</p> `
        : html`
            <grampsjs-search-result-list
              .data="${this._searchResult.slice().reverse()}"
              .strings="${this.strings}"
              large
              noSep
              linked
            ></grampsjs-search-result-list>
          `}`
  }

  async _fetchData(lang) {
    if (this._data.length === 0) {
      this._searchResult = []
      return
    }
    this.loading = true
    const query = this._data
      .map(obj => obj.grampsId.trim().replace(/\s\s+/g, ' OR '))
      .filter(grampsId => grampsId && grampsId.trim())
      .join(' OR ')
    const data = await apiGet(
      `/api/search/?query=${query}&locale=${
        lang || 'en'
      }&profile=all&page=1&pagesize=100`
    )
    this.loading = false
    if ('data' in data) {
      this.error = false
      const dataObject = data.data.reduce((obj, item) => {
        // eslint-disable-next-line no-param-reassign
        obj[item?.object?.gramps_id] = item
        return obj
      }, {})
      this._searchResult = this._data
        .map(obj => dataObject[obj.grampsId])
        .filter(obj => obj !== undefined)
    } else if ('error' in data) {
      this.error = true
      this._errorMessage = data.error
    }
  }

  firstUpdated() {
    this._hasFirstUpdated = true
    if ('__lang__' in this.strings) {
      // don't load before we have strings
      this._fetchData(this.strings.__lang__)
    }
  }

  update(changed) {
    super.update(changed)
    if (changed.has('active') && this.active && this._isStale) {
      this._fetchData(this.strings.__lang__)
      this._isStale = false
    }
  }
}

window.customElements.define('grampsjs-view-recent', GrampsjsViewRecentObject)
