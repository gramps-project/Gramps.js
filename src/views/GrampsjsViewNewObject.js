import {html, css} from 'lit'

import '@material/mwc-select'
import '@material/mwc-list/mwc-list-item'
import '@material/mwc-textarea'
import '@material/mwc-switch'
import '@material/mwc-formfield'
import '@material/mwc-button'
import '@material/mwc-circular-progress'

import {GrampsjsView} from './GrampsjsView.js'
import {apiGet, apiPost} from '../api.js'

export class GrampsjsViewNewObject extends GrampsjsView {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
        }

        div.spacer {
          margin-top: 2em;
        }

        p.right {
          text-align: right;
        }
      `,
    ]
  }

  static get properties() {
    return {
      data: {type: Object},
      types: {type: Object},
      typesLocale: {type: Object},
      loadingTypes: {type: Boolean},
      postUrl: {type: String},
      itemPath: {type: String},
      objClass: {type: String},
      isFormValid: {type: Boolean},
    }
  }

  constructor() {
    super()
    this.data = {}
    this.types = {}
    this.typesLocale = {}
    this.loadingTypes = false
    this.postUrl = ''
    this.itemPath = ''
    this.objClass = ''
    this.isFormValid = false
  }

  update(changed) {
    super.update(changed)
    if (changed.has('active')) {
      this._updateData()
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _reset() {
    this.shadowRoot
      .querySelectorAll(
        [
          'grampsjs-form-select-type',
          'grampsjs-form-private',
          'grampsjs-form-object-list',
          'grampsjs-form-select-object',
          'grampsjs-form-select-object-list',
          'grampsjs-form-select-date',
          'grampsjs-form-string',
          'grampsjs-form-upload',
          'grampsjs-form-name',
        ].join(', ')
      )
      .forEach(element => element.reset())
    this.shadowRoot.querySelectorAll('mwc-textfield').forEach(element => {
      // eslint-disable-next-line no-param-reassign
      element.value = ''
    })
  }

  _submit() {
    apiPost(this.postUrl, this.data).then(data => {
      if ('data' in data) {
        this.error = false
        const grampsId = data.data.filter(
          obj => obj.new._class === this.objClass
        )[0].new.gramps_id
        this.dispatchEvent(
          new CustomEvent('nav', {
            bubbles: true,
            composed: true,
            detail: {path: this._getItemPath(grampsId)},
          })
        )
        this._reset()
      } else if ('error' in data) {
        this.error = true
        this._errorMessage = data.error
      }
    })
  }

  // eslint-disable-next-line class-methods-use-this
  _getItemPath(grampsId) {
    return `${this.itemPath}/${grampsId}`
  }

  renderButtons() {
    return html`
      <div class="spacer"></div>
      <p class="right">
        <mwc-button
          outlined
          label="${this._('Cancel')}"
          type="reset"
          @click="${this._reset}"
          icon="cancel"
        >
        </mwc-button>
        <mwc-button
          raised
          label="${this._('Add')}"
          type="submit"
          @click="${this._submit}"
          icon="save"
          ?disabled=${!this.isFormValid}
        >
          <span slot="trailingIcon" style="display:none;">
            <mwc-circular-progress
              indeterminate
              density="-7"
              closed
              id="login-progress"
            >
            </mwc-circular-progress>
          </span>
        </mwc-button>
      </p>
    `
  }

  _updateData() {
    this.loading = true
    this.loadingTypes = true
    apiGet('/api/types/')
      .then(data => {
        this.loading = false
        if ('data' in data) {
          this.types = data.data || {}
          this.error = false
        } else if ('error' in data) {
          this.error = true
          this._errorMessage = data.error
        }
      })
      .then(() => {
        this.loading = true
        apiGet('/api/types/?locale=1').then(data => {
          this.loading = false
          this.loadingTypes = false
          if ('data' in data) {
            this.typesLocale = data.data || {}
            this.error = false
          } else if ('error' in data) {
            this.error = true
            this._errorMessage = data.error
          }
        })
      })
  }

  translateTypeName(isCustom, typeKey, string) {
    const types =
      (this.types[isCustom ? 'custom' : 'default'] || {})[typeKey] || []
    const ind = types.indexOf(string)
    try {
      return this.typesLocale[isCustom ? 'custom' : 'default'][typeKey][ind]
    } catch {
      return string
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener('formdata:changed', this._handleFormData.bind(this))
  }

  disconnectedCallback() {
    this.removeEventListener(
      'formdata:changed',
      this._handleFormData.bind(this)
    )
    super.disconnectedCallback()
  }

  _handleFormData(e) {
    const originalTarget = e.composedPath()[0]
    if (originalTarget.id === 'private') {
      this.data = {...this.data, private: e.detail.checked}
    }
    if (
      ['author', 'pubinfo', 'abbrev', 'page', 'desc'].includes(
        originalTarget.id
      )
    ) {
      this.data = {...this.data, [originalTarget.id]: e.detail.data}
    }
  }
}
