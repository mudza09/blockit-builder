var P=Object.create;var V=Object.defineProperty;var O=Object.getOwnPropertyDescriptor;var R=Object.getOwnPropertyNames;var D=Object.getPrototypeOf,Z=Object.prototype.hasOwnProperty;var U=(g,t)=>()=>(t||g((t={exports:{}}).exports,t),t.exports);var A=(g,t,e,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of R(t))!Z.call(g,r)&&r!==e&&V(g,r,{get:()=>t[r],enumerable:!(n=O(t,r))||n.enumerable});return g};var N=(g,t,e)=>(e=g!=null?P(D(g)):{},A(t||!g||!g.__esModule?V(e,"default",{value:g,enumerable:!0}):e,g));var F=U((E,T)=>{(function(g,t){typeof E=="object"&&typeof T=="object"?T.exports=t():typeof define=="function"&&define.amd?define([],t):typeof E=="object"?E.ajax=t():g.ajax=t()})(window,function(){return function(g){var t={};function e(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return g[n].call(r.exports,r,r.exports,e),r.l=!0,r.exports}return e.m=g,e.c=t,e.d=function(n,r,s){e.o(n,r)||Object.defineProperty(n,r,{enumerable:!0,get:s})},e.r=function(n){typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},e.t=function(n,r){if(1&r&&(n=e(n)),8&r||4&r&&typeof n=="object"&&n&&n.__esModule)return n;var s=Object.create(null);if(e.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:n}),2&r&&typeof n!="string")for(var k in n)e.d(s,k,function(a){return n[a]}.bind(null,k));return s},e.n=function(n){var r=n&&n.__esModule?function(){return n.default}:function(){return n};return e.d(r,"a",r),r},e.o=function(n,r){return Object.prototype.hasOwnProperty.call(n,r)},e.p="",e(e.s=3)}([function(g,t){var e;e=function(){return this}();try{e=e||new Function("return this")()}catch{typeof window=="object"&&(e=window)}g.exports=e},function(g,t,e){"use strict";(function(n){var r=e(2),s=setTimeout;function k(){}function a(i){if(!(this instanceof a))throw new TypeError("Promises must be constructed via new");if(typeof i!="function")throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],o(i,this)}function u(i,d){for(;i._state===3;)i=i._value;i._state!==0?(i._handled=!0,a._immediateFn(function(){var l=i._state===1?d.onFulfilled:d.onRejected;if(l!==null){var w;try{w=l(i._value)}catch(p){return void f(d.promise,p)}c(d.promise,w)}else(i._state===1?c:f)(d.promise,i._value)})):i._deferreds.push(d)}function c(i,d){try{if(d===i)throw new TypeError("A promise cannot be resolved with itself.");if(d&&(typeof d=="object"||typeof d=="function")){var l=d.then;if(d instanceof a)return i._state=3,i._value=d,void C(i);if(typeof l=="function")return void o((w=l,p=d,function(){w.apply(p,arguments)}),i)}i._state=1,i._value=d,C(i)}catch(h){f(i,h)}var w,p}function f(i,d){i._state=2,i._value=d,C(i)}function C(i){i._state===2&&i._deferreds.length===0&&a._immediateFn(function(){i._handled||a._unhandledRejectionFn(i._value)});for(var d=0,l=i._deferreds.length;d<l;d++)u(i,i._deferreds[d]);i._deferreds=null}function v(i,d,l){this.onFulfilled=typeof i=="function"?i:null,this.onRejected=typeof d=="function"?d:null,this.promise=l}function o(i,d){var l=!1;try{i(function(w){l||(l=!0,c(d,w))},function(w){l||(l=!0,f(d,w))})}catch(w){if(l)return;l=!0,f(d,w)}}a.prototype.catch=function(i){return this.then(null,i)},a.prototype.then=function(i,d){var l=new this.constructor(k);return u(this,new v(i,d,l)),l},a.prototype.finally=r.a,a.all=function(i){return new a(function(d,l){if(!i||i.length===void 0)throw new TypeError("Promise.all accepts an array");var w=Array.prototype.slice.call(i);if(w.length===0)return d([]);var p=w.length;function h(x,y){try{if(y&&(typeof y=="object"||typeof y=="function")){var L=y.then;if(typeof L=="function")return void L.call(y,function(_){h(x,_)},l)}w[x]=y,--p==0&&d(w)}catch(_){l(_)}}for(var m=0;m<w.length;m++)h(m,w[m])})},a.resolve=function(i){return i&&typeof i=="object"&&i.constructor===a?i:new a(function(d){d(i)})},a.reject=function(i){return new a(function(d,l){l(i)})},a.race=function(i){return new a(function(d,l){for(var w=0,p=i.length;w<p;w++)i[w].then(d,l)})},a._immediateFn=typeof n=="function"&&function(i){n(i)}||function(i){s(i,0)},a._unhandledRejectionFn=function(i){typeof console<"u"&&console&&console.warn("Possible Unhandled Promise Rejection:",i)},t.a=a}).call(this,e(5).setImmediate)},function(g,t,e){"use strict";t.a=function(n){var r=this.constructor;return this.then(function(s){return r.resolve(n()).then(function(){return s})},function(s){return r.resolve(n()).then(function(){return r.reject(s)})})}},function(g,t,e){"use strict";function n(o){return(n=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(i){return typeof i}:function(i){return i&&typeof Symbol=="function"&&i.constructor===Symbol&&i!==Symbol.prototype?"symbol":typeof i})(o)}e(4);var r,s,k,a,u,c,f,C=e(8),v=(s=function(o){return new Promise(function(i,d){o=a(o),(o=u(o)).beforeSend&&o.beforeSend();var l=window.XMLHttpRequest?new window.XMLHttpRequest:new window.ActiveXObject("Microsoft.XMLHTTP");l.open(o.method,o.url),l.setRequestHeader("X-Requested-With","XMLHttpRequest"),Object.keys(o.headers).forEach(function(p){var h=o.headers[p];l.setRequestHeader(p,h)});var w=o.ratio;l.upload.addEventListener("progress",function(p){var h=Math.round(p.loaded/p.total*100),m=Math.ceil(h*w/100);o.progress(Math.min(m,100))},!1),l.addEventListener("progress",function(p){var h=Math.round(p.loaded/p.total*100),m=Math.ceil(h*(100-w)/100)+w;o.progress(Math.min(m,100))},!1),l.onreadystatechange=function(){if(l.readyState===4){var p=l.response;try{p=JSON.parse(p)}catch{}var h=C.parseHeaders(l.getAllResponseHeaders()),m={body:p,code:l.status,headers:h};f(l.status)?i(m):d(m)}},l.send(o.data)})},k=function(o){return o.method="POST",s(o)},a=function(){var o=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(o.url&&typeof o.url!="string")throw new Error("Url must be a string");if(o.url=o.url||"",o.method&&typeof o.method!="string")throw new Error("`method` must be a string or null");if(o.method=o.method?o.method.toUpperCase():"GET",o.headers&&n(o.headers)!=="object")throw new Error("`headers` must be an object or null");if(o.headers=o.headers||{},o.type&&(typeof o.type!="string"||!Object.values(r).includes(o.type)))throw new Error("`type` must be taken from module's \xABcontentType\xBB library");if(o.progress&&typeof o.progress!="function")throw new Error("`progress` must be a function or null");if(o.progress=o.progress||function(i){},o.beforeSend=o.beforeSend||function(i){},o.ratio&&typeof o.ratio!="number")throw new Error("`ratio` must be a number");if(o.ratio<0||o.ratio>100)throw new Error("`ratio` must be in a 0-100 interval");if(o.ratio=o.ratio||90,o.accept&&typeof o.accept!="string")throw new Error("`accept` must be a string with a list of allowed mime-types");if(o.accept=o.accept||"*/*",o.multiple&&typeof o.multiple!="boolean")throw new Error("`multiple` must be a true or false");if(o.multiple=o.multiple||!1,o.fieldName&&typeof o.fieldName!="string")throw new Error("`fieldName` must be a string");return o.fieldName=o.fieldName||"files",o},u=function(o){switch(o.method){case"GET":var i=c(o.data,r.URLENCODED);delete o.data,o.url=/\?/.test(o.url)?o.url+"&"+i:o.url+"?"+i;break;case"POST":case"PUT":case"DELETE":case"UPDATE":var d=function(){return(arguments.length>0&&arguments[0]!==void 0?arguments[0]:{}).type||r.JSON}(o);(C.isFormData(o.data)||C.isFormElement(o.data))&&(d=r.FORM),o.data=c(o.data,d),d!==v.contentType.FORM&&(o.headers["content-type"]=d)}return o},c=function(){var o=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};switch(arguments.length>1?arguments[1]:void 0){case r.URLENCODED:return C.urlEncode(o);case r.JSON:return C.jsonEncode(o);case r.FORM:return C.formEncode(o);default:return o}},f=function(o){return o>=200&&o<300},{contentType:r={URLENCODED:"application/x-www-form-urlencoded; charset=utf-8",FORM:"multipart/form-data",JSON:"application/json; charset=utf-8"},request:s,get:function(o){return o.method="GET",s(o)},post:k,transport:function(o){return o=a(o),C.selectFiles(o).then(function(i){for(var d=new FormData,l=0;l<i.length;l++)d.append(o.fieldName,i[l],i[l].name);C.isObject(o.data)&&Object.keys(o.data).forEach(function(p){var h=o.data[p];d.append(p,h)});var w=o.beforeSend;return o.beforeSend=function(){return w(i)},o.data=d,k(o)})},selectFiles:function(o){return delete(o=a(o)).beforeSend,C.selectFiles(o)}});g.exports=v},function(g,t,e){"use strict";e.r(t);var n=e(1);window.Promise=window.Promise||n.a},function(g,t,e){(function(n){var r=n!==void 0&&n||typeof self<"u"&&self||window,s=Function.prototype.apply;function k(a,u){this._id=a,this._clearFn=u}t.setTimeout=function(){return new k(s.call(setTimeout,r,arguments),clearTimeout)},t.setInterval=function(){return new k(s.call(setInterval,r,arguments),clearInterval)},t.clearTimeout=t.clearInterval=function(a){a&&a.close()},k.prototype.unref=k.prototype.ref=function(){},k.prototype.close=function(){this._clearFn.call(r,this._id)},t.enroll=function(a,u){clearTimeout(a._idleTimeoutId),a._idleTimeout=u},t.unenroll=function(a){clearTimeout(a._idleTimeoutId),a._idleTimeout=-1},t._unrefActive=t.active=function(a){clearTimeout(a._idleTimeoutId);var u=a._idleTimeout;u>=0&&(a._idleTimeoutId=setTimeout(function(){a._onTimeout&&a._onTimeout()},u))},e(6),t.setImmediate=typeof self<"u"&&self.setImmediate||n!==void 0&&n.setImmediate||this&&this.setImmediate,t.clearImmediate=typeof self<"u"&&self.clearImmediate||n!==void 0&&n.clearImmediate||this&&this.clearImmediate}).call(this,e(0))},function(g,t,e){(function(n,r){(function(s,k){"use strict";if(!s.setImmediate){var a,u,c,f,C,v=1,o={},i=!1,d=s.document,l=Object.getPrototypeOf&&Object.getPrototypeOf(s);l=l&&l.setTimeout?l:s,{}.toString.call(s.process)==="[object process]"?a=function(h){r.nextTick(function(){p(h)})}:function(){if(s.postMessage&&!s.importScripts){var h=!0,m=s.onmessage;return s.onmessage=function(){h=!1},s.postMessage("","*"),s.onmessage=m,h}}()?(f="setImmediate$"+Math.random()+"$",C=function(h){h.source===s&&typeof h.data=="string"&&h.data.indexOf(f)===0&&p(+h.data.slice(f.length))},s.addEventListener?s.addEventListener("message",C,!1):s.attachEvent("onmessage",C),a=function(h){s.postMessage(f+h,"*")}):s.MessageChannel?((c=new MessageChannel).port1.onmessage=function(h){p(h.data)},a=function(h){c.port2.postMessage(h)}):d&&"onreadystatechange"in d.createElement("script")?(u=d.documentElement,a=function(h){var m=d.createElement("script");m.onreadystatechange=function(){p(h),m.onreadystatechange=null,u.removeChild(m),m=null},u.appendChild(m)}):a=function(h){setTimeout(p,0,h)},l.setImmediate=function(h){typeof h!="function"&&(h=new Function(""+h));for(var m=new Array(arguments.length-1),x=0;x<m.length;x++)m[x]=arguments[x+1];var y={callback:h,args:m};return o[v]=y,a(v),v++},l.clearImmediate=w}function w(h){delete o[h]}function p(h){if(i)setTimeout(p,0,h);else{var m=o[h];if(m){i=!0;try{(function(x){var y=x.callback,L=x.args;switch(L.length){case 0:y();break;case 1:y(L[0]);break;case 2:y(L[0],L[1]);break;case 3:y(L[0],L[1],L[2]);break;default:y.apply(k,L)}})(m)}finally{w(h),i=!1}}}}})(typeof self>"u"?n===void 0?this:n:self)}).call(this,e(0),e(7))},function(g,t){var e,n,r=g.exports={};function s(){throw new Error("setTimeout has not been defined")}function k(){throw new Error("clearTimeout has not been defined")}function a(l){if(e===setTimeout)return setTimeout(l,0);if((e===s||!e)&&setTimeout)return e=setTimeout,setTimeout(l,0);try{return e(l,0)}catch{try{return e.call(null,l,0)}catch{return e.call(this,l,0)}}}(function(){try{e=typeof setTimeout=="function"?setTimeout:s}catch{e=s}try{n=typeof clearTimeout=="function"?clearTimeout:k}catch{n=k}})();var u,c=[],f=!1,C=-1;function v(){f&&u&&(f=!1,u.length?c=u.concat(c):C=-1,c.length&&o())}function o(){if(!f){var l=a(v);f=!0;for(var w=c.length;w;){for(u=c,c=[];++C<w;)u&&u[C].run();C=-1,w=c.length}u=null,f=!1,function(p){if(n===clearTimeout)return clearTimeout(p);if((n===k||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(p);try{n(p)}catch{try{return n.call(null,p)}catch{return n.call(this,p)}}}(l)}}function i(l,w){this.fun=l,this.array=w}function d(){}r.nextTick=function(l){var w=new Array(arguments.length-1);if(arguments.length>1)for(var p=1;p<arguments.length;p++)w[p-1]=arguments[p];c.push(new i(l,w)),c.length!==1||f||a(o)},i.prototype.run=function(){this.fun.apply(null,this.array)},r.title="browser",r.browser=!0,r.env={},r.argv=[],r.version="",r.versions={},r.on=d,r.addListener=d,r.once=d,r.off=d,r.removeListener=d,r.removeAllListeners=d,r.emit=d,r.prependListener=d,r.prependOnceListener=d,r.listeners=function(l){return[]},r.binding=function(l){throw new Error("process.binding is not supported")},r.cwd=function(){return"/"},r.chdir=function(l){throw new Error("process.chdir is not supported")},r.umask=function(){return 0}},function(g,t,e){function n(s,k){for(var a=0;a<k.length;a++){var u=k[a];u.enumerable=u.enumerable||!1,u.configurable=!0,"value"in u&&(u.writable=!0),Object.defineProperty(s,u.key,u)}}var r=e(9);g.exports=function(){function s(){(function(c,f){if(!(c instanceof f))throw new TypeError("Cannot call a class as a function")})(this,s)}var k,a,u;return k=s,u=[{key:"urlEncode",value:function(c){return r(c)}},{key:"jsonEncode",value:function(c){return JSON.stringify(c)}},{key:"formEncode",value:function(c){if(this.isFormData(c))return c;if(this.isFormElement(c))return new FormData(c);if(this.isObject(c)){var f=new FormData;return Object.keys(c).forEach(function(C){var v=c[C];f.append(C,v)}),f}throw new Error("`data` must be an instance of Object, FormData or <FORM> HTMLElement")}},{key:"isObject",value:function(c){return Object.prototype.toString.call(c)==="[object Object]"}},{key:"isFormData",value:function(c){return c instanceof FormData}},{key:"isFormElement",value:function(c){return c instanceof HTMLFormElement}},{key:"selectFiles",value:function(){var c=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return new Promise(function(f,C){var v=document.createElement("INPUT");v.type="file",c.multiple&&v.setAttribute("multiple","multiple"),c.accept&&v.setAttribute("accept",c.accept),v.style.display="none",document.body.appendChild(v),v.addEventListener("change",function(o){var i=o.target.files;f(i),document.body.removeChild(v)},!1),v.click()})}},{key:"parseHeaders",value:function(c){var f=c.trim().split(/[\r\n]+/),C={};return f.forEach(function(v){var o=v.split(": "),i=o.shift(),d=o.join(": ");i&&(C[i]=d)}),C}}],(a=null)&&n(k.prototype,a),u&&n(k,u),s}()},function(g,t){var e=function(r){return encodeURIComponent(r).replace(/[!'()*]/g,escape).replace(/%20/g,"+")},n=function(r,s,k,a){return s=s||null,k=k||"&",a=a||null,r?function(u){for(var c=new Array,f=0;f<u.length;f++)u[f]&&c.push(u[f]);return c}(Object.keys(r).map(function(u){var c,f,C=u;if(a&&(C=a+"["+C+"]"),typeof r[u]=="object"&&r[u]!==null)c=n(r[u],null,k,C);else{s&&(f=C,C=!isNaN(parseFloat(f))&&isFinite(f)?s+Number(C):C);var v=r[u];v=(v=(v=(v=v===!0?"1":v)===!1?"0":v)===0?"0":v)||"",c=e(C)+"="+e(v)}return c})).join(k).replace(/[!'()*]/g,""):""};g.exports=n}])})});var q=`.image-tool {
  --bg-color: #cdd1e0;
  --front-color: #388ae5;
  --border-color: #e8e8eb;

  &__image {
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 10px;

    &-picture {
      max-width: 100%;
      vertical-align: bottom;
      display: block;
    }

    &-preloader {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-size: cover;
      margin: auto;
      position: relative;
      background-color: var(--bg-color);
      background-position: center center;

      &::after {
        content: "";
        position: absolute;
        z-index: 3;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: 2px solid var(--bg-color);
        border-top-color: var(--front-color);
        left: 50%;
        top: 50%;
        margin-top: -30px;
        margin-left: -30px;
        animation: image-preloader-spin 2s infinite linear;
        box-sizing: border-box;
      }
    }
  }

  &__caption {
    &[contentEditable="true"][data-placeholder]::before {
      position: absolute !important;
      content: attr(data-placeholder);
      color: #707684;
      font-weight: normal;
      display: none;
    }

    &[contentEditable="true"][data-placeholder]:empty {
      &::before {
        display: block;
      }

      &:focus::before {
        display: none;
      }
    }
  }

  &--empty {
    ^&__image {
      display: none;
    }
  }

  &--empty,
  &--loading {
    ^&__caption {
      display: none;
    }
  }

  &--filled {
    .cdx-button {
      display: none;
    }

    ^&__image {
      &-preloader {
        display: none;
      }
    }
  }

  &--loading {
    ^&__image {
      min-height: 200px;
      display: flex;
      border: 1px solid var(--border-color);
      background-color: #fff;

      &-picture {
        display: none;
      }
    }

    .cdx-button {
      display: none;
    }
  }

  /**
   * Tunes
   * ----------------
   */

  &--withBorder {
    ^&__image {
      border: 1px solid var(--border-color);
    }
  }

  &--withBackground {
    ^&__image {
      padding: 15px;
      background: var(--bg-color);

      &-picture {
        max-width: 60%;
        margin: 0 auto;
      }
    }
  }

  &--stretched {
    ^&__image {
      &-picture {
        width: 100%;
      }
    }
  }

  .cdx-button {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      height: auto;
      margin: 0 6px 0 0;
    }
  }
}

@keyframes image-preloader-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
`;document.head.appendChild(document.createElement("style")).appendChild(document.createTextNode(q));var S='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.13968 15.32L8.69058 11.5661C9.02934 11.2036 9.48873 11 9.96774 11C10.4467 11 10.9061 11.2036 11.2449 11.5661L15.3871 16M13.5806 14.0664L15.0132 12.533C15.3519 12.1705 15.8113 11.9668 16.2903 11.9668C16.7693 11.9668 17.2287 12.1705 17.5675 12.533L18.841 13.9634"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.7778 9.33331H13.7867"/></svg>';function b(g,t=null,e={}){let n=document.createElement(g);Array.isArray(t)?n.classList.add(...t):t&&n.classList.add(t);for(let r in e)n[r]=e[r];return n}var M=class{constructor({api:t,config:e,onSelectFile:n,readOnly:r}){this.api=t,this.config=e,this.onSelectFile=n,this.readOnly=r,this.nodes={wrapper:b("div",[this.CSS.baseClass,this.CSS.wrapper]),imageContainer:b("div",[this.CSS.imageContainer]),fileButton:this.createFileButton(),imageEl:void 0,imagePreloader:b("div",this.CSS.imagePreloader),caption:b("div",[this.CSS.input,this.CSS.caption],{contentEditable:!this.readOnly})},this.nodes.caption.dataset.placeholder=this.config.captionPlaceholder,this.nodes.imageContainer.appendChild(this.nodes.imagePreloader),this.nodes.wrapper.appendChild(this.nodes.imageContainer),this.nodes.wrapper.appendChild(this.nodes.fileButton),this.nodes.wrapper.appendChild(this.nodes.caption)}get CSS(){return{baseClass:this.api.styles.block,loading:this.api.styles.loader,input:this.api.styles.input,button:"image-tool__button",wrapper:"image-tool",imageContainer:"image-tool__image",imagePreloader:"image-tool__image-preloader",imageEl:"image-tool__image-picture",caption:"image-tool__caption"}}static get status(){return{EMPTY:"empty",UPLOADING:"loading",FILLED:"filled"}}render(t){return!t.file||Object.keys(t.file).length===0?this.toggleStatus(M.status.EMPTY):(setTimeout(()=>document.querySelector(".image-tool__button").remove(),200),this.toggleStatus(M.status.UPLOADING)),this.nodes.wrapper}createFileButton(){let t=b("div",[this.CSS.button]);return t.innerHTML=this.config.buttonContent||`<i class="fas fa-image fa-sm uk-margin-small-right"></i>${this.api.i18n.t("Select an image")}`,t.addEventListener("click",()=>{this.onSelectFile()}),t}showPreloader(t){this.nodes.imagePreloader.style.backgroundImage=`url(${t})`,this.toggleStatus(M.status.UPLOADING)}hidePreloader(){this.nodes.imagePreloader.style.backgroundImage="",this.toggleStatus(M.status.EMPTY)}fillImage(t){let e=/\.mp4$/.test(t)?"VIDEO":"IMG",n={src:t},r="load";e==="VIDEO"&&(n.autoplay=!0,n.loop=!0,n.muted=!0,n.playsinline=!0,r="loadeddata"),this.nodes.imageEl=b(e,this.CSS.imageEl,n),this.nodes.imageEl.addEventListener(r,()=>{this.toggleStatus(M.status.FILLED),this.nodes.imagePreloader&&(this.nodes.imagePreloader.style.backgroundImage="")}),this.nodes.imageContainer.appendChild(this.nodes.imageEl)}fillCaption(t){this.nodes.caption&&(this.nodes.caption.innerHTML=t)}toggleStatus(t){for(let e in M.status)Object.prototype.hasOwnProperty.call(M.status,e)&&this.nodes.wrapper.classList.toggle(`${this.CSS.wrapper}--${M.status[e]}`,t===M.status[e])}applyTune(t,e){this.nodes.wrapper.classList.toggle(`${this.CSS.wrapper}--${t}`,e)}};var H=N(F());function j(g){return g&&typeof g.then=="function"}var B=class{constructor({config:t,onUpload:e,onError:n}){this.config=t,this.onUpload=e,this.onError=n}uploadSelectedFile({onPreview:t}){let e=function(r){let s=new FileReader;s.readAsDataURL(r),s.onload=k=>{t(k.target.result)}},n;this.config.uploader&&typeof this.config.uploader.uploadByFile=="function"?n=H.default.selectFiles({accept:this.config.types}).then(r=>{e(r[0]);let s=this.config.uploader.uploadByFile(r[0]);return j(s)||console.warn("Custom uploader method uploadByFile should return a Promise"),s}):n=H.default.transport({url:this.config.endpoints.byFile,data:this.config.additionalRequestData,accept:this.config.types,headers:this.config.additionalRequestHeaders,beforeSend:r=>{e(r[0])},fieldName:this.config.field}).then(r=>r.body),n.then(r=>{document.querySelector(".image-tool__button").remove(),this.onUpload(r)}).catch(r=>{this.onError(r)})}uploadByUrl(t){let e;this.config.uploader&&typeof this.config.uploader.uploadByUrl=="function"?(e=this.config.uploader.uploadByUrl(t),j(e)||console.warn("Custom uploader method uploadByUrl should return a Promise")):e=H.default.post({url:this.config.endpoints.byUrl,data:Object.assign({url:t},this.config.additionalRequestData),type:H.default.contentType.JSON,headers:this.config.additionalRequestHeaders}).then(n=>n.body),e.then(n=>{this.onUpload(n)}).catch(n=>{this.onError(n)})}uploadByFile(t,{onPreview:e}){let n=new FileReader;n.readAsDataURL(t),n.onload=s=>{e(s.target.result)};let r;if(this.config.uploader&&typeof this.config.uploader.uploadByFile=="function")r=this.config.uploader.uploadByFile(t),j(r)||console.warn("Custom uploader method uploadByFile should return a Promise");else{let s=new FormData;s.append(this.config.field,t),this.config.additionalRequestData&&Object.keys(this.config.additionalRequestData).length&&Object.entries(this.config.additionalRequestData).forEach(([k,a])=>{s.append(k,a)}),r=H.default.post({url:this.config.endpoints.byFile,data:s,type:H.default.contentType.JSON,headers:this.config.additionalRequestHeaders}).then(k=>k.body)}r.then(s=>{this.onUpload(s)}).catch(s=>{this.onError(s)})}};var I=class{static get isReadOnlySupported(){return!0}static get toolbox(){return{icon:S,title:"Image"}}static get tunes(){return[]}constructor({data:t,config:e,api:n,readOnly:r}){this.api=n,this.readOnly=r,this.config={endpoints:e.endpoints||"",additionalRequestData:e.additionalRequestData||{},additionalRequestHeaders:e.additionalRequestHeaders||{},field:e.field||"image",types:e.types||"image/*",captionPlaceholder:this.api.i18n.t(e.captionPlaceholder||"Enter image caption"),buttonContent:e.buttonContent||"",uploader:e.uploader||void 0,actions:e.actions||[]},this.uploader=new B({config:this.config,onUpload:s=>this.onUpload(s),onError:s=>this.uploadingFailed(s)}),this.ui=new M({api:n,config:this.config,onSelectFile:()=>{this.uploader.uploadSelectedFile({onPreview:s=>{this.ui.showPreloader(s)}})},readOnly:r}),this._data={},this.data=t}render(){return this.ui.render(this.data)}validate(t){return t.file&&t.file.url}save(){let t=this.ui.nodes.caption;return this._data.caption=t.innerHTML,this.data}renderSettings(){return I.tunes.concat(this.config.actions).map(e=>({icon:e.icon,label:this.api.i18n.t(e.title),name:e.name,toggle:e.toggle,isActive:this.data[e.name],onActivate:()=>{if(typeof e.action=="function"){e.action(e.name);return}this.tuneToggled(e.name)}}))}appendCallback(){this.ui.nodes.fileButton.click()}static get pasteConfig(){return{tags:["img"],patterns:{image:/https?:\/\/\S+\.(gif|jpe?g|tiff|png)$/i},files:{mimeTypes:["image/*"]}}}async onPaste(t){switch(t.type){case"tag":{let e=t.detail.data;if(/^blob:/.test(e.src)){let r=await(await fetch(e.src)).blob();this.uploadFile(r);break}this.uploadUrl(e.src);break}case"pattern":{let e=t.detail.data;this.uploadUrl(e);break}case"file":{let e=t.detail.file;this.uploadFile(e);break}}}set data(t){this.image=t.file,this._data.caption=t.caption||"",this.ui.fillCaption(this._data.caption),I.tunes.forEach(({name:e})=>{let n=typeof t[e]<"u"?t[e]===!0||t[e]==="true":!1;this.setTune(e,n)})}get data(){return this._data}set image(t){this._data.file=t||{},t&&t.url&&this.ui.fillImage(t.url)}onUpload(t){t.success&&t.file?this.image=t.file:this.uploadingFailed("incorrect response: "+JSON.stringify(t))}uploadingFailed(t){console.log("Image Tool: uploading failed because of",t),this.api.notifier.show({message:this.api.i18n.t("Couldn\u2019t upload image. Please try another."),style:"error"}),this.ui.hidePreloader()}tuneToggled(t){this.setTune(t,!this._data[t])}setTune(t,e){this._data[t]=e,this.ui.applyTune(t,e),t==="stretched"&&Promise.resolve().then(()=>{let n=this.api.blocks.getCurrentBlockIndex();this.api.blocks.stretchBlock(n,e)}).catch(n=>{console.error(n)})}uploadFile(t){this.uploader.uploadByFile(t,{onPreview:e=>{this.ui.showPreloader(e)}})}uploadUrl(t){this.ui.showPreloader(t),this.uploader.uploadByUrl(t)}removed(){let t=this.data.file.url.split("/").pop();window.___browserSync___.socket.emit("assetsDelete",t)}};export{I as default};
/**
 * Image Tool for the Editor.js
 *
 * @author CodeX <team@codex.so>
 * @license MIT
 * @see {@link https://github.com/editor-js/image}
 *
 * To developers.
 * To simplify Tool structure, we split it to 4 parts:
 *  1) index.js — main Tool's interface, public API and methods for working with data
 *  2) uploader.js — module that has methods for sending files via AJAX: from device, by URL or File pasting
 *  3) ui.js — module for UI manipulations: render, showing preloader, etc
 *  4) tunes.js — working with Block Tunes: render buttons, handle clicks
 *
 * For debug purposes there is a testing server
 * that can save uploaded files and return a Response {@link UploadResponseFormat}
 *
 *       $ node dev/server.js
 *
 * It will expose 8008 port, so you can pass http://localhost:8008 with the Tools config:
 *
 * image: {
 *   class: ImageTool,
 *   config: {
 *     endpoints: {
 *       byFile: 'http://localhost:8008/uploadFile',
 *       byUrl: 'http://localhost:8008/fetchUrl',
 *     }
 *   },
 * },
 */
