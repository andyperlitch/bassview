var Backbone = require('backbone');
Backbone.$ = window.$;
var bassview = require('../');

describe('Bassview', function() {
   
    var v, sandbox;
   
    before(function() {
        $('body').append('<div id="sandbox"></div>');
    });
   
    after(function() {
        $('#sandbox').remove();
    });
   
    beforeEach(function() {
        sandbox = sinon.sandbox.create();
        var $el = $('<div class="testing"></div>');
        $el.appendTo('#sandbox');
        
        sandbox.spy(bassview.prototype, 'subview');
        sandbox.spy(bassview.prototype, 'assign');
        
        v = new bassview({
            el: $el[0]
        });
    });
    
    afterEach(function() {
        v.remove();
        sandbox.restore();
    });
   
    it('should be a Backbone.View', function() {
        expect(v).to.be.instanceof(Backbone.View);
    });
    
    describe('subview method', function() {
        
        it('should create one subview on a new subviews object when called with two args', function() {
            var sv;
            v.subview('myView', sv = new Backbone.View());
            expect(v).to.have.ownProperty('__subviews__');
            expect(v.__subviews__.myView).to.equal(v.subview('myView'));
        });
        
        it('should retrieve a subview when only passed a key', function() {
            var sv = new Backbone.View();
            v.subview('myView', sv);
            expect(v).to.have.ownProperty('__subviews__');
            expect(v.subview('myView')).to.equal(sv);
        });
        
        it('should populate the preassigned object if selector is past as third arg', function() {
            var sv = new Backbone.View();
            v.subview('myView', sv, '.myView');
            expect(v.subview('myView')).to.equal(sv);
            expect(v.__preassigned['.myView']).to.equal(sv);
        });
        
    });
    
    describe('assign method', function() {
       
        var sv, sv2;
        
        beforeEach(function() {
            v.$el.html('<div id="child"></div><div id="child2"></div>');
            sandbox.spy(Backbone.View.prototype, 'setElement');
            sv = new Backbone.View();
            sv2 = new Backbone.View();
        });
        
        afterEach(function() {
            v.$el.html('');
            sv = undefined;
        });
       
        it('should assign a view to a selector, ie call setElement on the subview with the correct element', function() {
            v.assign('#child', sv);
            expect(sv.setElement.withArgs(v.$('#child'))).to.have.been.calledOnce;
        });
        
        it('should be able to look up registered subviews', function() {
            v.subview('sv', sv);
            v.assign('#child', 'sv');
            expect(sv.setElement.withArgs(v.$('#child'))).to.have.been.calledOnce;
        });
        
        it('should assign registered subviews that have been preassigned when called with no args', function() {
            v.subview('sv', sv, '#child');
            v.subview('sv2', sv2, '#child2');
            v.assign();
            expect(sv.setElement.callCount).to.equal(4);
            expect(sv.setElement.withArgs(v.$('#child'))).to.have.been.calledOnce;
            expect(sv2.setElement.withArgs(v.$('#child2'))).to.have.been.calledOnce;
        });
        
    });
    
});