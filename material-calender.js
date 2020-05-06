import { LitElement, html ,css} from 'lit-element';
import {Typography} from '@dhruval/material-styles/typography';
import {shadow} from '@dhruval/material-styles/shadow';
import '@dhruval/dk-icon/dk-icon';
import moment from 'moment/src/moment.js';
import './material-dates';
import './material-months';
import './material-years';
export class MaterialCalender extends LitElement {

  static get styles(){
    return[
      Typography,
      shadow,
      css`
        :host{
          display:block;
          background-color:var(--mdc-theme-disabled-field-background);
          width:256px;
          height:364px;
          
        }
        .main-container{
          display:flex;
          flex-direction:column;
        }
        .selector-container{
          flex:1;
          display:flex;
          padding:16px 8px 12px 24px;
          align-items:center;
        }
        .selector-container .arrow-container{
          display:flex;
          align-items:center;
          flex:1;
          justify-content:flex-end;
        }
        .selector-container .arrow-container dk-icon + dk-icon{
          margin-left:24px;
        }

        .selector-container .arrow-container dk-icon{
          cursor: pointer;
        }

        .year-selector{
          display:flex;
          align-items:center;
          cursor: pointer;
        }

        .year-selector span{
          color:var(--mdc-theme-text-primary); 
        }

        :host([year-select]) .selector-container{
          box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.2), 
                      0px 0px 0px 0px rgba(0, 0, 0, 0.14), 
                      0px 2px 2px 0px rgba(0, 0, 0, 0.12);
        }

        :host([month-select]) .selector-container{
          box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.2), 
                      0px 0px 0px 0px rgba(0, 0, 0, 0.14), 
                      0px 2px 2px 0px rgba(0, 0, 0, 0.12);
        }

        .date-view-container{
          height: 80px;
          background-color: var(--mdc-theme-primary);
          padding:10px 8px 10px 16px;
          display:flex;
          flex-direction:column;
          justify-content:flex-end;
          box-sizing:border-box;
          color: var(--mdc-theme-on-primary);
        }
      `
    ]
  }
  render() {
    return html`
      <div class="main-container body2">
        <div class="date-view-container">
          <div class="year body1">${new Date(this.value).getFullYear()}</div>
          <div class="headline5">${this._formatSelectedDate()}</div>
        </div>
        <div class="selector-container">
          <div class="year-selector" @click="${this._yearSelect}">
            <span>${this.year}</span>
            ${!this.yearSelect ? html`
            <dk-icon name="arrow_drop_down"></dk-icon>
            `:html`
            <dk-icon name="arrow_drop_up"></dk-icon>
            `}
          </div>
          <div class="year-selector" @click="${this._monthSelect}">
            <span>${this.monthList[this.month]}</span>
            ${!this.monthSelect ? html`
            <dk-icon name="arrow_drop_down"></dk-icon>
            `:html`
            <dk-icon name="arrow_drop_up"></dk-icon>
            `}
          </div>
          ${!this.yearSelect ? html`
          <div class="arrow-container">
            <dk-icon name="keyboard_arrow_left" @click="${this._getPrevMonth}"></dk-icon>
            <dk-icon name="keyboard_arrow_right" @click="${this._getNextMonth}"></dk-icon>
          </div>`:html``}
        </div>
        <div class="page-container">
           
           ${this.yearSelect ? 
              html`<material-years .year="${this.year}" @year-select="${this._onYearSelect}"></material-years>` : 
              this.monthSelect ? html`
              <material-months .months="${this.monthList}" .month="${this.month}" @month-select="${this._onMonthSelect}"></material-months>` : 
              html`
                <material-dates .month="${this.month}" .year="${this.year}" .value="${this.value}" @date-select="${this._onDateSelect}"></material-dates>
            `}
          
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      value: { type: String },
      month: { type: Number },
      year: { type: Number },
      yearSelect: { type: Boolean ,reflect:true,attribute:"year-select"},
      monthSelect: { type: Boolean ,reflect:true,attribute:"month-select"},
    };
  }

  set value(value){
    let oldValue = this._value;
    if(value == oldValue){
      return;
    }
    if(value == undefined){
      return;
    }
    
    if(!moment(value,"YYYY-MM-DD",true).isValid()){
      return;
    }
    this._setSelectedValues(value);
    this._value = value;
    this.requestUpdate('value', oldValue);
  }

  get value(){
    return this._value;
  }

  constructor(){
    super();
    this.value = moment().format('YYYY-MM-DD');
    this.monthList = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    this.yearSelect = false;
  }

  _setSelectedValues(value){
    this.month = new Date(value).getMonth();
    this.year = new Date(value).getFullYear();
  }

  _formatDate(){
    let selMon = this.monthList[this.month];
    let selYear = moment(this.value,"MM/DD/YYYY",true).format('YYYY');
    return selMon+" "+this.year;
  }

  _getNextMonth(){
    if(this.month == 11){
      this.month = 0;
      this.year = parseInt(this.year) + 1;
      return;
    }
    this.month = parseInt(this.month) + 1;
    
  }

  _getPrevMonth(){
    if(this.month == 0){
      this.month = 11;
      this.year = parseInt(this.year) - 1;
      return;
    }
    this.month = parseInt(this.month) - 1;
  }

  _yearSelect(){
    this.yearSelect = !this.yearSelect;
    if(this.monthSelect)
      this.monthSelect = false;
  }

  _monthSelect(){
    this.monthSelect = !this.monthSelect;
    if(this.yearSelect)
      this.yearSelect = false;
  }

  _onYearSelect(e){
    this.year = parseInt(e.detail.year);
    this.yearSelect = false;
  }

  _onMonthSelect(e){
    this.month = parseInt(e.detail.month);
    this.monthSelect = false;
  }

  _onDateSelect(e){
    let selDate = this._zeroFill(e.detail.date);
    let selMonth = this._zeroFill(parseInt(this.month) + 1);
    let selValue = `${selMonth}/${selDate}/${this.year}`;
    this.value = moment(new Date(selValue).toISOString()).format('YYYY-MM-DD');
    this.dispatchEvent(new CustomEvent('value-changed',{
      detail: { value: this._value },
      bubbles: true,
      composed: true
    }));
  }

  _zeroFill(val){
    return val < 9 ? "0" + val : val;
  }

  _isChanged(val1, val2){
    if(val1.getTime()===val2.getTime()){
      return true;
    }
    return false;
  }

  _formatSelectedDate(){
    let format = moment(this.value).format('ddd, MMM DD');
    return format;
  }
  
}
customElements.define('material-calender', MaterialCalender);