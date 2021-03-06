# Bassview

Pronounced "Base View." Like the instrument, asshole.

This little ditty was inspired in part by a [great article](http://ianstormtaylor.com/rendering-views-in-backbonejs-isnt-always-simple/) by Ian Storm Taylor, and my own pain in tracking down memory leaks in my Backbone apps due to [zombie views](https://www.google.com/search?q=zombie+views+in+backbone).

It is just an extension of a [Backbone.View](http://backbonejs.org/#View) that provides two helper methods: assign() and subview().


[![build status](https://secure.travis-ci.org/andyperlitch/bassview.png)](http://travis-ci.org/andyperlitch/bassview)

## Installation
	
### with browserify

	$ npm install bassview

Then, in a file:

	var View = require('bassview');
	var MyView = VIew.extend({
		
		initialize: function(options) {
			
			// set some subviews
			this.subview('mySubView', new View());
			this.subview('mySubView2', new View());
		}, 
		
		render: function() {
			
			var json = this.model.toJSON();
			var html = this.template(json);
			
			this.$el.html(html);
			
			this.assign({
				".my-sub-view": "mySubView",
				".my-sub-view2": "mySubView2"
			});
			
			return this;
		}
		
	});
	exports = MyView;
	

## Methods

### assign

Assigns one or more subviews to elements inside the parent view. 


#### Usage 1 - view.assign( String `selector`, Backbone.View `view` )

Assigns `view` to `selector`, internally calling `view.setElement(this.$(selector)).render();`. See link to Ian Storm's Taylor's blog article above.

	var parentview = new Bassview({...});
	var subview    = new Bassview({...});

	parentview.assign('div#subview-el', subview);

#### Usage 2 - view.assign( String `selector`, String `view_key` )

Same as above, but instead looks for a view registered through the `subview` method (below) with the name `view_key`.

	var parentview = new Bassview({...});
	parentview.subview('mySubView', new Bassview({...}));
	
	parentview.assign('div#subview-el', 'mySubView');


#### Usage 3 - view.assign( Object `selectors`)

Performs same action as above multiple times by specifying a single object as the only argument, so this:

	view.assign({
		".selector1" : new Basckbone.View({ model: this.model }),
		".selector2" : "mySubView",
		".selector3" : "myOtherSubView"
	});
	
Is equivalent to this:

	view.assign( ".selector1" , new Basckbone.View({ model: this.model }) );
	view.assign( ".selector2" , "registered_subview" );
	view.assign( ".selector3" , "other_subview );


#### Usage 4 - view.assign()

Looks for "pre-assigned" views. See the usage for the `subview` method below.


### subview

Registers a view as being a subview. Subviews will destroy themselves when their parent views have been removed, preventing zombie views. Also registered subviews can be `assign`ed using usage 2 and 4 above.

#### Usage 1 - view.subview( String `key` , Backbone.View `view` )

Sets a subview with an identifier of `key`. This means that `view` will call its own `remove` function when the parent view is removed.

	var parentview = new Bassview({...});
	parentview.subview('mySubView', new Bassview({...}));

#### Usage 2 - view.subview( String `key` )

Gets a subview registered with identifier `key`:

	var parentview      = new Bassview({...});
	var subview   = new Bassview({...});
	
	parentview.subview("a_key", subview);
	console.log(subview === parentview.subview("a_key"));
	>>> true
	
#### Usage 3 - view.subview( String `key`, Backbone.View `view`, String `selector` )

Same as usage 1, but also populates a hidden property called __preassigned with `selector`, so that the subview can be assigned with no arguments:

	var parentview = new Bassview({...});
	parentview.subview("mySubView", new Bassview({...}), "div#subview-el");
	parentview.subview("myOtherSubView", new Bassview({...}), "div#subview-el-2");

	parentview.assign();
	

## License

[WTFPL](http://www.wtfpl.net/)