import {html, css} from 'lit'

import '@material/mwc-icon'

import {GrampsjsObject} from './GrampsjsObject.js'
import './GrampsjsNoteContent.js'
import './GrampsjsEditor.js'

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
}

window.customElements.define('grampsjs-note', GrampsjsNote)
