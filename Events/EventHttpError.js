var ErrorHttp = USE('Silex.HttpServerBundle.Error.Http');
var ErrorHttpNotFound = USE('Silex.HttpServerBundle.Error.HttpNotFound');


var EventHttpError = function(container) {
	this.container = container;
};
EventHttpError.prototype = {
	container: null,
	templating: null,
	
	onKernelReady: function() {
		this.routing = this.container.get('routing');
	},
	
	onError: function(next, e, request, response) {
		if(e instanceof ErrorHttp) {
			response.statusCode = e.statusCode;
			if(e instanceof ErrorHttpNotFound === true) {
				var pathname = require('url').parse(request.url).pathname;
				this.container.get('templating').renderViewResponse('SilexFrameworkBundle:error:error-not-found.html.twig', { error: e, pathname: pathname }, request, response);
			}
		} else if(e instanceof Error) {
			response.statusCode = 500;
			this.container.get('templating').renderViewResponse('SilexFrameworkBundle:error:error.html.twig', { error: e }, request, response);
		}
		next();
	},
};


module.exports = EventHttpError;






























