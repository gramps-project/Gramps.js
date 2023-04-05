import {css, html} from 'lit'

import {GrampsjsViewSettingsOnboarding} from './GrampsjsViewSettingsOnboarding.js'
import '../components/GrampsjsUsers.js'
import '../components/GrampsjsTaskProgressIndicator.js'
import {doLogout, apiPost, apiPut, apiGet} from '../api.js'
import '@material/mwc-textfield'
import '@material/mwc-button'
import '@material/mwc-select'
import '@material/mwc-tab'
import '@material/mwc-tab-bar'

import {clickKeyHandler} from '../util.js'

function renderLogoutButton() {
  return html`
    <mwc-button
      outlined
      class="red"
      label="logout"
      icon="exit_to_app"
      @click=${() => doLogout()}
    ></mwc-button>
  `
}

export class GrampsjsViewSettings extends GrampsjsViewSettingsOnboarding {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
        }

        mwc-tab-bar {
          margin-bottom: 30px;
        }
      `,
    ]
  }

  static get properties() {
    return {
      users: {type: Boolean},
      userData: {type: Array},
      page: {type: String},
    }
  }

  constructor() {
    super()
    this.users = false
    this.userData = []
    this.page = 'user'
  }

  renderContent() {
    return html`
      <mwc-tab-bar>
        <mwc-tab
          label="${this._('User settings')}"
          ?active="${this.page === 'user'}"
          @click=${() => {
            this.page = 'user'
          }}
        ></mwc-tab>
        ${this.users
          ? html`
              <mwc-tab
                label="${this._('Administration')}"
                ?active="${this.page === 'admin'}"
                @click=${() => {
                  this.page = 'admin'
                }}
              ></mwc-tab>
            `
          : ''}
      </mwc-tab-bar>
      ${this.page === 'user' ? this.renderUserSettings() : ''}
      ${this.page === 'admin' && this.users ? this.renderAdminSettings() : ''}
    `
  }

  renderAdminSettings() {
    return html`
      ${this.users
        ? html`
            <h3>${this._('Manage search index')}</h3>

            <p>
              ${this._(
                'Manually updating the search index is usually unnecessary, but it may become necessary after an upgrade.'
              )}
            </p>
            <mwc-button
              outlined
              @click="${this._updateSearch}"
              @keydown="${clickKeyHandler}"
              >${this._('Update search index')}</mwc-button
            >
            <grampsjs-task-progress-indicator
              class="button"
              id="progress-update-search"
              size="20"
            ></grampsjs-task-progress-indicator>

            <h3>${this._('Manage users')}</h3>

            <grampsjs-users
              .strings="${this.strings}"
              .data="${this.userData}"
              @user:updated="${this._handleUserChanged}"
              @user:added="${this._handleUserAdded}"
            >
            </grampsjs-users>
          `
        : ''}
    `
  }

  renderUserSettings() {
    return html`
      ${renderLogoutButton()}

      <h3>${this._('Select language')}</h3>

      ${this.renderLangSelect()}

      <h3>${this._('Set _Home Person')}</h3>

      ${this.renderPersonSelect()}

      <h3>${this._('Change E-mail')}</h3>

      ${this.renderChangeEmail()}

      <h3>${this._('Change password')}</h3>

      ${this.renderChangePw()}
    `
  }

  renderChangeEmail() {
    return html`
      <p>
        <mwc-textfield id="change-email" label="${this._('New E-mail')}">
        </mwc-textfield>
      </p>
      <p>
        <mwc-button
          outlined
          label="submit"
          @click="${this._changeEmail}"
        ></mwc-button>
      </p>
    `
  }

  renderChangePw() {
    return html`
      <p>
        <mwc-textfield
          id="old-pw"
          label="${this._('Old password')}"
          type="password"
        >
        </mwc-textfield>
        <mwc-textfield
          id="new-pw"
          label="${this._('New password')}"
          type="password"
        >
        </mwc-textfield>
      </p>
      <p>
        <mwc-button
          outlined
          label="submit"
          @click="${this._changePw}"
        ></mwc-button>
      </p>
    `
  }

  firstUpdated() {
    if (this.users) {
      this._fetchUserData()
    }
  }

  _handleUserChanged(e) {
    const data = e.detail
    this._updateUser(e.detail.name, {
      role: data.role,
      email: data.email,
      full_name: data.full_name,
    })
  }

  _handleUserAdded(e) {
    const data = e.detail
    this._addUser(e.detail.name, {
      role: data.role,
      email: data.email,
      full_name: data.full_name,
      password: data.password,
    })
  }

  _updateUser(username, payload) {
    apiPut(`/api/users/${username}/`, payload).then(data => {
      if ('error' in data) {
        this.error = true
        this._errorMessage = data.error
      } else {
        this.error = false
        this._fetchUserData()
      }
    })
  }

  _addUser(username, payload) {
    apiPost(`/api/users/${username}/`, payload).then(data => {
      if ('error' in data) {
        this.error = true
        this._errorMessage = data.error
      } else {
        this.error = false
        this._fetchUserData()
      }
    })
  }

  _fetchUserData() {
    this.loading = true
    apiGet('/api/users/').then(data => {
      if ('data' in data) {
        this.error = false
        this.userData = data.data
      } else if ('error' in data) {
        this.error = true
        this._errorMessage = data.error
      }
      this.loading = false
    })
  }

  _changeEmail() {
    const form = this.shadowRoot.getElementById('change-email')
    if (!form.value) {
      return
    }
    this.loading = true
    const payload = {email: form.value}
    apiPut('/api/users/-/', payload).then(data => {
      this.loading = false
      if ('error' in data) {
        this.error = false
        this.error = true
        this._errorMessage = data.error
      } else {
        this.dispatchEvent(
          new CustomEvent('grampsjs:notification', {
            bubbles: true,
            composed: true,
            detail: {message: 'E-mail successfully updated'},
          })
        )
        form.value = ''
      }
    })
  }

  _changePw() {
    const formOldPw = this.shadowRoot.getElementById('old-pw')
    const formNewPw = this.shadowRoot.getElementById('new-pw')
    if (!formOldPw.value || !formNewPw.value) {
      return
    }
    this.loading = true
    const payload = {
      old_password: formOldPw.value,
      new_password: formNewPw.value,
    }
    apiPost('/api/users/-/password/change', payload).then(data => {
      this.loading = false
      if ('error' in data) {
        this.error = true
        this._errorMessage = data.error
      } else {
        this.error = false
        this.dispatchEvent(
          new CustomEvent('grampsjs:notification', {
            bubbles: true,
            composed: true,
            detail: {message: 'Password successfully updated'},
          })
        )
        formOldPw.value = ''
        formNewPw.value = ''
      }
    })
  }

  async _updateSearch() {
    const prog = this.renderRoot.querySelector('#progress-update-search')
    prog.reset()
    prog.open = true
    const data = await apiPost('/api/search/index/?full=1')
    if ('error' in data) {
      prog.setError()
      prog._errorMessage = data.error
    } else if ('task' in data) {
      prog.taskId = data.task?.id || ''
    } else {
      prog.setComplete()
    }
  }
}

window.customElements.define('grampsjs-view-settings', GrampsjsViewSettings)
