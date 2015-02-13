var Extensions = function(kernel) {
	this.kernel = kernel;
};
Extensions.prototype = {
	kernel: null,
	routing: null,
	
	onRoutingCompile: function(next, routing) {
		this.routing = routing;
		next();
	},
	onTemplatingConfig: function(next, templating) {
		if(templating.name !== 'swig') {
			return;
		}
		var self = this;
		var swig = templating.swig;
		swig.setDefaults({ locals: {
			url: function(routeName, variables) {
				return self.routing.generate(routeName, variables || {});
			},
		} });
		next();
	},
};


module.exports = Extensions;
