import { LitElement, html ,css} from 'lit-element';
import './dk-date-input';
import './material-calender';
import './dk-overlay';
import moment from 'moment';

export class DkDatePicker extends LitElement {

  static get styles(){
    return[
      css`
        :host {
          display: block;
          --dk-input-width:200px;
        }
    `]
  }

  static get properties() {
    return {
      opened: { type: Boolean, reflect: true },
      mobileMode: { type: Boolean, reflect: true, attribute: 'mobile-mode' },
      withBackDrop: Boolean,
      name: { type: String },
      value: { type: String },
      label: { type:String },
      placeholder: { type:String },
      minDate: { type: String },
      maxDate: { type: String },
      inputFormat: { type: String },
      errorMessagesByState: { type: Object },
      shapedFilled: { type: Boolean},
      shapedLeft: { type: Boolean},
      shapedRight: { type: Boolean},
      outlined: { type: Boolean },
      autoSelect: { type: Boolean },
      invalid: { type: Boolean },
      disabled: { type: Boolean },
      readOnly: { type: Boolean },
      required: { type: Boolean },
      helperText: { type: String },
      hintPersistent: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.opened = false;
    this.mobileMode = false;
    this.hAlign = 'left';
    this.vAlign = 'bottom';
    this.readOnly = false;
    this.withBackDrop = false;
    this._positionTarget = "#dateInput";
    this.label = '';
    this.placeholder = '';
    this.inputFormat = 'mm/dd/yyyy';
    this.required = false;
    this.readOnly = false;
    this.invalid = false;
    this.disabled = false;
    this.autoSelect = false;
    this.hintPersistent = false;
    
    this.errorMessagesByState = {
      REQUIRED: 'Required',
      MIN_DATE: 'Date must be > {minDate}',
      MAX_DATE: 'Date must be < {maxDate}',
      MIN_MAX_DATE: 'Date must be between {minDate} and {maxDate}',
      INVALID_DATE: 'Date is invalid'
    };
  }

  set inputFormat(value){
    let oldValue = this._inputFormat;
    if(value == oldValue){
      return;
    }
    
    this.placeholder = value;
    this._inputFormat = value;
    this.requestUpdate('inputFormat', oldValue);
  }

  get inputFormat(){
    return this._inputFormat;
  }

  render() {
    return html`
      <dk-date-input 
        id="dateInput"
        label="${this.label}"
        .placeholder="${this.placeholder}"
        .value="${this.value}"
        .outlined="${this.outlined}"
        .shapedFilled="${this.shapedFilled}"
        .shapedLeft="${this.shapedLeft}"
        .shapedRight="${this.shapedRight}"
        .autoSelect="${this.autoSelect}"
        .required="${this.required}"
        .readOnly="${this.readOnly}"
        .disabled="${this.disabled}"
        .helperText="${this.helperText}"
        .hintPersistent="${this.hintPersistent}"
        .maxDate="${this.maxDate}" 
        .minDate="${this.minDate}"
        .inputFormat="${this.inputFormat}"
        .errorMessage=${this._getErrorMessage(this.value, this.errorMessagesByState)}
        @value-changed="${this._setValue}"
        @icon-click="${this._openDatePicker}">
      </dk-date-input>
      <dk-overlay .targetElement="${this._positionTarget}" .withBackDrop="${this.withBackDrop}" .mobileMode="${this.mobileMode}" @opened-changed="${this._onOpenedChanged}">
        <material-calender @value-changed="${this._onValueChanged}" .value="${this._getSelectedDate(this.value)}"></material-calender>
      </dk-overlay>
    `;
  }

  _openDatePicker(){
    this.shadowRoot.querySelector('dk-overlay').open();
  }

  _onValueChanged(e){
    setTimeout(()=>{
      this.shadowRoot.querySelector('dk-overlay').close();
    })

    let selectedDate = moment(e.detail.value,"YYYY-MM-DD").format(this.inputFormat.toUpperCase());
    this.value = selectedDate;
  }

  _onOpenedChanged(e) {
    if (e.detail && !e.detail.opened) {
      setTimeout(() => {
        this.validate();
      },1);
    }
  }

  _getErrorMessage(value, errorMessage) {
    
    if (!value) {
      return errorMessage['REQUIRED'];
    }

    let errorText;
    value = value.replace(/ /g, '');

    if (!moment(value, this.inputFormat.toUpperCase(), true).isValid()) {
      return errorMessage['INVALID_DATE'];
    }
    
    if (this.minDate && this.maxDate) {
      errorText = errorMessage['MIN_MAX_DATE'];
      errorText = errorText.replace('{maxDate}', this.maxDate);
      errorText = errorText.replace('{minDate}', this.minDate);
      return errorText;
    }

    if (this.minDate) {
      errorText = errorMessage['MIN_DATE'];
      return errorText.replace('{minDate}', this.minDate);
    }

    if (this.maxDate) {
      errorText = errorMessage['MAX_DATE'];
      return errorText.replace('{maxDate}', this.maxDate);
    }
  }

  _isNotChanged(val1, val2){
    if(new Date(val1).getTime()===new Date(val2).getTime()){
      return true;
    }
    return false;
  }


  _getSelectedDate(value){
    if(value !== "" && value !== undefined){
      value = value.replace(/ /g, '');
      return moment(value, this.inputFormat.toUpperCase()).format('YYYY-MM-DD');
    }

  }

  _setValue(e) {
    this.value = e.detail.val;
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: { value: this.value }
    }));
  }

  validate() {
    let el = this.shadowRoot.querySelector('#dateInput');
    let isValid = el.validate();
    this.invalid = !isValid;
    return isValid;
  }

  layout() {
    let el = this.shadowRoot.querySelector('#dateInput');
    el && el.layout();
  }
}
customElements.define('dk-date-picker', DkDatePicker);