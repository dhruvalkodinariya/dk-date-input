import { LitElement, html ,css} from 'lit-element';
import {repeat} from 'lit-html/directives/repeat';
import moment from 'moment/src/moment.js';
export class MaterialDates extends LitElement {

  static get styles(){
    return[
      css`
        :host {
          display: block;
        }
        .month-container{
          padding: 0 16px 8px 16px;
        }
        .days-container,.date-container{
          display:flex;
          flex-wrap:wrap;
        }
        .days-container .day, .date-container .date{
          width:32px;
          height:32px;
          display:flex;
          justify-content:center;
          align-items:center;
        }

        .date-container .date{
          cursor:pointer;
          color:var(--mdc-theme-text-primary);
        }

        .date-container .date span:hover{
          background-color:var(--mdc-theme-text-disabled);
        }

        .days-container .day{
          color:var(--mdc-theme-text-disabled);
        }

        .date-container .date span{
          width:28px;
          height:28px;
          display:flex;
          justify-content:center;
          align-items:center;
          border-radius:50%;
        }
        .today{
          border:1px solid var(--mdc-theme-text-primary);
        }

        .active-date{
          background-color:var(--mdc-theme-primary);
          color:var(--mdc-theme-on-primary);
        }

        .active-date:hover span{
          background-color:var(--mdc-theme-primary);
          color:var(--mdc-theme-on-primary);
        }

        .date.disabled{
          pointer-events:none;
        }
        `
    ]
  }

  render() {
    return html`
      <div class="month-container">
        <div class="days-container">
          <div class="day">S</div>
          <div class="day">M</div>
          <div class="day">T</div>
          <div class="day">W</div>
          <div class="day">T</div>
          <div class="day">F</div>
          <div class="day">S</div>
        </div>
        <div class="date-container">
          ${repeat(this.dates,(date)=>date,(date, index)=>{
            return html`
            <div class="date ${!date.value ? 'disabled' : ''}" data-date="${date.value}" @click="${this._onSelectDate}">
              <span class="${this.selected == date.value ? 'active-date' : ''} ${this.today == date.value ? 'today' : ''}">${date.value}</span>
            </div>`
          })}
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      value: { type: String },
      dates: { type: Array },
      selected: { type: String },
      today: { type: String },
      month: { type: String },
      year: { type: String },
    };
  }

  set value(value){
    let oldValue = this._value;
    if(value === oldValue){
      return;
    }
    
    this._setSelectedValues(value);
    this._value = value;
    this.requestUpdate('value', oldValue);
  }

  get value(){
    return this._value;
  }

  _setSelectedValues(value){
    let date = new Date(value);
    let selDate = date.getDate();
    let selMonth = date.getMonth();
    let selYear = date.getFullYear();
    let curDate = new Date().getDate();
    let curMonth = new Date().getMonth();
    let curYear = new Date().getFullYear();

    var selected = false;
    var today = false;
    
    if(this.month == selMonth && this.year == selYear){
      this.selected = selDate;
      selected = true;
    }
    if(this.month == curMonth && this.year == curYear){
      this.today = curDate;
      today = true;
    }
    if(!selected){
      this.selected = undefined;
    }
    if(!today)
      this.today = undefined;
  }

  constructor(){
    super();
    this.dates = [];
  }

  updated(changedProp){
    if(changedProp.has('month') || changedProp.has('year') || changedProp.has('value')){
      this._setDates();
      this._setSelectedValues(this.value);
    }
  }

  _setDates(){
    var d = new Date(this.value);
    let dates = []
    
    let dateEnd = new Date(this.year,this.month + 1, 0).getDate();
    let prevDates = new Date(this.year,this.month, 0).getDay();
    var i = 0;
    if(prevDates < 6){
      while (i++ <= prevDates) {
        dates.push({value: "", disabled: true})
      }
      i=0;
    }
    
    while (i++ < dateEnd) {
      dates.push({value: i, disabled: false})
    }
    
    this.dates = dates;
  }

  _onSelectDate(e){
    let date = e.currentTarget.dataset['date'];
    if(date){
      this.dispatchEvent(new CustomEvent('date-select',{
        detail: { date : date },
        bubbles: true,
        composed: true
      }))
    }
  }
}
customElements.define('material-dates', MaterialDates);