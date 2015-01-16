var RedirectResponse = USE('Silex.HttpServerBundle.Http.RedirectResponse');


var Controller = function(container, request, response) {
	this.container = container;
	this.request = request;
	this.response = response;
};
Controller.prototype = {
	container: null,
	request: null,
	response: null,
	
	renderView: function(view, parameters) {
		var parameters = parameters || {};
		this.container.get('templating').renderView(view, parameters);
	},
	render: function(view, parameters) {
		var parameters = parameters || {};
		this.container.get('templating').renderViewResponse(view, parameters, this.request, this.response);
	},
	
	generateUrl: function(route, variables, secure) {
		var variables = variables || {};
		if(secure === undefined) { var secure = false; }
		return this.container.get('routing').generate(route, variables, secure);
	},
	
	redirect: function(url, status) {
		var status = status || 302;
		var redirect = new RedirectResponse(request, response);
		redirect.redirect(url, status);
	},
	
	createNotFoundException: function(message, previous) {
		var previous = previous || null;
		
	},
};


module.exports = Controller;
