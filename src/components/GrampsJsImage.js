/*
An Image thumbnail element.
*/

import {html, css, LitElement} from 'lit'
import {classMap} from 'lit/directives/class-map.js'
import '@material/mwc-icon'

import {sharedStyles} from '../SharedStyles.js'
import {getMediaUrl, getThumbnailUrl, getThumbnailUrlCropped} from '../api.js'

class GrampsjsImg extends LitElement {
  static get styles() {
    return [
      sharedStyles,
      css`
        img {
          max-width: 100%;
          max-height: 100vh;
        }

        .round {
          border-radius: 50%;
        }

        .bordered {
          box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);
        }

        .file-placeholder {
          width: 200px;
          height: 200px;
          background-color: rgba(200, 200, 200, 0.5);
          color: rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          --mdc-icon-size: 130px;
        }
      `,
    ]
  }

  static get properties() {
    return {
      handle: {type: String},
      size: {type: Number},
      rect: {type: Array},
      circle: {type: Boolean},
      square: {type: Boolean},
      mime: {type: String},
      displayHeight: {type: Number},
      border: {type: Boolean},
      radius: {type: Number},
      _error: {type: Boolean},
    }
  }

  constructor() {
    super()
    this.rect = []
    this.circle = false
    this.square = false
    this.mime = ''
    this.displayHeight = 0
    this.border = false
    this.radius = 0
    this._error = false
  }

  _renderImageFull() {
    const height = this.displayHeight || ''
    return html`
      <img
        src="${getMediaUrl(this.handle)}"
        class=${classMap({round: this.circle, bordered: this.border})}
        @error=${this._errorHandler}
        alt=""
        height="${height}"
        style="${this.circle ? '' : `border-radius:${this.radius}px`}"
      />
    `
  }

  async reload() {
    if (this.mime.startsWith('image')) {
      // reload full image if present
      this._reloadImageUrl(getMediaUrl(this.handle))
      // reload thumbnail if present
      this._reloadImageUrl(
        getThumbnailUrl(this.handle, 3 * this.size, this.square)
      )
    }
  }

  async _reloadImageUrl(url) {
    await fetch(url, {cache: 'reload', mode: 'no-cors'})
    this.renderRoot.querySelectorAll(`img[src='${url}']`).forEach(img => {
      // eslint-disable-next-line no-param-reassign
      img.src = url
    })
  }

  getBBox() {
    const img = this.shadowRoot.querySelector('img')
    if (img === null) {
      return null
    }
    return img.getBoundingClientRect()
  }

  _renderImage() {
    const height = this.displayHeight || ''
    return html`
      <img
        srcset="
          ${getThumbnailUrl(this.handle, this.size, this.square)},
          ${getThumbnailUrl(this.handle, 1.5 * this.size, this.square)} 1.5x,
          ${getThumbnailUrl(this.handle, 2 * this.size, this.square)} 2x,
          ${getThumbnailUrl(this.handle, 3 * this.size, this.square)} 3x
        "
        src="${getThumbnailUrl(this.handle, 3 * this.size, this.square)}"
        class=${classMap({round: this.circle, bordered: this.border})}
        @error=${this._errorHandler}
        alt=""
        style="${this.circle ? '' : `border-radius:${this.radius}px`}"
        height="${height}"
      />
    `
  }

  _renderImageCropped() {
    const height = this.displayHeight || ''
    return html`<img
      srcset="
        ${getThumbnailUrlCropped(
          this.handle,
          this.rect,
          this.size,
          this.square
        )},
        ${getThumbnailUrlCropped(
          this.handle,
          this.rect,
          1.5 * this.size,
          this.square
        )} 1.5x,
        ${getThumbnailUrlCropped(
          this.handle,
          this.rect,
          2 * this.size,
          this.square
        )} 2x,
        ${getThumbnailUrlCropped(
          this.handle,
          this.rect,
          3 * this.size,
          this.square
        )} 3x
      "
      src="${getThumbnailUrlCropped(
        this.handle,
        this.rect,
        3 * this.size,
        this.square
      )}"
      class="${this.circle ? 'round' : ''}"
      style="${this.circle ? '' : `border-radius:${this.radius}px`}"
      @error=${this._errorHandler}
      alt=""
      height="${height}"
    />`
  }

  render() {
    if (this._error) {
      return html`<slot></slot>`
    }
    if (this.mime.startsWith('audio')) {
      if (this.displayHeight > 0) {
        return html`
        <div class="file-placeholder">
          <mwc-icon>audio_file<mwc-icon>
        </div>`
      }
      return this._renderAudio()
    }
    if (this.mime.startsWith('video')) {
      return this._renderVideo()
    }
    if (
      this.mime !== '' &&
      !this.mime.startsWith('image') &&
      this.mime !== 'application/pdf'
    ) {
      return html`
      <div class="file-placeholder">
        <mwc-icon>insert_drive_file<mwc-icon>
      </div>`
    }
    return this.size === 0 ? this._renderFull() : this._renderThumb()
  }

  _renderAudio() {
    return html`
      <audio controls>
        <source src="${getMediaUrl(this.handle)}" type="${this.mime}" />
        Your browser does not support the audio element.
      </audio>
    `
  }

  _renderVideo() {
    return html`
      <video
        ?controls=${this.displayHeight === 0}
        height="${this.displayHeight > 0 ? this.displayHeight : 'auto'}"
      >
        <source src="${getMediaUrl(this.handle)}" type="${this.mime}" />
        Your browser does not support the video element.
      </video>
    `
  }

  _renderThumb() {
    return this.rect.length === 0
      ? this._renderImage()
      : this._renderImageCropped()
  }

  _renderFull() {
    return this.rect.length === 0
      ? this._renderImageFull()
      : this._renderImageFull()
  }

  _errorHandler() {
    this._error = true
  }
}

window.customElements.define('grampsjs-img', GrampsjsImg)
