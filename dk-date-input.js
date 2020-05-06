import { DkInput } from '@dhruval/dk-input/dk-input';
import moment from 'moment';
  
export class DkDateInput extends DkInput {

  static get properties() {
    return {
      /**
       * Prefered date input format  
       * It should be `dd/mm/yyyy` or `mm/dd/yyyy` or `dd-mm-yyyy` or `mm-dd-yyyy`
       */
      inputFormat: { type: String },

      /**
       * The minimum allowed date (inclusively).
       */
      minDate: { type: String },

      /**
       * The maximum allowed date (inclusively).
       */
      maxDate: { type: String },

      /**
       * Date separator. Possible value: `/` or  `-`
       */
      _separator: { type: String },
    };
  }

  constructor() {
    super();
    this.iconTrailing = "event";
    this.allowedPattern = '[0-9/-]';
    this.clickableIcon = true;
    this.validator = this._customValidator;
    this.inputFormat = 'mm/dd/yyyy';
    this._separator = '/';
  }

  firstUpdated(changedProps) {
    super.firstUpdated && super.firstUpdated(changedProps);

    if (changedProps.has('inputFormat')) { 
      this._separator = this.inputFormat.slice(2, 3);
    }
  }
  
  parseValue(value) {
    value = value || '';
    value = value.replace(/ /g, '');
    value = value.replace(/-/g, '/');
    value = value.replace(/[\/]+/g, '\/').replace(/^\/*/, '').replace(/\/*$/, '');
    value = value.split('/').slice(0, 3).join('/');
    
    if(!value && value !== '0'){
      return '';
    }
    
    let places = this._createPlaces(value);
    places = this._fillEmptyPlaces(places, this.inputFormat.replace(/-/g, '/'));
    
    let formattedDate = places.join(`${this._separator}`);
    
    return formattedDate;
  }

  /**
   * Performs date validations like required, minDate, maxDate, invalid
   * @param {String} value - date entered by value
   * @returns {Boolean} returns false if it's invalid
   */
  _customValidator(value) {
    if (!value) { 
      return true;
    }

    value = value.replace(/ /g, '');

    if (!value && !this.required) { 
      return true;
    }
    
    if (!moment(value, this.inputFormat.toUpperCase(), true).isValid()) { 
      return false;
    }

    
    
    if(this.maxDate && this.minDate){
      // let isInputGreater = moment(value).isAfter(this.maxDate);
      // let isInputLower = moment(value).isBefore(this.minDate);
      
      let isInputGreater = moment(value, this.inputFormat.toUpperCase(), true).isAfter(moment(this.maxDate, this.inputFormat.toUpperCase(), true));
      let isInputLower = moment(value, this.inputFormat.toUpperCase(), true).isBefore(moment(this.minDate, this.inputFormat.toUpperCase(), true));
  
      return !(isInputLower || isInputGreater);
    }
    
    if(this.maxDate){
      // return moment(value).isSameOrBefore(this.maxDate);
      return moment(value, this.inputFormat.toUpperCase(), true).isSameOrBefore(moment(this.maxDate, this.inputFormat.toUpperCase(), true));
    }
    
    if(this.minDate){
      // return moment(value).isSameOrAfter(this.minDate);
      return moment(value, this.inputFormat.toUpperCase(), true).isSameOrAfter(moment(this.minDate, this.inputFormat.toUpperCase(), true));
    }

    return true;
  }

  
  /**
   * used to create places for day, month and year
   * 
   * @param {String} - value represent formated text
   * @param {Array} - Array that now have places for day, month and year
   */
  _createPlaces(value, format) {
    let place1, place2, place3;
    let splits = value.split('/');
    let countSlash = splits.length - 1;

    if(!countSlash){
      place1 = value.slice(0, 2);
      place2 = value.slice(2, 4);
      place3 = value.slice(4, 8);
    }else if(countSlash === 1){
      place1 = splits[0].slice(0, 2);
      place2 = splits[1].slice(0, 2);
      place3 = splits[1].slice(2, 6);
    }else {
      place1 = splits[0].slice(0, 2);
      place2 = splits[1].slice(0, 2);
      place3 = splits[2].slice(0, 4);
    }
    
    return [place1, place2, place3];
  }
  
  /**
   * used to set places that are empty or contain only zeros &
   * uses `_pad` method to put prefix '0' in value of place[1] and place[2] if there value's length lessthan 2 
   *
   * @param {Array} places - represent `dateArray`
   * @param {String} format - represent `_inputFormat` property
   * @return {Array} places - represent `dateArray` with filled places
   */
  _fillEmptyPlaces(places, format){
    let isMonthFirst = format.toUpperCase() === "MM/DD/YYYY"? true : false;
    let day = moment().format('DD');
    let month = moment().format('MM');
    let year = moment().format('YYYY');
    
    if(!parseInt(places[0])){
      places[0] = isMonthFirst ? month : day;
    }
    if(!parseInt(places[1])){
      places[1] = isMonthFirst ? day : month;
    }
    if(!parseInt(places[2])){
      places[2] = year;
    }
    
    places[0] = this._pad(places[0]);
    places[1] = this._pad(places[1]);
    
    if(places[2] < 1000){
      places[2] = 2000 + parseInt(places[2]);
    }
    
    return places; 
  }
  
  /**
   * used to set zero as prefix in value store in  number letiable,
   * otherwise keep number's value as it is & return it
   * 
   * @param {String} number 
   * @return {String} number
   */
  _pad(number){
    number = number.length < 2 ? ("0" + number) : number;
    return number;
  }

}

window.customElements.define('dk-date-input', DkDateInput);