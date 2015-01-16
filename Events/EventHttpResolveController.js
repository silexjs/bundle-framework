var parse = require('url').parse;

var ErrorHttpNotFound = USE('Silex.HttpServerBundle.Error.HttpNotFound');


var EventsHttp = function(container) {
	this.container = container;
};
EventsHttp.prototype = {
	container: null,
	routing: null,
	
	onKernelReady: function() {
		this.routing = this.container.get('routing');
	},
	
	onResolveController: function(next, request, response, controller) {
		var urlParse = parse(request.url);
		var found = this.routing.match(urlParse.hostname, request.req.method, urlParse.pathname);
		if(found !== null) {
			if(found.variables._controller === undefined) {
				throw new Error('The route has been found but the variable "_controller" does not exist');
			}
			var _controller = found.variables._controller.split(':');
			if(_controller.length !== 3) {
				throw new Error('The route has been found but the variable "_controller" is invalid (ex: "ExampleBundle:Controller:hello")');
			}
			controller.routeName = found.routeName;
			controller.route = found.route;
			controller.variables = found.variables;
			controller.bundle = _controller[0];
			controller.controller = _controller[1]+'Controller';
			controller.action = _controller[2]+'Action';
		}
		next();
	},
};


module.exports = EventsHttp;































