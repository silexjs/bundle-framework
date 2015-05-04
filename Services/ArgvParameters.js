var ArgvParameters = function(configService) {
	var iParams = process.argv.indexOf('-p');
	if(iParams === -1) {
		iParams = process.argv.indexOf('--parameters');
	}
	if(iParams !== -1) {
		var args = process.argv[iParams+1];
		if(args !== undefined && args != '') {
			args = args.split('|');
			for(var i in args) {
				var n = args[i].search(':');
				if(n !== -1) {
					var key = args[i].substr(0, n);
					var value = args[i].substr(n+1);
					configService.set('parameters.'+key, value);
				}
			}
		}
	}
};
ArgvParameters.prototype = {};


module.exports = ArgvParameters;
