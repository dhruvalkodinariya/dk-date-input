import { html, css } from 'lit-element';
import { DkOverlayBehavior } from './dk-overlay-behavior';

export class DkOverlayElement extends DkOverlayBehavior {
  static get styles(){
    return [
      super.styles,
      css`
        :host {
          display: none;
          box-sizing: border-box;
          background: var(--mdc-theme-background,#ffffff);
          flex-direction: column;
          -ms-flex-direction: column;
          -webkit-flex-direction: column;
          outline: none;
          z-index: 100;
          width:fit-content;
        }

        :host([opened]) {
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
        }

        :host([opened][mobile-mode]) {
          animation: slideInUp 0.2s forwards;
        }

        :host(:not([mobile-mode])[opened]) {
          -webkit-animation-name: fadeIn;
          animation-name: fadeIn;
          -moz-animation-name: fadeIn;
          -o-animation-name: fadeIn;
          -webkit-animation-duration: 200ms;
          animation-duration: 200ms;
          animation-timing-function: ease-in-out;
          -webkit-animation-timing-function: ease-in-out;
          -moz-animation-timing-function: ease-in-out;
          -o-animation-timing-function: ease-in-out;
          animation-fill-mode: forwards;
          -webkit-animation-fill-mode: forwards;
          -moz-animation-fill-mode: forwards;
          -o-animation-fill-mode: forwards;
        }

        @keyframes slideInUp {
          from {
            transform: translate3d(0, 100%, 0);
          }

          to {
            transform: translate3d(0, 0, 0);
          }
        }

        @-webkit-keyframes fadeIn {
          0% {opacity: 0;}
          100% {opacity: 1;}
        }
        @keyframes fadeIn {
          0% {opacity: 0;}
          100% {opacity: 1;}
        }

        :host([mobile-mode]) {
          margin: 0 auto;
        }

        :host([mobile-mode]) {
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }
        :host([mobile-mode][full-height]) {
          /* width: 100%; */
          border-top-left-radius: 0;
          border-top-right-radius: 0;
        }
      `
    ];
  }

  static get properties() {
    return {
      /**
       * Input + Output property. True if the dropdown is open, false otherwise.
       */
      opened: { type: Boolean, reflect: true },
/**
       * Input property. Display multiselect in mobile mode (full screen) and no keyboard support
       * Default value: false
       */
      mobileMode: { type: Boolean, reflect: true, attribute: 'mobile-mode' },
    };
  }

  constructor(){
    super();
    this.opened = false;
    this.mobileMode = false;
    this._resize = this.debounce(() => {
      this.refit();
    }, 500);
  }

  render() {
    return html`
      <slot></slot>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    if(!this.opened) {
      return;
    }

    this._refitPending = true;
    this.updateComplete.then((result) => {
      if(this._refitPending && result && this.opened) {
        this.refit();
      }
      this._refitPending = false;
    });
  }

  shouldUpdate(changedProps) {
    super.shouldUpdate(changedProps);
    
    let openedChanged = changedProps.has('opened')

    if(this.opened){
      if(openedChanged) {
        this._onOpened();
      }
    }

    if(!this.opened && openedChanged) {
      this._onClosed();
    }
    return openedChanged || this.opened;
  }

  updated(changedProps){
    super.updated(changedProps);
    
    if(changedProps.has('opened') && (this.opened || changedProps.get('opened')) && changedProps.get('opened') !== this.opened) {
      this._triggerOpenedChange();
    }

    if(this.opened && changedProps.has('opened')) {
      this._refitPending = false;
      this.refit();
      
      if(this.mobileMode){
        setTimeout(() => {
          this.refit();
        });
      }
    }
  }

  // open() {
  //   if(this.opened){
  //     return;
  //   }
  //   this.opened = true;
  // }

  close() {
    if(!this.opened){
      return;
    }
    this.opened = false;
  }

  _triggerOpenedChange() {
    let openedChangeEvent = new CustomEvent('opened-changed', {
      detail: {
        opened: this.opened
      },
      bubbles:true,
      composed: true
    });
    this.dispatchEvent(openedChangeEvent);
  }

  _addResizeEventListeners(){
    this._removeResizeEventListeners();
    window.addEventListener('resize', this._resize);
  }

  _removeResizeEventListeners(){
    window.removeEventListener('resize', this._resize);
  }

  debounce(func, delay) {
    let debounceTimer;

    return function() { 
    let context = this;
    let args = arguments;
       clearTimeout(debounceTimer) 
       debounceTimer  = setTimeout(() => func.apply(context, args), delay) 
    } 
  };

  _onOpened() {
    super._onOpened();
    this._addResizeEventListeners();
  }

  _onClosed() {
    super._onClosed();
    this._removeResizeEventListeners();
  }

}
customElements.define('dk-overlay-element', DkOverlayElement);