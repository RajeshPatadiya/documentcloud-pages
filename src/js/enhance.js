/*!
 * Enhance
 * A small library of components shared between both the enhance.js embed loader
 * and actual embed libraries. It should remain very small.
 *
 * Depends on either `setup.js` (for Underscore) or Penny.
 *
 * @license (c) 2015 Justin Reese, DocumentCloud
 * Enhance may be freely distributed under the MIT license.
 *
 */

(function(){

  Penny.ready(function(){

    if (!window.DCEmbedToolbelt) {
      console.error("DocumentCloud embed can't load because of missing components.");
      return;
    }

    // Insert the necessary stylesheet into the head, unless it's already there.
    var insertStylesheet = function(href) {
      if (!document.querySelector('link[href$="' + href + '"]')) {
        var stylesheet       = document.createElement('link');
            stylesheet.rel   = 'stylesheet';
            stylesheet.type  = 'text/css';
            stylesheet.media = 'screen';
            stylesheet.href  = href;
        document.querySelector('head').appendChild(stylesheet);
      }
    };

    // Insert the necessary JavaScript into the body, unless it's already there.
    var insertJavaScript = function(src, onLoadCallback) {
      if (!document.querySelector('script[src$="' + src + '"]')) {
        var script = document.createElement('script');
            script.src   = src;
            script.async = true;
        Penny.on(script, 'load', onLoadCallback);
        document.querySelector('body').appendChild(script);
      }
    };

    // Takes an embed stub DOM element and looks for a `data-options` attribute 
    // that contains a JSON representation of options.
    var extractOptionsFromStub = function(stub) {
      var options = stub.getAttribute('data-options');
      if (options) {
        try {
          options = JSON.parse(options);
        }
        catch(err) {
          console.error("Inline DocumentCloud embed options must be valid JSON. See https://www.documentcloud.org/help/publishing.");
          options = {};
        }
      } else {
        options = {};
      }
      return options;
    };

    // Convert embed stubs to real live embeds. If this fails, stubs remain 
    // usable as effectively `noscript` representations of the embed.
    var enhanceStubs = function() {
      // `enhanceStubs() will only be called after `window.DocumentCloud` is
      // confirmed available.
      var DocumentCloud = window.DocumentCloud;

      var stubs = document.querySelectorAll('.DC-embed[data-version^="1."]');
      Penny.each(stubs, function (stub, i) {
        if (stub.className.indexOf('DC-embed-enhanced') != -1) { return; }
        var resourceElement = stub.querySelector('.DC-embed-resource');
        var resourceUrl     = resourceElement.getAttribute('href');
        var resource        = DCEmbedToolbelt.recognizeResource(resourceUrl);
        if (!Penny.isEmpty(resource)) {
          // Changing the class name means subsequent runs of the loader will
          // recognize this element has already been enhanced and won't redo it.
          stub.className += ' DC-embed-enhanced';
          stub.setAttribute('data-resource-type', resource.resourceType);

          // Options come from three places:
          // 1. JSON hash passed in via the stub's `data-options` attribute
          // 2. Resource-specific options composed in `recognizeResource()`
          // 3. Resource-agnostic options
          var embedOptions = Penny.extend({},
            extractOptionsFromStub(stub),
            resource.embedOptions,
            { container: stub }
          );

          DocumentCloud.embed.load(resource, embedOptions);
        } else {
          console.error("The DocumentCloud URL you're trying to embed doesn't look right. Please generate a new embed code.");
        }
      });
    };

    // Combine default config with environment-set config
    var loadConfig = function() {
      var defaultConfig = {
        page: {
          assetPaths: {
            app:   "../dist/page_embed.js",
            style: "../dist/page_embed.css"
          }
        }
      };
      // Safely try to access potentially undefined config options
      try { var envConfig = window.ENV.config.embed; }
      catch (e) { var envConfig = {}; }
      return Penny.extend({}, defaultConfig, envConfig);
    };

    // Definitions are complete. Do things!

    // TODO: Support more resource types; will have to scan the DOM for all
    //       embed types before enhancing.
    var config = loadConfig();
    insertStylesheet(config.page.assetPaths.style);
    if (window.DocumentCloud) {
      enhanceStubs();
    } else {
      insertJavaScript(config.page.assetPaths.app, enhanceStubs);
    }

  });

})();
