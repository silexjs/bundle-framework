var RedirectResponse = USE('Silex.HttpServerBundle.Http.RedirectResponse');


var Controller = function(container, request, response, end) {
	this.container = container;
	this.request = request;
	this.response = response;
	this.end = end;
};
Controller.prototype = {
	container: null,
	request: null,
	response: null,
	end: null,
	
	renderView: function(view, parameters) {
		parameters = parameters || {};
		return this.container.get('templating').renderView(view, parameters);
	},
	sendView: function(view, parameters, status) {
		parameters = parameters || {};
		status = status || 200;
		this.container.get('templating').sendView(view, parameters, status, this.request, this.response);
		return this;
	},
	sendText: function(text, status) {
		status = status || 200;
		this.container.get('templating').sendText(text, status, this.request, this.response);
		return this;
	},
	sendHtml: function(html, parameters, status) {
		parameters = parameters || {};
		status = status || 200;
		this.container.get('templating').sendHtml(html, parameters, status, this.request, this.response);
		return this;
	},
	sendJson: function(json, beautify, status) {
		beautify = beautify || false;
		status = status || 200;
		this.container.get('templating').sendJson(json, beautify, status, this.request, this.response);
		return this;
	},
	
	generatePath: function(route, variables) {
		variables = variables || {};
		return this.container.get('routing').generate(route, variables);
	},
	
	redirect: function(url, status) {
		status = status || 302;
		var redirect = new RedirectResponse(this.request, this.response);
		redirect.redirect(url, status);
		return this;
	},
	
	get: function(name) {
		return this.container.get(name);
	},
	
	getORM: function() {
		return this.container.get('orm');
	},
	getODM: function() {
		return this.container.get('odm');
	},
	getModel: function(name) {
		return this.container.get('models')(name);
	},
	getHandler: function(namespace) {
		return this.container.get('handlers')(namespace);
	},
	
	getUser: function() {
		return this.container.get('user')(this.request, this.response);
	},
	
	getForm: function(namespace) {
		return this.container.get('forms')(namespace);
	},
};


module.exports = Controller;
