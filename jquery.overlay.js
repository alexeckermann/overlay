/*
		
		jQuery.overlay
		==============
		Overlay and lightbox class for jQuery.
		
		Written by: Alex Eckermann
		Created on: 11 August 2010
		
		Version:    0.1
		jQuery:     1.8.2
		
		License:    Copyright (c) 2010 Alex Eckermann
								@alexeckermann
		
		Permission is hereby granted, free of charge, to any person obtaining
		a copy of this software and associated documentation files (the
		"Software"), to deal in the Software without restriction, including
		without limitation the rights to use, copy, modify, merge, publish,
		distribute, sublicense, and/or sell copies of the Software, and to
		permit persons to whom the Software is furnished to do so, subject to
		the following conditions:

		The above copyright notice and this permission notice shall be
		included in all copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
		EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
		MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
		NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
		LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
		OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
		WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
		
*/

$.fn.overlay = function() {
	var args = arguments;
  
  if(args.length < 1) {
    if(console && console.error) console.error("You must supply a function name or options to the Overlay plugin.");
    return;
  }

	if(!$.fn.position) {
		if(console && console.error) console.error("jQuery 1.8 needs to be provided for overlays to work");
    return;
	}

	var this_obj = this;
  
  var funcs = {
    // Initialise the Overlay container and inject to the DOM
    init: function(options){
            
      // -- Create our objects
      var container = $("<div class=\"overlay-container\"><div class=\"overlay-content\"></div></div>");
      var content = $(".overlay-content", container);
      
      // -- Do we want to inject this in an object or body?
      if(options && options.container) {
        $(options.container).prepend(container);
      } else {
        $("body").prepend(container);
      }

      return { container: container, content: content };

    },
		open: function(options) {
				
				if (!options.initOptions) { options.initOptions = {} };
				
	      // -- Sanity and Dependency checks
	      if(!options.obj){
	        // ---- No container was given, lets make one!
					if(this_obj && !options.container) { options.initOptions.container = $(this_obj); }
	        var objs = funcs.init(options.initOptions || {}),
	            container = $(objs.container),
	            content = $(objs.content);
	      } else {
	        var container = $(options.obj),
	            content = $(".overlay-content", container);      
	      }

	      // -- No anchor, fail!
	      if(!options.position) {
	        if(console && console.error) console.error("Overlay.open requires a position attribute be passed to it.");
	        return [];
	      }

	      // -- Add class if given in options
	      if(options["class"])
	        container.addClass(options["class"]);


	      // -- Have we been provided with an ajax option? Lets do an AJAX request if we do!
	      if(options.ajax) {

	        var _parent = funcs;

	        // ---- Accept options.ajaxData for any data to send off
	        $.get(options.ajax, $.extend(options.ajaxData || {}, {overlay: true}), function(data){
	          delete options.ajax;
	          _parent.open($.extend(options, {html: data, obj: container}), objs);
	        });

	        // ---- If we dont want to insert loading chrome, just return. AJAX success will set the content.
	        if(!options.html) {
	          return { container: container, content: content };
	        }

	      }

	      if(!options.html){
	        if(console && console.error) console.error("There is no HTML provided. At this point the Overlay requires HTML to continue.");
	        return [];
	      }
	
				// -- Assuming we have HTML
	      content.html(options.html);

	      // -- Pass some attributes over
	      if(options.attributes)
	        container.attr(options.attributes);

	      // -- Add events to the container
	      if(options.click){
	        container.click(options.click);
	      }

	      // -- This is used to check if we are positioning to a context or are given coords
	      // var relativePosition = false;

	      container.removeAttr("style");
        
        container.position(options.position)

	      // -- Alright then. Time to start the show!
	      container.addClass("overlay-open");

	      // -- This is for jQuery UI tabs. Make sure the overlay closes if we change tabs
	      $(".ui-tabs").one("tabsselect", function(){
	        container.remove();
	      })

	      // -- Want to hide flash objects? This is an issue in FFox w/ Linux that puts the overlay behing Flash objects visually. Just set the hideFlash option to true.
	      if(options.hideFlash == true)
	        $("embed").css("visibility", "hidden");

	      // -- Return our objects
	      return { container: container, content: content };
		
		},
		close: function(){
    
	    // -- $(document) as a given object will close ALL overlays
	    if(this_obj.is(".overlay-container")) {
	      var obj = this_obj;
	    } else {
	      var obj = $(".overlay-container");
	    }
          
	    // -- Trigger the close event on Overlay's
	    $(obj).trigger("close");
    
	    // -- Goodnight, sweet overlay prince
	    $(obj).remove();
    
	    // -- To undo our Flash fix, if there are no more Overlays then show all Flash
	    if($(".overlay-container").length < 1) {
	      $("embed").css("visibility", "visible");
	    }
    
	  },
		backing: function(){
	    
	    var backing = $(".overlay-backing");
	    
	    if(args[1] === true || args.length == 1) {
	      
	      if(backing.length == 0) {
	        backing = $("<div class=\"overlay-backing\"></div>");
  	      $("body").prepend(backing);
	      }
	      
	      backing.height($(window).height()).addClass("overlay-backing-visible");
	      
	    } else {
	      $(".overlay-backing").removeClass("overlay-backing-visible");
	    }
	    
	    return backing;
	    
	  }
	}
		
	// With what we were given, see what to do
	var request = args[0];

	if(request instanceof Object) {
	  // -- Force an open, we have options!
	 return funcs.open(request);
	} else {
	  // -- Find a function then pass options
	  return funcs[request]();
	} 

	return this;
	
	
}
