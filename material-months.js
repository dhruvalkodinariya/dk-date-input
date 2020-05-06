import { LitElement, html ,css} from 'lit-element';
import {repeat} from 'lit-html/directives/repeat';
import moment from 'moment/src/moment.js';

export class MaterialMonths extends LitElement {

  static get styles(){
    return[
      css`
        :host {
          display: block;
        }
        .month-container{
          padding: 4px 20px 8px 12px;
          display:flex;
          flex-wrap:wrap;
          max-height:228px;
          overflow-y:auto;
          box-sizing:border-box;
        }
        .month{
          width:69.33px;
          height:57px;
          display:flex;
          justify-content:center;
          align-items:center;
          cursor:pointer;
          color:var(--mdc-theme-text-primary);
        }
        .month span{
          width:69.33px;
          height:40px;
          display:flex;
          justify-content:center;
          align-items:center;
        }
        .active-month{
          background-color:var(--mdc-theme-primary);
          border-radius:26px;
          color:var(--mdc-theme-on-primary)
        }

        ::-webkit-scrollbar {
          width: 6px;
        }

        /* Track */
        ::-webkit-scrollbar-track {
          border-radius: 3px;
        }
        
        /* Handle */
        ::-webkit-scrollbar-thumb {
          background: #979797; 
          border-radius: 10px;
        }

        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
          background: #979797; 
        }
        `
    ]
  }

  render() {
    return html`
      <div class="month-container" id="scroller">
        ${repeat(this.months,(month)=>month,(month, index)=>{
          return html`
          <div class="month" data-month="${index}" @click="${this._onSelectMonth}">
            <span class="${this.months[this.month] == month ? 'active-month' : ''}">${month.slice(0,3)}</span>
          </div>`
        })}
      </div>
    `;
  }

  static get properties() {
    return {
      months: { type: Array },
      month: { type: Number },
    };
  }
  
  _onSelectMonth(e){
    let month = e.currentTarget.dataset['month'];
    this.dispatchEvent(new CustomEvent('month-select',{
      detail: { month : month },
      bubbles: true,
      composed: true
    }))
  }
}
customElements.define('material-months', MaterialMonths);