var EventHttpController = function(container) {
	this.container = container;
};
EventHttpController.prototype = {
	container: null,
	routing: null,
	
	onKernelReady: function(next) {
		this.routing = this.container.get('routing');
		next();
	},
	
	onController: function(next, request, response) {
		var route = this.routing.match(request.req.method, request.url);
		if(route !== null) {
			request.route.found = true;
			request.route.type = route.type || 'controller';
			request.route.name = route.name;
			request.route.variables = route.variables;
			request.route.raw = route.raw;
			if(request.route.type === 'controller') {
				if(route.variables._controller === undefined) {
					throw new Error('The route has been found but the variable "_controller" does not exist');
				}
				var _controller = route.variables._controller.split(':');
				if(_controller.length !== 3) {
					throw new Error('The route has been found but the variable "_controller" is invalid (ex: "ExampleBundle:Controller:hello")');
				}
				request.controller.found = true;
				request.controller.bundle = _controller[0];
				request.controller.controller = _controller[1];
				request.controller.action = _controller[2];
			}
		}
		next();
	},
};


module.exports = EventHttpController;































