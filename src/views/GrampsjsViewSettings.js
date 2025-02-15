import {css, html} from 'lit'

import {GrampsjsViewSettingsOnboarding} from './GrampsjsViewSettingsOnboarding.js'
import './GrampsjsViewAdminSettings.js'
import './GrampsjsViewUserManagement.js'
import {userRoles} from '../components/GrampsjsFormUser.js'
import '../components/GrampsjsUsers.js'
import '../components/GrampsjsTaskProgressIndicator.js'
import '../components/GrampsjsShareUrl.js'
import '../components/GrampsjsSysinfo.js'
import '../components/GrampsjsTreeQuotas.js'

import {fireEvent} from '../util.js'
import '@material/mwc-textfield'
import '@material/mwc-button'
import '@material/mwc-select'
import '@material/mwc-tab'
import '@material/mwc-tab-bar'

function renderLogoutButton(appState) {
  return html`
    <mwc-button
      outlined
      class="red"
      label="logout"
      icon="exit_to_app"
      @click=${() => appState.signout()}
    ></mwc-button>
  `
}

export class GrampsjsViewSettings extends GrampsjsViewSettingsOnboarding {
  static get styles() {
    return [
      super.styles,
      css`
        mwc-tab-bar {
          margin-bottom: 30px;
        }

        .medium {
          font-weight: 500;
          color: rgb(0.05, 0.05, 0.05);
        }
      `,
    ]
  }

  static get properties() {
    return {
      page: {type: String},
      dbInfo: {type: Object},
      _userInfo: {type: Object},
    }
  }

  constructor() {
    super()
    this.page = 'user'
    this.dbInfo = {}
    this._userInfo = {}
  }

  get owner() {
    return this.appState.permissions.canManageUsers
  }

  renderContent() {
    if (['#user', '#admin', '#users', '#info'].includes(window.location.hash)) {
      this.page = window.location.hash.substring(1)
      window.history.pushState(
        '',
        document.title,
        window.location.pathname + window.location.search
      )
    }
    return html`
      <mwc-tab-bar>
        <mwc-tab
          label="${this._('User settings')}"
          @click=${() => {
            this.page = 'user'
          }}
        ></mwc-tab>
        ${this.owner
          ? html`
              <mwc-tab
                label="${this._('Administration')}"
                @click=${() => {
                  this.page = 'admin'
                }}
              ></mwc-tab>
              <mwc-tab
                label="${this._('Manage users')}"
                @click=${() => {
                  this.page = 'users'
                }}
              ></mwc-tab>
            `
          : ''}
        <mwc-tab
          label="${this._('System Information')}"
          @click=${() => {
            this.page = 'info'
          }}
        ></mwc-tab>
      </mwc-tab-bar>
      ${this.page === 'user' ? this.renderUserSettings() : ''}
      ${this.page === 'admin' && this.owner ? this.renderAdminSettings() : ''}
      ${this.page === 'users' && this.owner ? this.renderUserManagement() : ''}
      ${this.page === 'info' ? this.renderSysInfo() : ''}
    `
  }

  // eslint-disable-next-line class-methods-use-this
  get _registerUrl() {
    const url = new URL(document.URL)
    const {tree} = this.appState.auth.claims
    return `${url.origin}/register/${tree}`
  }

  renderAdminSettings() {
    return html`
      <grampsjs-view-admin-settings
        active
        .appState="${this.appState}"
        .dbInfo="${this.dbInfo}"
        .userInfo="${this._userInfo}"
      >
      </grampsjs-view-admin-settings>
    `
  }

  renderUserManagement() {
    return html`
      <grampsjs-view-user-management
        active
        .appState="${this.appState}"
        .dbInfo="${this.dbInfo}"
      >
      </grampsjs-view-user-management>
    `
  }

  renderUserSettings() {
    return html`
      ${renderLogoutButton(this.appState)}

      <h3>${this._('User Information')}</h3>
      <dl>
        <div>
          <dt><span>${this._('Username: ').replace(':', '')}</span></dt>
          <dd>${this._userInfo?.name}</dd>
        </div>
        <div>
          <dt><span>${this._('User group')}</span></dt>
          <dd>${this._(userRoles[this._userInfo?.role])}</dd>
        </div>
      </dl>
      <div style="clear: both;"></div>

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

  renderSysInfo() {
    return html`
      <h3>${this._('System Information')}</h3>

      <grampsjs-sysinfo
        .data="${this.dbInfo}"
        .appState="${this.appState}"
        .userInfo="${this._userInfo}"
      ></grampsjs-sysinfo>
      <h3>${this._('Tree Information')}</h3>
      <p class="small">ID: <span class="monospace">${
        this.appState.auth.claims.tree
      }</a></p>

      `
  }

  renderChangeEmail() {
    return html`
      <p>
        <mwc-textfield
          id="change-email"
          label="${this._('New E-mail')}"
          value="${this._userInfo?.email ? this._userInfo.email : ''}"
        >
        </mwc-textfield>
      </p>
      <p>
        <mwc-button
          outlined
          label="${this._('Submit')}"
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
          label="${this._('Submit')}"
          @click="${this._changePw}"
        ></mwc-button>
      </p>
    `
  }

  async _changeEmail() {
    const form = this.shadowRoot.getElementById('change-email')
    if (!form.value) {
      return
    }
    this.loading = true
    const payload = {email: form.value}
    const data = await this.appState.apiPut('/api/users/-/', payload)

    this.loading = false
    if ('error' in data) {
      this.error = false
      this.error = true
      this._errorMessage = data.error
      return
    }
    fireEvent(this, 'grampsjs:notification', {
      message: 'E-mail successfully updated',
    })

    form.value = ''

    await this._fetchOwnUserDetails()
    form.value = this._userInfo.email
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
    this.appState
      .apiPost('/api/users/-/password/change', payload)
      .then(data => {
        this.loading = false
        if ('error' in data) {
          this.error = true
          this._errorMessage = data.error
        } else {
          this.error = false
          fireEvent(this, 'grampsjs:notification', {
            message: 'Password successfully updated',
          })
          formOldPw.value = ''
          formNewPw.value = ''
        }
      })
  }

  async _fetchOwnUserDetails() {
    const data = await this.appState.apiGet('/api/users/-/')
    if ('error' in data) {
      this.error = true
      this._errorMessage = data.error
    } else {
      this.error = false
      this._userInfo = data.data
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this._fetchOwnUserDetails()
  }
}

window.customElements.define('grampsjs-view-settings', GrampsjsViewSettings)
