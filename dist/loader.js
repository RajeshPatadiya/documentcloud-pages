
(function(){var Penny=window.Penny=window.Penny||{VERSION:'0.1.0',on:function(el,eventName,handler){if(el.addEventListener){el.addEventListener(eventName,handler);}else{el.attachEvent('on'+eventName,function(){handler.call(el);});}},ready:function(fn){if(document.readyState!='loading'){fn();}else if(document.addEventListener){document.addEventListener('DOMContentLoaded',fn);}else{document.attachEvent('onreadystatechange',function(){if(document.readyState!='loading'){fn();}});}},forEach:function(array,fn){var len=array.length;for(i=0;i<len;i++){fn(array[i],i);}},};}());if(!window.console){window.console={log:function(message){},info:function(message){},warn:function(message){},error:function(message){},};}
(function(){Penny.ready(function(){var insertStylesheet=function(){if(!document.querySelector('link[href$="page_embed.css"]')){var stylesheet=document.createElement('link');stylesheet.rel='stylesheet';stylesheet.type='text/css';stylesheet.media='screen';stylesheet.href='dist/page_embed.css';document.querySelector('head').appendChild(stylesheet);}};var insertJavaScript=function(onLoadCallback){if(!document.querySelector('script[src$="page_embed.js"]')){var page_embed_js=document.createElement('script');page_embed_js.src="dist/page_embed.js";Penny.on(page_embed_js,'load',onLoadCallback);document.querySelector('body').appendChild(page_embed_js);}};var generateUniquePageElementId=function(documentSlug,pageNumber){var i=1;var id=documentSlug+'-p'+pageNumber+'-i'+i;while(document.getElementById(id)){id=id.replace(/-i[0-9]+$/,'-i'+i++);}
return id;};var extractOptionsFromStub=function(stub){var options=stub.getAttribute('data-options');if(options){try{options=JSON.parse(options);}
catch(err){console.error("Inline DocumentCloud embed options must be valid JSON. See https://www.documentcloud.org/help/publishing.");options={};}}else{options={};}
return options;};var enhanceStubs=function(){var stubs=document.querySelectorAll('.DC-embed');Penny.forEach(stubs,function(stub,i){var href=stub.querySelector('.DC-embed-resource').getAttribute('href');var components=href.match(/\/documents\/([A-Za-z0-9-]+)\.html\#document\/p([0-9]+)$/);if(components){var documentSlug=components[1];var pageNumber=components[2];var elementId=generateUniquePageElementId(documentSlug,pageNumber);stub.className='DC-embed-enhanced';stub.setAttribute('data-resource-type','page');stub.setAttribute('id',elementId);var embedOptions=extractOptionsFromStub(stub);embedOptions.page=pageNumber;embedOptions.container='#'+elementId;DocumentCloud.embed.loadPage('//www.documentcloud.org/documents/'+documentSlug+'.json',embedOptions);}else{console.error("The DocumentCloud URL you're trying to embed doesn't look right. Please generate a new embed code.");}});};insertStylesheet();if(window.DocumentCloud){enhanceStubs();}else{insertJavaScript(enhanceStubs);}});})();