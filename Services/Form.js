var Form = function(container, cache) {
	this.container = container;
	this.cache = cache;
};
Form.prototype = {
	container: null,
	cache: null,
	
	onKernelReady: function(next) {
		this.createValidator();
		this.extendValidator();
		this.createForms();
		next();
	},
	
	createValidator: function() {
		this.container.set('validator', require('validator'));
	},
	extendValidator: function() {
		this.container.get('validator').extend('checkRegexp', function(input) {
			for(var key in arguments) {
				if(key != 0 && arguments[key].test(input) === false) {
					return false;
				}
			}
			return true;
		});
	},
	
	createForms: function() {
		var self = this;
		this.container.set('forms', function(namespace) {
			var key = 'SilexFrameworkBundle.forms.'+namespace;
			var form = self.cache.get(key);
			if(form === undefined) {
				form = USE(namespace);
				form = new form(self.container);
				self.cache.set(key, form);
			}
			return form;
		});
	},
};


module.exports = Form;
