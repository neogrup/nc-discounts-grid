import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@neogrup/nc-items-grid/nc-items-grid.js';
import '@neogrup/nc-discount-dialog/nc-discount-dialog.js';

class NcDiscountsGrid extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          --discounts-grid-item-content-border-radius: 5px;
          --discounts-grid-item-content-box-shadow: none;
        }

        nc-items-grid{
          --items-grid-item-content-border-radius: var(--discounts-grid-item-content-border-radius);
          --items-grid-item-content-box-shadow: var(--discounts-grid-item-content-box-shadow);
        }
      </style>


      <nc-items-grid 
          id="itemsGrid" 
          items-grid-data="{{discountsGridData}}" 
          loading="{{itemsGridLoading}}" 
          language="{{language}}" 
          is-paginated
          breadcrumb="[[breadcrumb]]" 
          auto-flow
          item-height="[[heightDiscountsGridItems]]"
          item-width="[[widthDiscountsGridItems]]"
          item-margin="[[marginDiscountsGridItems]]"
          animations="[[animations]]"
          on-item-selected="_discountSelected">
      </nc-items-grid>

      <nc-discount-dialog 
          id="discountDialog" 
          language="{{language}}" 
          show-keyboard="{{showKeyboard}}"
          on-discount-accepted="_discountAccepted">
      </nc-discount-dialog>
    `;
  }

  static get properties() {
    return {
      ticketTotalAmount: Number,
      lineTotalAmount: Number,
      discountIncreasePercent: Number,
      discountsGridData: {
        type: Array,
        value: []
      },
      language: String,
      breadcrumb: {
        type: Boolean,
        value: false
      },
      animations: {
        type: Boolean,
        value: true
      },
      heightDiscountsGridItems: {
        type: Number,
        reflectToAttribute: true
      },
      widthDiscountsGridItems: {
        type: Number,
        reflectToAttribute: true
      },
      marginDiscountsGridItems: {
        type: Number,
        reflectToAttribute: true
      },
      showKeyboard: {
        type: String,
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
  }

  _discountSelected(discount){
    if (discount.detail.variable === 'S'){
      if (discount.detail.kind === "doc"){
        this.openDiscountDialog(discount.detail);
      } else {
        this.dispatchEvent(new CustomEvent('line-variable-discount-selected-previous', {detail: discount.detail, bubbles: true, composed: true }));
      }
    } else{
      switch (discount.detail.kind) {
        case 'doc':
          this.dispatchEvent(new CustomEvent('doc-fix-discount-selected', {detail: {discountData: discount.detail}, bubbles: true, composed: true }));  
          break;
        case 'line':
          this.dispatchEvent(new CustomEvent('line-fix-discount-selected', {detail: {discountData: discount.detail}, bubbles: true, composed: true }));  
          break;
        case 'doc.del':
          this.dispatchEvent(new CustomEvent('doc-del-discount-selected', {detail: {discountData: discount.detail}, bubbles: true, composed: true }));  
          break;
        case 'lin.del':
          this.dispatchEvent(new CustomEvent('line-del-discount-selected', {detail: {discountData: discount.detail}, bubbles: true, composed: true }));  
          break;
      }
    }
  }

  openDiscountDialog(discount){
    this.$.discountDialog.set('discountData', discount);
    this.$.discountDialog.set('discountIncreasePercent', this.discountIncreasePercent);
    if (discount.kind === 'doc'){
      this.$.discountDialog.set('amountToApplyDiscount', this.ticketTotalAmount);
    } else{
      this.$.discountDialog.set('amountToApplyDiscount', this.lineTotalAmount);
    }
    this.$.discountDialog.open();
  }

  _discountAccepted(discount){
    if (discount.detail.discountData.kind === "doc"){
      this.dispatchEvent(new CustomEvent('doc-variable-discount-selected', {detail: discount.detail, bubbles: true, composed: true }));
    } else{
      this.dispatchEvent(new CustomEvent('line-variable-discount-selected', {detail: discount.detail, bubbles: true, composed: true }));
    }
  }
}

window.customElements.define('nc-discounts-grid', NcDiscountsGrid);
