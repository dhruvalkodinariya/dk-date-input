import { LitElement, html ,css} from 'lit-element';
import './dk-overlay-element';

export class DkOverlay extends LitElement {

  static get styles(){
    return [
      css`
        :host{
          display:block;
        }

        #overlay {
          position: fixed;
          display: none;
          top: 0; right: 0; bottom: 0; left: 0;
          background-color: var(--overlay-color, rgba(0,0,0,0.4));
          overflow: hidden;
          width: 100%; 
          height: 100%;
          z-index: 99;
          cursor: pointer;
        }

        :host([overlay]) #overlay {
          display:block;
        }
      `
    ]
  }

  static get properties() {
    return {
      
      opened: { type: Boolean, reflect: true },
      
      hAlign: String,
      
      vAlign: String,
      
      hOffset: Number,
      
      vOffset: Number,
      
      mobileMode: { type: Boolean, reflect: true, attribute: 'mobile-mode' },

      alwaysFullScreenInMobile: Boolean,

      _positionTarget: Object,

      targetElement:String,

      _overlay: { type: Boolean, reflect: true, attribute: 'overlay' },

      withBackDrop: Boolean
    };
  }

  constructor() {
    super();
    this.opened = false;
    this.mobileMode = false;
    this.withBackDrop = false;
    this.hAlign = 'left';
    this.vAlign = 'bottom';
    this.fullScreen = false;
    this.alwaysFullScreenInMobile=false;
    this._overlay = false;
    this.readOnly = false;
    this.targetElement = "#openBtn";
  }

  render() {
    return html`
      <dk-overlay-element
        .positionTarget=${this._positionTarget}
        .mobileMode=${this.mobileMode}
        .opened=${this.opened}
        .hAlign=${this.hAlign}
        .vAlign=${this.vAlign}
        .hOffset=${this.hOffset}
        .vOffset=${this.vOffset}
        .alwaysFullScreenInMobile="${this.alwaysFullScreenInMobile}"
        @opened-changed=${this._openedChanged}>
        <slot></slot>
      </dk-overlay-element>
      <div id="overlay"></div>
    `;
  }

  updated(changedProps){
    if(changedProps.has('targetElement')){
      if(this.targetElement !== "" && this.targetElement !== undefined){
        this._positionTarget = this.parentNode.querySelector(this.targetElement);
      }
    }
  }

  open() {
    if(this.opened || this.readOnly){
      return;
    }

    this.opened = true;
  }

  close() {
    if(!this.opened){
      return;
    }
    this.opened = false;
  }

  _openedChanged(e) {
    this.opened = e.detail.opened;
    this._setOverlay();
  }

  _setOverlay() {
    let self = this;
    self._overlay = false;
    if(!self.opened) {
      return;
    }
    if(self.mobileMode || self.withBackDrop || !self._positionTarget){
      window.setTimeout(()=> {
        self._overlay = true;
      }, 100);
    }
  }

  
}
customElements.define('dk-overlay', DkOverlay);