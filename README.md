# jQuery StickyBTF Plugin V1.0 #

### Author: Andrea Lai (me@andrealai.com), ###

### Description: ###
The plugin allows us to stick the position of the BTF ad in the RHR or any other element whenever the user scroll over the element position.
In order to let the plugin works we have to specify an element beyond which the BTF stop to be sticky.
This element could be the river of the page, another element etc. and we can also specify if the limit will be the bottom or the top of the element choosen.
It also possible to specify an offset for both top and bottom of the BTF in order to have always a space around the element when sticky.

### Options: ###

	- boundaryElement 	( default false ) 	: The element beyond which the BTF stop to be sticky
	- boundaryPosition 	( default: bottom )	: Specify if we consider as limit the top or the bottom of the boundaryElement
	- topOffset 		( default 0 )		: The amount of space left on top of the BTF when will be "sticky"
	- bottomOffset 		( default 0 )		: The amount of space left on the bottom when the BTF will reach the bottom limit
	- responsive 		( default true )	: When plugged within RWD sites using layoutinfo.js it prevents to activate the Sticky functionality on layout other than desktop.
	- boundaryObserver	( default false )	: When set to true the plugin will monitor any change of boundaryElement that might effect the BTF position 
 ### Usages: ###

	`$('#btf-mpu-ad-con').StickyBTF({"boundaryElement": ".l-left", "topOffset": 20, "bottomOffset": 20 });`

