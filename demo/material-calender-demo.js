import { LitElement, html ,css} from 'lit-element';
import '../material-calender';
import '../dk-date-picker';
import {Theme} from '@dhruval/material-styles/theme';
import {Typography} from '@dhruval/material-styles/typography';
export class MaterialCalenderDemo extends LitElement {
  static get styles(){
    return[
      Theme,
      Typography,
      css`
        :host{
          display:block;
        }
        .main-container{
          flex:1;
          display:flex;
          flex-direction:column;
          padding: 14px;
          align-items:center;
        }
        span.body1{
          color: var(--mdc-theme-on-surface);
        }
    `]
  }
  render() {
    return html`
    <div class="main-container">
      <material-calender @value-changed="${(e)=>{console.log(e.detail.value)}}"></material-calender>
      <!-- <material-calender @value-changed="${(e)=>{console.log(e.detail.value)}}"></material-calender> -->
    </div>
    <div class="main-container">
      <div>
        <span class="body1">Normal - no Label</span>
      </div>
      <dk-date-picker></dk-date-picker>
      <div>
        <span class="body1">Required*</span>
      </div>
      <dk-date-picker label="Expire date" required></dk-date-picker>
      <div>
        <span class="body1">Min date (06/10/2020)</span>
      </div>
      <dk-date-picker label="Date" outlined minDate="06/10/2020"></dk-date-picker>
      <div>
        <span class="body1">Max date (03/25/2020)</span>
      </div>
      <dk-date-picker label="Date" shapedFilled maxDate="03/25/2020"></dk-date-picker>
      <div>
        <span class="body1">Min date - Max date</span><br>
        <span class="body1">(05/15/2020 - 05/25/2020)</span>
      </div>
      <dk-date-picker label="Date" minDate="05/15/2020" maxDate="05/25/2020"></dk-date-picker>
      <div>
        <span class="body1">Disabled</span>
      </div>
      <dk-date-picker disabled></dk-date-picker>
      <div>
        <span class="body1">Prefilled</span>
      </div>
      <dk-date-picker label="Date" value="07/29/1997" shapedLeft outlined></dk-date-picker>
      <div>
        <span class="body1">Custom format (DD/MM/YYYY)</span>
      </div>
      <dk-date-picker label="Date" inputFormat="dd-mm-yyyy" shapedRight outlined></dk-date-picker>
      <div>
        <span class="body1">Invalid</span>
      </div>
      <dk-date-picker label="Date" value="20/15/2020" mobile-mode shapedLeft shapedRight outlined></dk-date-picker>
    </div>
    `;
  }
}
customElements.define('material-calender-demo', MaterialCalenderDemo);