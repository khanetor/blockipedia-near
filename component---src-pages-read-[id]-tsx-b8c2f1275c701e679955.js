(self.webpackChunkblockipedia=self.webpackChunkblockipedia||[]).push([[8],{4746:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return x}});var l=n(531),a=n(7757),r=n.n(a),i=n(7294),c=n(606);function o(e){var t,n,l="";if("string"==typeof e||"number"==typeof e)l+=e;else if("object"==typeof e)if(Array.isArray(e))for(t=0;t<e.length;t++)e[t]&&(n=o(e[t]))&&(l&&(l+=" "),l+=n);else for(t in e)e[t]&&(l&&(l+=" "),l+=t);return l}function u(){for(var e,t,n=0,l="";n<arguments.length;)(e=arguments[n++])&&(t=o(e))&&(l&&(l+=" "),l+=t);return l}function s(e){var t=(0,i.useState)(0),n=t[0],l=t[1];return i.createElement("div",{className:u("absolute top-0 left-0 w-screen h-screen flex items-center justify-center bg-slate-600 bg-opacity-70 flex-col scale-0 transition-all origin-right duration-200",{"scale-100":e.show})},i.createElement("div",{className:"flex flex-col items-center justify-center gap-5 bg-gray-400 p-10 rounded-3xl"},i.createElement("p",{className:"font-semibold text-slate-50 text-2xl"},"You are about to donate to this article for ",n," NEARs."),i.createElement("input",{className:"border-none rounded w-40 h-16 text-right",value:n,type:"number",step:1e-5,onChange:function(e){return l(parseFloat(e.target.value))}}),i.createElement("div",{className:"flex flex-row gap-4"},i.createElement("button",{className:"bg-yellow-400 rounded-xl px-5 py-3 text-white font-bold text-2xl",onClick:e.dismiss},"Cancel"),i.createElement("button",{className:"bg-blue-400 rounded-xl px-6 py-3 text-white font-bold text-2xl",onClick:function(){return e.donate(e.articleId,n)}},"Send"))))}var d,m="[id]-module--readingView--GTIOZ",f=n(5186),p=n(1380),h=n(7174),E=n.n(h),b=n(2674),v=n.n(b);function x(e){var t,n=parseInt(e.id),a=(0,i.useState)(void 0),o=a[0],u=a[1],h=(0,i.useState)(0),b=h[0],x=h[1],k=(0,i.useState)(!1),g=k[0],w=k[1],y=(0,i.useState)(0),N=y[0],L=y[1],S=(0,i.useState)(!1),C=S[0],A=S[1],D=(0,i.useState)(!1),I=D[0],O=D[1],P=(0,c.cq)();function j(e){return W.apply(this,arguments)}function W(){return(W=(0,l.Z)(r().mark((function e(t){return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:e.t0=t,e.next=e.t0===d.UP?3:e.t0===d.DOWN?9:15;break;case 3:return w(!0),e.next=6,P.upvote(o.id);case 6:return x(b+1),w(!1),e.abrupt("break",15);case 9:return A(!0),e.next=12,P.downvote(o.id);case 12:return L(N+1),A(!1),e.abrupt("break",15);case 15:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return(0,i.useEffect)((function(){P.getArticle(n).then((function(e){u(e),x(e.upvote),L(e.downvote)}))}),[]),void 0!==o?i.createElement(c.sI,null,i.createElement(f.q,null,i.createElement("title",null,"Blockipedia: ",o.title)),i.createElement("article",{className:m},i.createElement("div",{className:"[id]-module--headerSection--TjqUf"},i.createElement("div",{className:"[id]-module--headerInfo--dlMrz"},i.createElement("div",null,i.createElement("div",null,o.author),i.createElement("div",null,(t=o.published_date,new Date(t/1e6).toDateString()))),i.createElement("div",{className:"[id]-module--headerRating--6PcAb"},i.createElement("button",{disabled:g,onClick:function(){return j(d.UP)}},i.createElement(E(),null)),b,i.createElement("button",{disabled:C,onClick:function(){return j(d.DOWN)}},i.createElement(v(),null)),N)),i.createElement("div",{className:"[id]-module--headerAction--4AB8b"},i.createElement("button",{onClick:O.bind(null,!0)},"Donate"))),i.createElement("div",{className:"[id]-module--titleSection--gsLX6"},o.title),i.createElement("div",null,i.createElement(p.$,null,o.content))),i.createElement(s,{show:I,articleId:o.id,dismiss:O.bind(null,!1),donate:P.donate})):i.createElement(c.sI,null,i.createElement(f.q,null,i.createElement("title",null,"Blockipedia: Loading...")),i.createElement("article",{className:m},"Loading article ..."))}!function(e){e[e.UP=0]="UP",e[e.DOWN=1]="DOWN"}(d||(d={}))},2674:function(e,t,n){var l=n(7294);function a(e){return l.createElement("svg",e,[l.createElement("rect",{width:"48",height:"48",fill:"white",fillOpacity:"0.01",key:0}),l.createElement("path",{d:"M37 18L25 30L13 18",stroke:"black",strokeWidth:"4",strokeLinecap:"round",strokeLinejoin:"round",key:1})])}a.defaultProps={width:"30px",height:"30px",viewBox:"0 0 48 48",fill:"none"},e.exports=a,a.default=a},7174:function(e,t,n){var l=n(7294);function a(e){return l.createElement("svg",e,[l.createElement("rect",{width:"48",height:"48",fill:"white",fillOpacity:"0.01",key:0}),l.createElement("path",{d:"M13 30L25 18L37 30",stroke:"black",strokeWidth:"4",strokeLinecap:"round",strokeLinejoin:"round",key:1})])}a.defaultProps={width:"30px",height:"30px",viewBox:"0 0 48 48",fill:"none"},e.exports=a,a.default=a}}]);
//# sourceMappingURL=component---src-pages-read-[id]-tsx-b8c2f1275c701e679955.js.map