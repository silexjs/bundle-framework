var parse = require('url').parse;

var Routing = USE('Silex.Component.Routing.Routing');


var Framework = function(container, config, dispatcher) {
	this.container = container;
	this.config = config;
	this.dispatcher = dispatcher;
};
Framework.prototype = {
	container: null,
	config: null,
	dispatcher: null,
	
	onKernelReady: function(next) {
		this.createRouting();
		this.createTemplating();
		next();
	},
	
	createRouting: function() {
		var self = this;
		var routing = new Routing();
		this.container.set('routing', routing);
		this.dispatcher.dispatch('framework.routing.config', [routing], function() {
			routing.add(self.config.get('framework.routing.routes'));
			self.dispatcher.dispatch('framework.routing.compile', [routing], function() {
				routing.compile();
			});
		});
	},
	createTemplating: function() {
		var serviceName = this.config.get('framework.templating.engine');
		var templating = this.container.get(serviceName);
		this.container.set('templating', templating);
		this.dispatcher.dispatch('framework.templating.config', [templating]);
	},
};


module.exports = Framework;
