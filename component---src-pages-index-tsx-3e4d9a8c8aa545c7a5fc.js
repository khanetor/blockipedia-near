"use strict";(self.webpackChunkblockipedia=self.webpackChunkblockipedia||[]).push([[691],{7999:function(e,t,a){a.r(t),a.d(t,{default:function(){return m}});var n=a(7294),l=a(5186),r=a(1597);function c(e){var t=e.article,a=t.date.toDateString();return n.createElement(n.Fragment,null,n.createElement("div",{className:"flex flex-row gap-5"},n.createElement("div",{className:"text-2xl font-bold text-gray-500 opacity-20"},t.id),n.createElement("div",{className:"flex flex-col gap-2 mt-2"},n.createElement("div",{className:"text-xs font-semibold"},t.author),n.createElement("div",{className:"font-bold"},n.createElement(r.Link,{to:"read/"+t.id},t.title)),n.createElement("div",{className:"text-xs text-gray-400"},a))))}function i(){return n.createElement(n.Fragment,null,n.createElement("div",{className:"style-module--landing--hcMKW"},n.createElement("span",{className:"style-module--tagline--RLTjO"},"Stay curious.")))}var u=a(9904);function m(){var e=(0,n.useState)([]),t=e[0],a=e[1],r=(0,u.cq)();return(0,n.useEffect)((function(){r.getArticles().then((function(e){return e.map((function(e){return{id:e[0],author:e[1].author,title:e[1].title,date:new Date(e[1].published_date/1e6)}}))})).then((function(e){return a(e)}))}),[]),n.createElement(n.Fragment,null,n.createElement(l.q,null,n.createElement("title",null,"Blockipedia - Welcome")),n.createElement(i,null),n.createElement(u.cr,{redirect:!1},n.createElement("div",{className:"index-module--content--+X+Cu"},t.map((function(e){return n.createElement(c,{article:e,key:e.id})})))))}}}]);
//# sourceMappingURL=component---src-pages-index-tsx-3e4d9a8c8aa545c7a5fc.js.map