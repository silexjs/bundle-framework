var ErrorHttp = USE('Silex.HttpServerBundle.Error.Http');
var ErrorHttpNotFound = USE('Silex.HttpServerBundle.Error.HttpNotFound');


var EventHttpError = function(container) {
	this.container = container;
};
EventHttpError.prototype = {
	container: null,
	templating: null,
	
	onKernelReady: function(next) {
		this.routing = this.container.get('routing');
		next();
	},
	
	onError: function(next, e, request, response) {
		if(e instanceof ErrorHttp) {
			if(e instanceof ErrorHttpNotFound === true) {
				var pathname = require('url').parse(request.url).pathname;
				this.container.get('templating').sendView('SilexFrameworkBundle:error:error-404.html.twig', { error: e, pathname: pathname }, e.statusCode, request, response);
			}
		} else if(e instanceof Error) {
			this.container.get('templating').sendView('SilexFrameworkBundle:error:error.html.twig', { error: e }, 500, request, response);
		}
		next();
	},
};


module.exports = EventHttpError;































