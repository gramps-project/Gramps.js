import {html, css} from 'lit'

import '@material/mwc-icon'

import {GrampsjsObject} from './GrampsjsObject.js'
import './GrampsjsNoteContent.js'
import './GrampsjsEditor.js'
import './GrampsjsFormEditNoteType.js'
import {fireEvent} from '../util.js'

export class GrampsjsNote extends GrampsjsObject {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
        }
      `,
    ]
  }

  renderProfile() {
    return html`
      <h2>
        <mwc-icon class="person">sticky_note_2</mwc-icon> ${this._(
          this.data?.type || 'Note'
        )}
        ${this.edit
          ? html`
              <mwc-icon-button
                icon="edit"
                class="edit"
                @click="${this._handleEditType}"
              ></mwc-icon-button>
            `
          : ''}
      </h2>

      ${this.edit
        ? html` <grampsjs-editor
            .data=${this.data.text}
            .strings=${this.strings}
          ></grampsjs-editor>`
        : html` <grampsjs-note-content
            framed
            grampsId="${this.data.gramps_id}"
            content="${this.data?.formatted?.html ||
            this.data?.text?.string ||
            'Error loading note'}"
          ></grampsjs-note-content>`}
    `
  }

  _handleEditType() {
    this.dialogContent = html`
      <grampsjs-form-edit-note-type
        @object:save="${this._handleSaveType}"
        @object:cancel="${this._handleCancelDialog}"
        .strings=${this.strings}
        .data=${{type: this.data?.type || ''}}
        prop="value"
      >
      </grampsjs-form-edit-note-type>
    `
  }

  _handleSaveType(e) {
    fireEvent(this, 'edit:action', {
      action: 'updateProp',
      data: e.detail.data,
    })
    e.preventDefault()
    e.stopPropagation()
    this.dialogContent = ''
  }
}

window.customElements.define('grampsjs-note', GrampsjsNote)
