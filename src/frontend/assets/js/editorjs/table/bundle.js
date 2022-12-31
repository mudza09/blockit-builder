function c(a,t,o={}){let e=document.createElement(a);Array.isArray(t)?e.classList.add(...t):t&&e.classList.add(t);for(let r in o)!Object.prototype.hasOwnProperty.call(o,r)||(e[r]=o[r]);return e}function L(a){let t=a.getBoundingClientRect();return{y1:Math.floor(t.top+window.pageYOffset),x1:Math.floor(t.left+window.pageXOffset),x2:Math.floor(t.right+window.pageXOffset),y2:Math.floor(t.bottom+window.pageYOffset)}}function v(a,t){let o=L(a),e=L(t);return{fromTopBorder:e.y1-o.y1,fromLeftBorder:e.x1-o.x1,fromRightBorder:o.x2-e.x2,fromBottomBorder:o.y2-e.y2}}function y(a,t){let o=a.getBoundingClientRect(),{width:e,height:r,x:n,y:s}=o,{clientX:d,clientY:l}=t;return{width:e,height:r,x:d-n,y:l-s}}function m(a,t){return t.parentNode.insertBefore(a,t)}function f(a,t=!0){let o=document.createRange(),e=window.getSelection();o.selectNodeContents(a),o.collapse(t),e.removeAllRanges(),e.addRange(o)}var h=class{constructor({items:t}){this.items=t,this.wrapper=void 0,this.itemEls=[]}static get CSS(){return{popover:"tc-popover",popoverOpened:"tc-popover--opened",item:"tc-popover__item",itemHidden:"tc-popover__item--hidden",itemConfirmState:"tc-popover__item--confirm",itemIcon:"tc-popover__item-icon",itemLabel:"tc-popover__item-label"}}render(){return this.wrapper=c("div",h.CSS.popover),this.items.forEach((t,o)=>{let e=c("div",h.CSS.item),r=c("div",h.CSS.itemIcon,{innerHTML:t.icon}),n=c("div",h.CSS.itemLabel,{textContent:t.label});e.dataset.index=o,e.appendChild(r),e.appendChild(n),this.wrapper.appendChild(e),this.itemEls.push(e)}),this.wrapper.addEventListener("click",t=>{this.popoverClicked(t)}),this.wrapper}popoverClicked(t){let o=t.target.closest(`.${h.CSS.item}`);if(!o)return;let e=o.dataset.index,r=this.items[e];if(r.confirmationRequired&&!this.hasConfirmationState(o)){this.setConfirmationState(o);return}r.onClick()}setConfirmationState(t){t.classList.add(h.CSS.itemConfirmState)}clearConfirmationState(t){t.classList.remove(h.CSS.itemConfirmState)}hasConfirmationState(t){return t.classList.contains(h.CSS.itemConfirmState)}get opened(){return this.wrapper.classList.contains(h.CSS.popoverOpened)}open(){this.items.forEach((t,o)=>{typeof t.hideIf=="function"&&this.itemEls[o].classList.toggle(h.CSS.itemHidden,t.hideIf())}),this.wrapper.classList.add(h.CSS.popoverOpened)}close(){this.wrapper.classList.remove(h.CSS.popoverOpened),this.itemEls.forEach(t=>{this.clearConfirmationState(t)})}};var H=`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
  <rect width="18" height="18" fill="#F4F5F7" rx="2"/>
  <circle cx="11.5" cy="6.5" r="1.5"/>
  <circle cx="11.5" cy="11.5" r="1.5"/>
  <circle cx="6.5" cy="6.5" r="1.5"/>
  <circle cx="6.5" cy="11.5" r="1.5"/>
</svg>
`;var w=class{constructor({api:t,items:o,onOpen:e,onClose:r,cssModifier:n=""}){this.api=t,this.items=o,this.onOpen=e,this.onClose=r,this.cssModifier=n,this.popover=null,this.wrapper=this.createToolbox()}static get CSS(){return{toolbox:"tc-toolbox",toolboxShowed:"tc-toolbox--showed",toggler:"tc-toolbox__toggler"}}get element(){return this.wrapper}createToolbox(){let t=c("div",[w.CSS.toolbox,this.cssModifier?`${w.CSS.toolbox}--${this.cssModifier}`:""]),o=this.createPopover(),e=this.createToggler();return t.appendChild(e),t.appendChild(o),t}createToggler(){let t=c("div",w.CSS.toggler,{innerHTML:H});return t.addEventListener("click",()=>{this.togglerClicked()}),t}createPopover(){return this.popover=new h({items:this.items}),this.popover.render()}togglerClicked(){this.popover.opened?(this.popover.close(),this.onClose()):(this.popover.open(),this.onOpen())}show(t){let o=t();Object.entries(o).forEach(([e,r])=>{this.wrapper.style[e]=r}),this.wrapper.classList.add(w.CSS.toolboxShowed)}hide(){this.popover.close(),this.wrapper.classList.remove(w.CSS.toolboxShowed)}};function x(a,t){let o=0;return function(...e){let r=new Date().getTime();if(!(r-o<a))return o=r,t(...e)}}var M='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 8L12 12M12 12L16 16M12 12L16 8M12 12L8 16"/></svg>';var R='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.8833 9.16666L18.2167 12.5M18.2167 12.5L14.8833 15.8333M18.2167 12.5H10.05C9.16594 12.5 8.31809 12.1488 7.69297 11.5237C7.06785 10.8986 6.71666 10.0507 6.71666 9.16666"/></svg>',B='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.9167 14.9167L11.5833 18.25M11.5833 18.25L8.25 14.9167M11.5833 18.25L11.5833 10.0833C11.5833 9.19928 11.9345 8.35143 12.5596 7.72631C13.1848 7.10119 14.0326 6.75 14.9167 6.75"/></svg>',I='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.13333 14.9167L12.4667 18.25M12.4667 18.25L15.8 14.9167M12.4667 18.25L12.4667 10.0833C12.4667 9.19928 12.1155 8.35143 11.4904 7.72631C10.8652 7.10119 10.0174 6.75 9.13333 6.75"/></svg>',S='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.8833 15.8333L18.2167 12.5M18.2167 12.5L14.8833 9.16667M18.2167 12.5L10.05 12.5C9.16595 12.5 8.31811 12.8512 7.69299 13.4763C7.06787 14.1014 6.71667 14.9493 6.71667 15.8333"/></svg>';var b='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M12 7V12M12 17V12M17 12H12M12 12H7"/></svg>';var V='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M10 5V18.5"/><path stroke="currentColor" stroke-width="2" d="M5 10H19"/><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/></svg>';var i={wrapper:"tc-wrap",wrapperReadOnly:"tc-wrap--readonly",table:"tc-table",row:"tc-row",withHeadings:"tc-table--heading",rowSelected:"tc-row--selected",cell:"tc-cell",cellSelected:"tc-cell--selected",addRow:"tc-add-row",addColumn:"tc-add-column"},C=class{constructor(t,o,e,r){this.readOnly=t,this.api=o,this.data=e,this.config=r,this.wrapper=null,this.table=null,this.toolboxColumn=this.createColumnToolbox(),this.toolboxRow=this.createRowToolbox(),this.createTableWrapper(),this.hoveredRow=0,this.hoveredColumn=0,this.selectedRow=0,this.selectedColumn=0,this.tunes={withHeadings:!1},this.resize(),this.fill(),this.focusedCell={row:0,column:0},this.documentClicked=n=>{let s=n.target.closest(`.${i.table}`)!==null,d=n.target.closest(`.${i.wrapper}`)===null;(s||d)&&this.hideToolboxes();let p=n.target.closest(`.${i.addRow}`),u=n.target.closest(`.${i.addColumn}`);p&&p.parentNode===this.wrapper?(this.addRow(void 0,!0),this.hideToolboxes()):u&&u.parentNode===this.wrapper&&(this.addColumn(void 0,!0),this.hideToolboxes())},this.readOnly||this.bindEvents()}getWrapper(){return this.wrapper}bindEvents(){document.addEventListener("click",this.documentClicked),this.table.addEventListener("mousemove",x(150,t=>this.onMouseMoveInTable(t)),{passive:!0}),this.table.onkeypress=t=>this.onKeyPressListener(t),this.table.addEventListener("keydown",t=>this.onKeyDownListener(t)),this.table.addEventListener("focusin",t=>this.focusInTableListener(t))}createColumnToolbox(){return new w({api:this.api,cssModifier:"column",items:[{label:this.api.i18n.t("Add column to left"),icon:B,onClick:()=>{this.addColumn(this.selectedColumn,!0),this.hideToolboxes()}},{label:this.api.i18n.t("Add column to right"),icon:I,onClick:()=>{this.addColumn(this.selectedColumn+1,!0),this.hideToolboxes()}},{label:this.api.i18n.t("Delete column"),icon:M,hideIf:()=>this.numberOfColumns===1,confirmationRequired:!0,onClick:()=>{this.deleteColumn(this.selectedColumn),this.hideToolboxes()}}],onOpen:()=>{this.selectColumn(this.hoveredColumn),this.hideRowToolbox()},onClose:()=>{this.unselectColumn()}})}createRowToolbox(){return new w({api:this.api,cssModifier:"row",items:[{label:this.api.i18n.t("Add row above"),icon:S,onClick:()=>{this.addRow(this.selectedRow,!0),this.hideToolboxes()}},{label:this.api.i18n.t("Add row below"),icon:R,onClick:()=>{this.addRow(this.selectedRow+1,!0),this.hideToolboxes()}},{label:this.api.i18n.t("Delete row"),icon:M,hideIf:()=>this.numberOfRows===1,confirmationRequired:!0,onClick:()=>{this.deleteRow(this.selectedRow),this.hideToolboxes()}}],onOpen:()=>{this.selectRow(this.hoveredRow),this.hideColumnToolbox()},onClose:()=>{this.unselectRow()}})}moveCursorToNextRow(){this.focusedCell.row!==this.numberOfRows?(this.focusedCell.row+=1,this.focusCell(this.focusedCell)):(this.addRow(),this.focusedCell.row+=1,this.focusCell(this.focusedCell),this.updateToolboxesPosition(0,0))}getCell(t,o){return this.table.querySelector(`.${i.row}:nth-child(${t}) .${i.cell}:nth-child(${o})`)}getRow(t){return this.table.querySelector(`.${i.row}:nth-child(${t})`)}getRowByCell(t){return t.parentElement}getRowFirstCell(t){return t.querySelector(`.${i.cell}:first-child`)}setCellContent(t,o,e){let r=this.getCell(t,o);r.innerHTML=e}addColumn(t=-1,o=!1){let e=this.numberOfColumns;for(let r=1;r<=this.numberOfRows;r++){let n,s=this.createCell();if(t>0&&t<=e?(n=this.getCell(r,t),m(s,n)):n=this.getRow(r).appendChild(s),r===1){let d=this.getCell(r,t>0?t:e+1);d&&o&&f(d)}}this.addHeadingAttrToFirstRow()}addRow(t=-1,o=!1){let e,r=c("div",i.row);this.tunes.withHeadings&&this.removeHeadingAttrFromFirstRow();let n=this.numberOfColumns;if(t>0&&t<=this.numberOfRows){let d=this.getRow(t);e=m(r,d)}else e=this.table.appendChild(r);this.fillRow(e,n),this.tunes.withHeadings&&this.addHeadingAttrToFirstRow();let s=this.getRowFirstCell(e);return s&&o&&f(s),e}deleteColumn(t){for(let o=1;o<=this.numberOfRows;o++){let e=this.getCell(o,t);if(!e)return;e.remove()}}deleteRow(t){this.getRow(t).remove(),this.addHeadingAttrToFirstRow()}createTableWrapper(){if(this.wrapper=c("div",i.wrapper),this.table=c("div",i.table),this.readOnly&&this.wrapper.classList.add(i.wrapperReadOnly),this.wrapper.appendChild(this.toolboxRow.element),this.wrapper.appendChild(this.toolboxColumn.element),this.wrapper.appendChild(this.table),!this.readOnly){let t=c("div",i.addColumn,{innerHTML:b}),o=c("div",i.addRow,{innerHTML:b});this.wrapper.appendChild(t),this.wrapper.appendChild(o)}}computeInitialSize(){let t=this.data&&this.data.content,o=Array.isArray(t),e=o?t.length:!1,r=o?t.length:void 0,n=e?t[0].length:void 0,s=Number.parseInt(this.config&&this.config.rows),d=Number.parseInt(this.config&&this.config.cols),l=!isNaN(s)&&s>0?s:void 0,p=!isNaN(d)&&d>0?d:void 0;return{rows:r||l||2,cols:n||p||2}}resize(){let{rows:t,cols:o}=this.computeInitialSize();for(let e=0;e<t;e++)this.addRow();for(let e=0;e<o;e++)this.addColumn()}fill(){let t=this.data;if(t&&t.content)for(let o=0;o<t.content.length;o++)for(let e=0;e<t.content[o].length;e++)this.setCellContent(o+1,e+1,t.content[o][e])}fillRow(t,o){for(let e=1;e<=o;e++){let r=this.createCell();t.appendChild(r)}}createCell(){return c("div",i.cell,{contentEditable:!this.readOnly})}get numberOfRows(){return this.table.childElementCount}get numberOfColumns(){return this.numberOfRows?this.table.querySelector(`.${i.row}:first-child`).childElementCount:0}get isColumnMenuShowing(){return this.selectedColumn!==0}get isRowMenuShowing(){return this.selectedRow!==0}onMouseMoveInTable(t){let{row:o,column:e}=this.getHoveredCell(t);this.hoveredColumn=e,this.hoveredRow=o,this.updateToolboxesPosition()}onKeyPressListener(t){if(t.key==="Enter"){if(t.shiftKey)return!0;this.moveCursorToNextRow()}return t.key!=="Enter"}onKeyDownListener(t){t.key==="Tab"&&t.stopPropagation()}focusInTableListener(t){let o=t.target,e=this.getRowByCell(o);this.focusedCell={row:Array.from(this.table.querySelectorAll(`.${i.row}`)).indexOf(e)+1,column:Array.from(e.querySelectorAll(`.${i.cell}`)).indexOf(o)+1}}hideToolboxes(){this.hideRowToolbox(),this.hideColumnToolbox(),this.updateToolboxesPosition()}hideRowToolbox(){this.unselectRow(),this.toolboxRow.hide()}hideColumnToolbox(){this.unselectColumn(),this.toolboxColumn.hide()}focusCell(){this.focusedCellElem.focus()}get focusedCellElem(){let{row:t,column:o}=this.focusedCell;return this.getCell(t,o)}updateToolboxesPosition(t=this.hoveredRow,o=this.hoveredColumn){this.isColumnMenuShowing||o>0&&o<=this.numberOfColumns&&this.toolboxColumn.show(()=>({left:`calc((100% - var(--cell-size)) / (${this.numberOfColumns} * 2) * (1 + (${o} - 1) * 2))`})),this.isRowMenuShowing||t>0&&t<=this.numberOfRows&&this.toolboxRow.show(()=>{let e=this.getRow(t),{fromTopBorder:r}=v(this.table,e),{height:n}=e.getBoundingClientRect();return{top:`${Math.ceil(r+n/2)}px`}})}setHeadingsSetting(t){this.tunes.withHeadings=t,t?(this.table.classList.add(i.withHeadings),this.addHeadingAttrToFirstRow()):(this.table.classList.remove(i.withHeadings),this.removeHeadingAttrFromFirstRow())}addHeadingAttrToFirstRow(){for(let t=1;t<=this.numberOfColumns;t++){let o=this.getCell(1,t);o&&o.setAttribute("heading",this.api.i18n.t("Heading"))}}removeHeadingAttrFromFirstRow(){for(let t=1;t<=this.numberOfColumns;t++){let o=this.getCell(1,t);o&&o.removeAttribute("heading")}}selectRow(t){let o=this.getRow(t);o&&(this.selectedRow=t,o.classList.add(i.rowSelected))}unselectRow(){if(this.selectedRow<=0)return;let t=this.table.querySelector(`.${i.rowSelected}`);t&&t.classList.remove(i.rowSelected),this.selectedRow=0}selectColumn(t){for(let o=1;o<=this.numberOfRows;o++){let e=this.getCell(o,t);e&&e.classList.add(i.cellSelected)}this.selectedColumn=t}unselectColumn(){if(this.selectedColumn<=0)return;let t=this.table.querySelectorAll(`.${i.cellSelected}`);Array.from(t).forEach(o=>{o.classList.remove(i.cellSelected)}),this.selectedColumn=0}getHoveredCell(t){let o=this.hoveredRow,e=this.hoveredColumn,{width:r,height:n,x:s,y:d}=y(this.table,t);return s>=0&&(e=this.binSearch(this.numberOfColumns,l=>this.getCell(1,l),({fromLeftBorder:l})=>s<l,({fromRightBorder:l})=>s>r-l)),d>=0&&(o=this.binSearch(this.numberOfRows,l=>this.getCell(l,1),({fromTopBorder:l})=>d<l,({fromBottomBorder:l})=>d>n-l)),{row:o||this.hoveredRow,column:e||this.hoveredColumn}}binSearch(t,o,e,r){let n=0,s=t+1,d=0,l;for(;n<s-1&&d<10;){l=Math.ceil((n+s)/2);let p=o(l),u=v(this.table,p);if(e(u))s=l;else if(r(u))n=l;else break;d++}return l}getData(){let t=[];for(let o=1;o<=this.numberOfRows;o++){let e=this.table.querySelector(`.${i.row}:nth-child(${o})`),r=Array.from(e.querySelectorAll(`.${i.cell}`));r.every(s=>!s.textContent.trim())||t.push(r.map(s=>s.innerHTML))}return t}destroy(){document.removeEventListener("click",this.documentClicked)}};var g=class{static get isReadOnlySupported(){return!0}static get enableLineBreaks(){return!0}constructor({data:t,config:o,api:e,readOnly:r}){this.api=e,this.readOnly=r,this.config=o,this.data={withHeadings:this.getConfig("withHeadings",!1),content:t&&t.content?t.content:[]},this.table=null}static get toolbox(){return{icon:V,title:"Table"}}render(){return this.table=new C(this.readOnly,this.api,this.data,this.config),this.container=c("div",this.api.styles.block),this.container.appendChild(this.table.getWrapper()),this.table.setHeadingsSetting(this.data.withHeadings),this.container}renderSettings(){return[]}save(){let t=this.table.getData();return{withHeadings:this.data.withHeadings,content:t}}destroy(){this.table.destroy()}getConfig(t,o=null){return this.data?this.data[t]?this.data[t]:o:this.config&&this.config[t]?this.config[t]:o}};var j=`/* tc- project's prefix*/
.tc-wrap {
  --color-background: #f9f9fb;
  --color-text-secondary: #7b7e89;
  --color-border: #e8e8eb;
  --cell-size: 34px;
  --toolbox-icon-size: 18px;
  --toolbox-padding: 6px;
  --toolbox-aiming-field-size: calc(
    var(--toolbox-icon-size) + 2 * var(--toolbox-padding)
  );
  border-left: 0px;
  position: relative;
  height: 100%;
  width: 100%;
  margin-top: var(--toolbox-icon-size);
  box-sizing: border-box;
  display: grid;
  grid-template-columns: calc(100% - var(--cell-size)) var(--cell-size);
}
.tc-wrap--readonly {
  grid-template-columns: 100% var(--cell-size);
}
.tc-wrap svg {
  vertical-align: top;
}
@media print {
  .tc-wrap {
    border-left: 1px solid var(--color-border);
    grid-template-columns: 100% var(--cell-size);
  }
}
@media print {
  .tc-wrap .tc-row::after {
    display: none;
  }
}

.tc-table {
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  font-size: 14px;
  border-top: 1px solid var(--color-border);
  line-height: 1.4;
}
.tc-table::after {
  position: absolute;
  content: "";
  width: calc(var(--cell-size));
  height: 100%;
  left: calc(-1 * var(--cell-size));
  top: 0;
}
.tc-table::before {
  position: absolute;
  content: "";
  width: 100%;
  height: var(--toolbox-aiming-field-size);
  top: calc(-1 * var(--toolbox-aiming-field-size));
  left: 0;
}
.tc-table--heading .tc-row:first-child {
  font-weight: 600;
  border-bottom: 2px solid var(--color-border);
}
.tc-table--heading .tc-row:first-child [contenteditable]:empty::before {
  content: attr(heading);
  color: var(--color-text-secondary);
}
.tc-table--heading .tc-row:first-child::after {
  bottom: -2px;
  border-bottom: 2px solid var(--color-border);
}

.tc-add-column, .tc-add-row {
  display: flex;
  color: var(--color-text-secondary);
}
@media print {
  .tc-add {
    display: none;
  }
}

.tc-add-column {
  padding: 9px 0;
  justify-content: center;
  border-top: 1px solid var(--color-border);
}
@media print {
  .tc-add-column {
    display: none;
  }
}

.tc-add-row {
  height: var(--cell-size);
  align-items: center;
  padding-left: 12px;
  position: relative;
}
.tc-add-row::before {
  content: "";
  position: absolute;
  right: calc(-1 * var(--cell-size));
  width: var(--cell-size);
  height: 100%;
}
@media print {
  .tc-add-row {
    display: none;
  }
}

.tc-add-column, .tc-add-row {
  transition: 0s;
  cursor: pointer;
  will-change: background-color;
}
.tc-add-column:hover, .tc-add-row:hover {
  transition: background-color 0.1s ease;
  background-color: var(--color-background);
}
.tc-add-row {
  margin-top: 1px;
}
.tc-add-row:hover::before {
  transition: 0.1s;
  background-color: var(--color-background);
}

.tc-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10px, 1fr));
  position: relative;
  border-bottom: 1px solid var(--color-border);
}
.tc-row::after {
  content: "";
  pointer-events: none;
  position: absolute;
  width: var(--cell-size);
  height: 100%;
  bottom: -1px;
  right: calc(-1 * var(--cell-size));
  border-bottom: 1px solid var(--color-border);
}
.tc-row--selected {
  background: var(--color-background);
}

.tc-row--selected::after {
  background: var(--color-background);
}

.tc-cell {
  border-right: 1px solid var(--color-border);
  padding: 6px 12px 6px 12px;
  overflow: hidden;
  outline: none;
  line-break: normal;
}
.tc-cell--selected {
  background: var(--color-background);
}

.tc-wrap--readonly .tc-row::after {
  display: none;
}

.tc-toolbox {
  --toolbox-padding: 6px;
  --popover-margin: 30px;
  --toggler-click-zone-size: 30px;
  --toggler-dots-color: #7B7E89;
  --toggler-dots-color-hovered: #1D202B;
  position: absolute;
  cursor: pointer;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.1s;
  will-change: left, opacity;
}
.tc-toolbox--column {
  top: calc(-1 * (var(--toggler-click-zone-size)));
  transform: translateX(calc(-1 * var(--toggler-click-zone-size) / 2));
  will-change: left, opacity;
}
.tc-toolbox--row {
  left: calc(-1 * var(--popover-margin));
  transform: translateY(calc(-1 * var(--toggler-click-zone-size) / 2));
  margin-top: -1px; /* because of top border */
  will-change: top, opacity;
}
.tc-toolbox--showed {
  opacity: 1;
}
.tc-toolbox .tc-popover {
  position: absolute;
  top: 0;
  left: var(--popover-margin);
}
.tc-toolbox__toggler {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--toggler-click-zone-size);
  height: var(--toggler-click-zone-size);
  color: var(--toggler-dots-color);
  opacity: 0;
  transition: opacity 150ms ease;
  will-change: opacity;
}
.tc-toolbox__toggler:hover {
  color: var(--toggler-dots-color-hovered);
}
.tc-toolbox__toggler svg {
  fill: currentColor;
}

.tc-wrap:hover .tc-toolbox__toggler {
  opacity: 1;
}

.tc-settings .cdx-settings-button {
  width: 50%;
  margin: 0;
}

.tc-popover {
  --color-border: #eaeaea;
  --color-background: #fff;
  --color-background-hover: rgba(232,232,235,0.49);
  --color-background-confirm: #e24a4a;
  --color-background-confirm-hover: #d54040;
  --color-text-confirm: #fff;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  box-shadow: 0 3px 15px -3px rgba(13, 20, 33, 0.13);
  border-radius: 6px;
  padding: 6px;
  display: none;
  will-change: opacity, transform;
}
.tc-popover--opened {
  display: block;
  animation: menuShowing 100ms cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
}
.tc-popover__item {
  display: flex;
  align-items: center;
  padding: 2px 14px 2px 2px;
  border-radius: 5px;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
}
.tc-popover__item:hover {
  background: var(--color-background-hover);
}
.tc-popover__item:not(:last-of-type) {
  margin-bottom: 2px;
}
.tc-popover__item-icon {
  display: inline-flex;
  width: 26px;
  height: 26px;
  align-items: center;
  justify-content: center;
  background: var(--color-background);
  border-radius: 5px;
  border: 1px solid var(--color-border);
  margin-right: 8px;
}
.tc-popover__item-label {
  line-height: 22px;
  font-size: 14px;
  font-weight: 500;
}
.tc-popover__item--confirm {
  background: var(--color-background-confirm);
  color: var(--color-text-confirm);
}
.tc-popover__item--confirm:hover {
  background-color: var(--color-background-confirm-hover);
}
.tc-popover__item--confirm .tc-popover__item-icon {
  background: var(--color-background-confirm);
  border-color: rgba(0, 0, 0, 0.1);
}
.tc-popover__item--confirm .tc-popover__item-icon svg {
  transition: transform 200ms ease-in;
  transform: rotate(90deg) scale(1.2);
}
.tc-popover__item--hidden {
  display: none;
}

@keyframes menuShowing {
  0% {
    opacity: 0;
    transform: translateY(-8px) scale(0.9);
  }
  70% {
    opacity: 1;
    transform: translateY(2px);
  }
  to {
    transform: translateY(0);
  }
}`;document.head.appendChild(document.createElement("style")).appendChild(document.createTextNode(j));var e1=g;export{e1 as default};
