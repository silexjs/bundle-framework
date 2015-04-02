var extend = require('util')._extend;


var Form = function(container) {
	this.container = container;
	this.validator = this.container.get('validator');
	
	this.forms = this.buildForms(this.container);
	this.inputs = this.buildInputs(this.container);
	this.compile();
};
Form.prototype = {
	container: null,
	validator: null,
	forms: null,
	inputs: null,
	
	compile: function() {
		for(var inputKey in this.inputs) {
			var input = this.inputs[inputKey];
			input.name = input.name || inputKey;
			input.require = (input.require!==false?true:false);
			input.validators = input.validators || {};
			input.sanitizers = input.sanitizers || {};
		}
		for(var inputKey in this.inputs) {
			var input = this.inputs[inputKey];
			if(input.inherit !== undefined) {
				input.validators = extend(extend({}, this.inputs[input.inherit].validators), input.validators);
				input.sanitizers = extend(extend({}, this.inputs[input.inherit].sanitizers), input.sanitizers);
			}
		}
		for(var formKey in this.forms) {
			var inputsSave = this.forms[formKey].inputs;
			this.forms[formKey].inputs = [];
			for(var i in inputsSave) {
				this.forms[formKey].inputs.push(this.inputs[inputsSave[i]]);
			}
		}
	},
	
	isValid: function(form, datas, callback) {
		var datasEnd = {};
		var errorsEnd = {};
		var form = this.forms[form];
		var inputsLength = form.inputs.length;
		var inputsNow = 0;
		var next = function() {
			inputsNow++;
			if(inputsNow === inputsLength) {
				var isValid = true;
				for(var input in errorsEnd) {
					if(errorsEnd[input] !== null) {
						isValid = false;
						break;
					}
				}
				callback(isValid, datasEnd, errorsEnd);
			}
		};
		for(var inputKey in form.inputs) {
			var input = form.inputs[inputKey];
			datasEnd[input.name] = datas[input.name];
			errorsEnd[input.name] = null;
			if(datas[input.name] === undefined) {
				errorsEnd[input.name] = 'This field is required';
				next();
			} else {
				this.checkInput(input, datasEnd, errorsEnd, next);
			}
		}
	},
	
	isValidInput: function(inputName, data, callback) {
		var input = this.inputs[inputName];
		var datasEnd = {};
		var errorsEnd = {};
		datasEnd[input.name] = data;
		errorsEnd[input.name] = null;
		this.checkInput(input, datasEnd, errorsEnd, function() {
			callback(errorsEnd[input.name] === null, datasEnd[input.name], errorsEnd[input.name]);
		});
	},
	
	checkInput: function(input, datasEnd, errorsEnd, callback) {
		for(var sanitizer in input.sanitizers) {
			if(this.validator[sanitizer] !== undefined) {
				var result = this.validator[sanitizer].apply(null, [datasEnd[input.name]].concat(input.sanitizers[sanitizer] || []));
				if(result !== false || sanitizer === 'toBoolean') {
					datasEnd[input.name] = result;
				}
			}
		}
		var nextListLength = Object.keys(input.validators).length;
		var nextListNow = 0;
		var next = function(result) {
			nextListNow++;
			if(nextListNow !== -1 && (nextListNow === nextListLength || result === false)) {
				nextListNow = -1;
				callback();
			}
		};
		for(var validator in input.validators) {
			var validatorName = validator.replace(/_/g, '');
			if(this.validator[validatorName] !== undefined) {
				var result = this.validator[validatorName].apply(null, [datasEnd[input.name]].concat(input.validators[validator].args || []));
				if(result === false) {
					errorsEnd[input.name] = input.validators[validator].message || '';
				}
				next(result);
				if(result === false) {
					break;
				}
			} else if(validatorName === 'checkCallback') {
				if(input.validators[validator].args instanceof Array === true && typeof input.validators[validator].args[0] === 'function') {
					(function(input, validator, datasEnd, errorsEnd, next) {
						var isColled = false;
						var nextCheckCallback = function(result) {
							if(isColled === true) { return; }
							isColled = true;
							if(result === false) {
								errorsEnd[input.name] = input.validators[validator].message || '';
							}
							next(result);
						};
						var result = input.validators[validator].args[0].apply(null, [datasEnd[input.name], nextCheckCallback]);
						if(result !== undefined) {
							nextCheckCallback(result);
						}
					})(input, validator, datasEnd, errorsEnd, next);
				}
			}
		}
	}
};


module.exports = Form;
