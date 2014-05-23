/*!
 * Squeezebox
 * A minimal, versatile and ultra-light jQuery accordion  plugin
 * 
 * MIT License
 * by Nobita
 */

;(function ( $, window, document, undefined ) {

	"use strict";

	var Squeezebox = {
		main : this,
		init: function(el, opts){
			this.opts = opts;
			this.wrap = $(el);
			this.heads = this.wrap.find( opts.headers );
			this.folders = this.wrap.find( opts.folders );
			this.openMethod = opts.animated ? 'slideDown' : 'show';
			this.closeMethod = opts.animated ? 'slideUp' : 'hide';
			// * If animted is true and timing is passed use the value the user requested. 
			// * If animated is true but no timing is passed default to 700
			// * If animated is false no timing is needed
			this.timing = opts.animated ? opts.timing || 700 : null;
			// Only hide folders if the user requests it
			if ( opts.closedOnStart ) { this.folders.hide(); }

			this.setListeners();
		},

		setListeners: function(){
			var self = this;
			this.heads.on('click', function(){
				self.clickedEl = $(this);
				// cache the folders related to the clicked heading
				self.relatedFolder = self.clickedEl.next( self.opts.folders );
				self.toggleFolders();
			});
		},
		toggleFolders: function( ){

			// if related folder is already open
			if ( this.relatedFolder.is(':visible')){
				this.relatedFolder[this.closeMethod]( this.timing, this.fireCallback('onClose') );
				return;
			}
			if ( this.opts.closeOthers === true ) {
				this.folders[this.closeMethod]( this.timing, this.fireCallback('onClose') );
			}
			this.relatedFolder[this.openMethod]( this.timing, this.fireCallback('onOpen') );
		},
		fireCallback: function(dir){
			// check if a callback is passed (ex: this.opts.onOpen).
			// If it's the case then execute it passing the whole obj (this)
			// as a parameter, thus exposing all the elements to the user as 
			// this API:
			// {
			//	 wrap: the wrapping div where the whole plugin fires,
			//  clickedEl = the heading that was clicked
			//  relatedFolder = the related div that is toggled
			//}
			(this.opts[dir]) ? this.opts[dir](this) : null;
		}
	};

	/**
	 * Object.create Polyfill for ECMAScript 5 Support
	 * http://leoasis.github.io/posts/2013/01/24/javascript-object-creation-patterns/
	 * see also: http://jsperf.com/new-vs-object-create-including-polyfill
	 */
	if (typeof Object.create !== "function") {
		Object.create = (function () {
			function F() {};
			return function (o) {
				F.prototype = o;
				return new F();
			};
		})();
	}


    $.fn.squeezebox = function(custom){

        // Create some defaults, extend them with any options that the user passes in.
        var opts = $.extend( {}, {
									// Defaults
									headers: '.squeezhead',
									folders: '.squeezecnt',
									closeOthers: true,
									closedOnStart: true,
									animated : true
                            	},
								// User-defined overrides
								custom);

        return this.each( function(){

			// We set up the prototype chain...
			var squeezebox = Object.create(Squeezebox);
			// ...and get the ball rolling, passing the node (wrapper) where
			// the whole plugin fires and the options as arguments
			squeezebox.init( this, opts );
        });
    };

})( jQuery, window, document );










