var _ = require((typeof ENV_TEST === 'boolean') ? 'alloy' : 'underscore')._;

function validate(value, options) {
    options = _.defaults(options || {}, {
       trim: true,
       required: true,
       label: 'Value'
    });
    
    if (_.isObject(value)) {
        
        if (typeof value.value === 'string') {
            
            if (value.hintText) {
                options.label = value.hintText;
            }
            
            value = value.value;
            
        } else {
            var values = {};

            _.each(_.keys(value), function (key) {
                var keyOptions, keyValue;
                
                if (_.isArray(value[key])) {
                    keyValue = value[key][0];
                    keyOptions = _.defaults(value[key][1] || {}, options);
                    
                } else {
                    keyValue = value[key];
                    keyOptions = _.clone(options);
                }
                
                values[key] = validate(keyValue, keyOptions);
                
                return;
            });
            
            return values;
        }
    }
   
    if (typeof value === 'string' && options.trim) {
        value = value.trim();
    }
    
    delete options.trim;

    if (options.required && _.isEmpty(value)) {
        throw String.format(L('validate_required', '%s is required'), options.label);
    }
    
    delete options.required;
    
    var error;
    
    _.each(options, function (setting, key) {
        
        if (setting === false) {
            return;
        }

        switch (key) {
            
            case 'email':
                var email = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i;
                if (!email.test(value)) throw String.format(L('validate_email', '%s is no email address.'), options.label);
                break;
                
            case 'regexp':
                if (!setting.test(value)) throw String.format(L('validate_regexp', '%s is not valid.'), options.label);
                break;
                
            case 'numeric':
                if (!_.isFinite(value)) throw String.format(L('validate_numeric', '%s is not a number.'), options.label);
                break;
                
            case 'password':
                if (value.length < 6)
                    throw L('validate_password', 'Enter a valid password of 6 or more characters');
                break;
                
            case 'match':
                if (!(value === options.match))
                    throw L('validate_match', 'Password doesn\'t match confirmation');
                break;
                
            case 'zipcode':
                if (!_.isFinite(value) || value.length != 5)
                    throw L('validate_zipcode', 'Enter a valid zip code');
                break;
        }
       
        return;
    });
        
    return value;
}

if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
                exports = module.exports = validate;
        }
        exports.validate = validate;
}
