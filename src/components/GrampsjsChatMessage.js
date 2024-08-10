import {html, css, LitElement} from 'lit'
import {classMap} from 'lit/directives/class-map.js'
import '@material/web/icon/icon.js'
import {mdiRobotOutline} from '@mdi/js'

import {sharedStyles} from '../SharedStyles.js'
import {GrampsjsTranslateMixin} from '../mixins/GrampsjsTranslateMixin.js'
import {renderIconSvg} from '../icons.js'

class GrampsjsChatMessage extends GrampsjsTranslateMixin(LitElement) {
  static get styles() {
    return [
      sharedStyles,
      css`
        .container {
          margin: 15px 0;
          font-size: 16px;
          line-height: 26px;
          font-weight: 340;
          clear: right;
          max-width: 90%;
          display: flex;
          align-items: flex-start;
        }
        .container.human {
          background-color: rgba(109, 76, 65, 0.12);
          color: rgba(27, 19, 16);
          padding: 10px 20px;
          border-radius: 16px;
          float: right;
          max-width: 70%;
          margin-right: 10px;
        }

        .slot-wrap {
          white-space: pre-wrap;
          flex-grow: 1;
          overflow: hidden;
        }

        .avatar {
          width: 35px;
          height: 35px;
          flex-shrink: 0;
        }

        .avatar md-icon {
          --md-icon-size: 20px;
          position: relative;
          top: 1px;
        }
      `,
    ]
  }

  static get properties() {
    return {
      type: {type: String},
    }
  }

  constructor() {
    super()
    this.type = 'human'
  }

  render() {
    return html`
      <div
        class="${classMap({
          container: true,
          human: this.type === 'human',
          ai: this.type === 'ai',
        })}"
      >
        ${this.type === 'ai'
          ? html`
              <div class="avatar">
                <md-icon>${renderIconSvg(mdiRobotOutline, '#999')}</md-icon>
              </div>
            `
          : ''}
        <!-- prettier-ignore -->
        <div class="slot-wrap"><slot></slot></div>
      </div>
    `
  }
}

window.customElements.define('grampsjs-chat-message', GrampsjsChatMessage)
