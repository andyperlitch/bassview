var _ = require('underscore'), Backbone = require('backbone');
var BassView = Backbone.View.extend({
    
    // Assigns a view to a jquery selector in this view's element.
    // the second parameter may be an actual backbone view, or a 
    // key for a registered subview via the subview() method below.
    assign : function (selector, view) {
        var selectors;
        if (_.isObject(selector)) {
            // Check if assignments were past as a map
            selectors = selector;
        }
        else if (view) {
            // Check if view was past as second arg
            selectors = {};
            selectors[selector] = view;
        }
        else if (_.isObject(this.__preassigned)) {
            // Check if any subviews have been pre-assigned 
            // to selectors when they were instantiated.
            selectors = _.extend({}, this.__preassigned);
        } else {
            return;
        }
        
        // Loop through the object and call setElement for all
        _.each(selectors, function (view, selector) {
            if (typeof view === "string") {
                view = this.__subviews__[view];
                if (typeof view === 'undefined') {
                    throw new Error('view "'+selectors[selector]+'" not found in registered subviews!');
                }
            }
            view.setElement(this.$(selector)).render();
        }, this);
    },
    
    // Triggers a custom event that can be listened for 
    // by subviews etc. Also unbinds events to prevent
    // detached DOM elements.
    remove: function () {
        this.trigger("clean_up");
        this.unbind();
        Backbone.View.prototype.remove.call(this);
    },
    
    // Registers or retrieves a subview of this view.
    // The main thing here is to automate the process of
    // having subviews listen to their parents for clean_up.
    subview: function(key, view, selector){
        // Set up subview object
        var sv = this.__subviews__ = this.__subviews__ || {};
        
        // Check if getting
        if (view === undefined) return sv[key];
        
        // Add listener for removal event
        view.listenToOnce(this, "clean_up", function() {
            view.remove();
            delete sv[key];
        });
        
        // Set the key
        sv[key] = view;
        
        // Check for pre-assignment
        if (selector) {
            this.__preassigned = this.__preassigned || {};
            this.__preassigned[selector] = view;
        }
        
        // Allow chaining
        return view
    }
    
});

exports = module.exports = BassView