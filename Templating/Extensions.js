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
		swig.setTag('url', function(str, line, parser, types) {
			return true;
		}, function(compiler, args, content, parent, options, blockName) {
			if(args[1] !== undefined && args[1][0] === '(') {
				var variables = args[1];
			} else if(args[1] !== undefined) {
				var variables = {};
				var argsVariables = args.slice(1);
				var argsVariablesLength = argsVariables.length;
				for(var i=0; i<argsVariablesLength; i=i+2) {
					variables[argsVariables[i].replace(/(')(.*)(')/g, '$2')] = argsVariables[i+1].replace(/(')(.*)(')/g, '$2');
				}
				variables = JSON.stringify(variables);
			}
			return '_output += _ext.SilexFrameworkBundle_routing_generate('+args[0]+', '+variables+');';
		});
		swig.setExtension('SilexFrameworkBundle_routing_generate', function(routeName, variables) {
			return self.routing.generate(routeName, variables || {});
		});
		next();
	},
};


module.exports = Extensions;
