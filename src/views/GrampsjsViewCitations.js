/*
Citations list view
*/

import {GrampsjsViewObjectsBase} from './GrampsjsViewObjectsBase.js'
import {prettyTimeDiffTimestamp} from '../util.js'

export class GrampsjsViewCitations extends GrampsjsViewObjectsBase {
  constructor() {
    super()
    this._columns = {
      grampsId: {title: 'Gramps ID', sort: 'gramps_id'},
      sourceTitle: {title: 'Source: Title', sort: ''},
      change: {title: 'Last changed', sort: 'change'},
    }
  }

  // eslint-disable-next-line class-methods-use-this
  get _fetchUrl() {
    return '/api/citations/?extend=source_handle&keys=gramps_id,extended,change'
  }

  // eslint-disable-next-line class-methods-use-this
  _getItemPath(item) {
    return `citation/${item.grampsId}`
  }

  // eslint-disable-next-line class-methods-use-this
  _getAddPath() {
    return 'new_citation'
  }

  // eslint-disable-next-line class-methods-use-this
  _formatRow(row) {
    const formattedRow = {
      grampsId: row.gramps_id,
      sourceTitle: row.extended.source?.title,
      change: prettyTimeDiffTimestamp(row.change, this.strings.__lang__),
    }
    return formattedRow
  }
}

window.customElements.define('grampsjs-view-citations', GrampsjsViewCitations)
