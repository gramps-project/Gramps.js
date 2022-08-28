import {html} from 'lit'

import {GrampsjsViewObject} from './GrampsjsViewObject.js'
import '../components/GrampsjsPerson.js'

export class GrampsjsViewPerson extends GrampsjsViewObject {
  static get properties() {
    return {
      homePersonDetails: {type: Object},
    }
  }

  constructor() {
    super()
    this.homePersonDetails = {}
    this._className = 'person'
  }

  getUrl() {
    return `/api/people/?gramps_id=${this.grampsId}&locale=${
      this.strings?.__lang__ || 'en'
    }&profile=all&backlinks=true&extend=all`
  }

  renderElement() {
    return html`
      <grampsjs-person
        .data=${this._data}
        .strings=${this.strings}
        .homePersonDetails=${this.homePersonDetails}
        ?edit="${this.edit}"
        ?canEdit="${this.canEdit}"
      ></grampsjs-person>
    `
  }
}

window.customElements.define('grampsjs-view-person', GrampsjsViewPerson)
