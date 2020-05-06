import { LitElement, html ,css} from 'lit-element';
import {repeat} from 'lit-html/directives/repeat';
import moment from 'moment/src/moment.js';
export class MaterialYears extends LitElement {

  static get styles(){
    return[
      css`
        :host {
          display: block;
        }
        .year-container{
          padding: 4px 20px 8px 12px;
          display:flex;
          flex-wrap:wrap;
          max-height:228px;
          overflow-y:auto;
          box-sizing:border-box;
        }
        .year{
          width:52px;
          height:32px;
          display:flex;
          justify-content:center;
          align-items:center;
          cursor:pointer;
          color:var(--mdc-theme-text-primary);
        }
        .year span{
          width:52px;
          height:28px;
          display:flex;
          justify-content:center;
          align-items:center;
        }
        .active-year{
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
      <div class="year-container" id="scroller">
        ${repeat(this.years,(year)=>year,(year, index)=>{
          return html`
          <div class="year" data-year="${year}" @click="${this._onSelectYear}">
            <span class="${this.year == year ? 'active-year' : ''}">${year}</span>
          </div>`
        })}
      </div>
    `;
  }

  static get properties() {
    return {
      years: { type: Array },
      year: { type: Number },
    };
  }

  constructor(){
    super();
    this.years = [];
  }

  updated(changedProp){
    if(changedProp.has('year')){
      this._setYears();
      setTimeout(()=>{
        this.shadowRoot.querySelector('.active-year').scrollIntoView();
      })
      
    }
  }

  _setYears(){
      const years = []
      let dateStart;
      let dateEnd;
      if(this.year > 3000){
        dateStart = moment().year(1000);
        let diff = this.year - 1000;
        dateEnd = moment(dateStart).add(diff, 'y');
      }
      else{
        dateStart = moment().year(1000);
        dateEnd = moment(dateStart).add(2000, 'y');
      }
      
      while (dateEnd.diff(dateStart, 'years') >= 0) {
        years.push(dateStart.format('YYYY'))
        dateStart.add(1, 'year')
      }
      this.years = years;
  }

  _onSelectYear(e){
    let year = e.currentTarget.dataset['year'];
    this.dispatchEvent(new CustomEvent('year-select',{
      detail: { year : year },
      bubbles: true,
      composed: true
    }))
  }
}
customElements.define('material-years', MaterialYears);