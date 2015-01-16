var parse = require('url').parse;

var ErrorHttpNotFound = USE('Silex.HttpServerBundle.Error.HttpNotFound');


var EventsHttp = function(container) {
	this.container = container;
};
EventsHttp.prototype = {
	container: null,
	templating: null,
	
	onKernelReady: function() {
		this.routing = this.container.get('routing');
	},
	
	onException: function(next, e, request, response) {
		if(e instanceof ErrorHttpNotFound === true) {
			this.container.get('templating').renderViewResponse('SilexFrameworkBundle:error:error-not-found.html.twig', { error: e }, request, response);
		} else if(e instanceof Error) {
			this.container.get('templating').renderViewResponse('SilexFrameworkBundle:error:error.html.twig', { error: e }, request, response);
		}
		next();
	},
};


module.exports = EventsHttp;































