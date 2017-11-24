// setup global middleware here

/* From FRONT END MASTERS*/
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var override = require('method-override');

var session = require('express-session');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser')
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(app) {
/* From FRONT END MASTERS*/
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(override());

/* End FRONT END MASTERS*/

/*From Web*/
app.use(cookieParser('secrets'));
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.locals.siteTitle = 'Novus';

// Express Validator
app.use(expressValidator({
  customValidators: {
    enumerate: function(input, options) {
      return options.includes(input);
    },
    multiplyCheck: function(product, val1, val2) {
      var fVal1 = parseFloat(val1);
      var fVal2 = parseFloat(val2);
      var fProduct = parseFloat(product);
      console.log(fVal1, fVal2, fProduct);
      console.log(fVal1*fVal2 === fProduct);
      if (fVal1*fVal2 === fProduct) {
        return true;
      } else {
        return false;
      }
    },
    gte: function(param, num) {
        return param >= num;
    },
    lte: function(param, num) {
        return param <= num;
    }
  },
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});
/*End From Web*/
};