(function( $, window, document, undefined ) {

	if ( typeof Object.create !== "function" ) {
		
		Object.create = function( obj ) {
			
			function F() {};
			F.prototype = obj;
			return new F();
		};
	}

	var methods = {
		
		init :function(options, el){
			
			var self 		= this;
			self.$elem 		= $(el);
			
			var defaults = {
					boundaryElement 		: false,
					boundaryPosition		: 'bottom',
					responsive				: true,
					boundaryObserver		: false,
					topOffset				: 0,
					bottomOffset			: 0
			};
			
			self.options 	= $.extend({}, defaults, options);

			self.originalPosition 	= false,
			self.isStuck			= false,
			self.isActive			= true,
			self.wasActivated		= false;
			self.direction 			= false,
			self.progress			= 0;
			
			
			if ( (self.checkBrowser()).isTouch || !self.options.boundaryElement ){
				
				return;
			} 
									
			// position relative needed when we reach the bottom
			self.$elem.parent().css({"position":"relative"});

			self.scrolling();
			self.layoutChange();
			
			if ( self.options.boundaryObserver ) {
				
				self.observer(self.options.boundaryElement, function(){ self.reacter(); });
			}
		},

		checkBrowser : function(){
			
			//Check 3d support
			var	translate3D = "translate3d(0px, 0px, 0px)",
				tempElem 	= document.createElement("div");

			tempElem.style.cssText = 	"  -moz-transform:"    + translate3D +
								  		"; -ms-transform:"     + translate3D +
								  		"; -o-transform:"      + translate3D +
								  		"; -webkit-transform:" + translate3D +
								  		"; transform:"         + translate3D;
			
			var	regex 		= /translate3d\(0px, 0px, 0px\)/g,
				asSupport 	= tempElem.style.cssText.match(regex),
				support3d 	= (asSupport !== null && asSupport.length === 1);
				
			var isTouch 	= ("ontouchstart" in window || navigator.msMaxTouchPoints) ? true : false;

			var browser = {
					"support3d" : support3d,
					"isTouch" 	: isTouch
			}
			
			return browser;
		},
		
		observer : function(element, callback){
		
			var self 					= this,
				obj 					= $(element)[0],
				MutationObserver 		= window.MutationObserver || window.WebKitMutationObserver,
				eventListenerSupported 	= window.addEventListener;		

	        if ( MutationObserver ){
	            
	            var obs = new MutationObserver(function(mutations, observer){
	                
	                if ( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
	                    callback();
	            });
	            
	            obs.observe( obj, { childList:true, subtree:true });
	        }
	        else if ( eventListenerSupported ) {

	            obj.addEventListener('DOMNodeInserted', callback, false);
	            obj.addEventListener('DOMNodeRemoved', callback, false);
	        }			
		},
		
		reacter : function(){
			
			var self = this;

			self.checkActivation();
			self.scrollDown();			
		},		
				
		scrolling : function(){
			
			var self = this;
			
			$(window).scroll(function() {
			
				if ( self.options.responsive ) {
				
					if ( window.DI.activeLayout() == 'desktop' ) {
					
						self.detectDirection();
						self.checkActivation();
				
						( self.direction == 'down' ) ? self.scrollDown() : self.scrollUp();	
					}
				} else {
					
					self.detectDirection();
					self.checkActivation();
			
					( self.direction == 'down' ) ? self.scrollDown() : self.scrollUp();	
				} 			
			});			
		},		

		layoutChange : function(){
			
			var self = this;
			
			if ( self.options.responsive ) {
			
				$(window).bind('orientationchange resize', function(e) {
	
					if ( window.DI.activeLayout() != 'desktop' ) {
	
						self.elemPositionReset();
						self.originalPosition 	= false;	
						self.isStuck			= false;										
					} 
				});
			}
		},		

		checkActivation : function(){
			
			var self = this; 
			
			self.elementOffset 	= self.$elem.offset().top + self.$elem.height();			
			self.limitOffset	= $(self.options.boundaryElement).offset().top;	
			// Needed for compensate on relative positioning the parent element
			self.parentOffset 	= self.$elem.parent().offset().top;			
			
			if ( self.options.boundaryPosition == 'bottom' ) {
				
				self.limitOffset += $(self.options.boundaryElement).height();
			} 
			self.isActive 		= ( self.elementOffset > self.limitOffset ) ? false : true;
		},

		scrollDown : function() {
			
			var self 		= this,
				elemHeight 	= self.$elem.height(),
				elemOffset 	= ( self.$elem.offset().top - self.options.topOffset - (self.$elem.outerHeight() - elemHeight) );
			
			// if when scrolling we reach the top position of the element 
			if ( $(window).scrollTop() >= elemOffset ) {	

				if ( $(window).scrollTop() >= (self.limitOffset - elemHeight - self.options.topOffset - self.options.bottomOffset) ){
				
					if (!self.isStuck && self.wasActivated){
				
						if (!self.originalPosition) {
						
							self.originalPosition = elemOffset;
						}
						self.$elem.css({'position': 'absolute', 'top': (self.limitOffset - elemHeight - self.options.bottomOffset - self.parentOffset)+'px' });
						self.isStuck = true;
					}
				} else {
				
					if ( self.isActive ){

						if (!self.originalPosition) {
						
							self.originalPosition = elemOffset;
						}
						self.$elem.css({'position': 'fixed', 'top': self.options.topOffset });	
						self.isStuck		= false;
						self.wasActivated 	= true;
					}
				}
			} 
		},

		scrollUp : function() {
			
			var self 		= this,
				elemHeight 	= self.$elem.height(); 
							
			if ( self.originalPosition ) {

				if ( $(window).scrollTop() <= ( self.limitOffset - elemHeight - self.options.topOffset - self.options.bottomOffset ) ){
					
					if ( $(window).scrollTop() <= ( self.originalPosition ) ) {
					
						self.elemPositionReset();
						self.originalPosition 	= false;	
						self.isStuck			= false;						
					} else {
						
						self.$elem.css({'position': 'fixed', 'top': self.options.topOffset });	
						self.isStuck = false;
					}
				}
			} 			
		},
		
		detectDirection : function() {
			
			var self = this;
			
			if ( $(window).scrollTop() > self.progress ) {
			
				self.progress 	= $(window).scrollTop();
				self.direction 	= 'down';  
			}
		
			if ( $(window).scrollTop() < self.progress ) {
			
				self.progress 	= $(window).scrollTop();
				self.direction 	= 'up';  			
			}			
		},

		elemPositionReset : function() {
			
			var self = this;
			
			self.$elem.attr('style', '');			
		},
		
		destroy : function(){
			
			var self = this;
			
			self.elemPositionReset();
		}
	};

	$.fn.StickyBTF = function( options ) {
		
		return this.each(function() {
						
			var sticky = Object.create( methods );
			
			sticky.init( options, this );
			$.data( this, "StickyBTF", sticky );
		});
	};
})( jQuery, window, document );