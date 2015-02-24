var Routing = USE('Silex.Component.Routing.Routing');


var Framework = function(container, config, dispatcher, cache) {
	this.container = container;
	this.config = config;
	this.dispatcher = dispatcher;
	this.cache = cache;
};
Framework.prototype = {
	container: null,
	config: null,
	dispatcher: null,
	cache: null,
	
	onKernelReady: function(next) {
		this.createRouting();
		this.createTemplating();
		this.createModels();
		this.createHandlers();
		next();
	},
	
	createRouting: function() {
		var self = this;
		var routing = new Routing();
		this.container.set('routing', routing);
		this.dispatcher.dispatch('framework.routing.config', [routing], function() {
			routing.add(self.config.get('framework.routing.routes'));
			self.dispatcher.dispatch('framework.routing.compile', [routing], function() {
				routing.compile();
			});
		});
	},
	createTemplating: function() {
		var serviceName = this.config.get('framework.templating.engine');
		var templating = this.container.get(serviceName);
		this.container.set('templating', templating);
		this.dispatcher.dispatch('framework.templating.config', [templating]);
	},
	createModels: function() {
		var self = this;
		var orm = undefined;
		var odm = undefined;
		this.container.set('models', function(name) {
			if(orm === undefined) {
				orm = self.container.get('orm', false);
			}
			if(orm !== undefined && orm.models[name] !== undefined) {
				return orm.models[name];
			}
			if(odm === undefined) {
				odm = self.container.get('odm', false);
			}
			if(odm !== undefined && odm.models[name] !== undefined) {
				return odm.models[name];
			}
			throw new Error('The model "'+name+'" does not exist (ORM and ODM)');
		});
	},
	createHandlers: function() {
		var self = this;
		var models = this.container.get('models');
		
		this.container.set('handlers', function(namespace) {
			var key = 'SilexFrameworkBundle.handlers.'+namespace;
			var handler = self.cache.get(key);
			if(handler === undefined) {
				handler = USE(namespace);
				handler = new handler(models, self.container);
				self.cache.set(key, handler);
			}
			return handler;
		});
	},
};


module.exports = Framework;
