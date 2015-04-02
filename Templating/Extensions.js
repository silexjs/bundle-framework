var Extensions = function(container, config) {
	this.container = container;
	this.config = config;
};
Extensions.prototype = {
	container: null,
	config: null,
	routing: null,
	
	onRoutingCompile: function(next, routing) {
		this.routing = routing;
		next();
	},
	onTemplatingConfig: function(next, templating) {
		if(templating.name !== 'swig') { return; }
		var self = this;
		var swig = templating.swig;
		swig.setDefaults({
			locals: {
				path: function(routeName, variables) {
					return self.routing.generate(routeName, variables || {});
				},
				get: function(serviceName) {
					return self.container.get(serviceName);
				},
				config: function(configName) {
					return self.config.get(configName);
				},
			},
		});
		next();
	},
};


module.exports = Extensions;
