var GoogleAnalytics, tracker, Fields, MapBuilder;

exports.id = null;

exports.screen = function screen(name) {
  return init().send(MapBuilder.createAppView().set(Fields.SCREEN_NAME, name).build());
};

exports.event = function event(category, action, label, value) {

  if (typeof category === 'object') {
    var args = category;
    category = args.category;
    action = args.action;
    label = args.label;
    value = args.value;
  }

  // throw exception if it's NULL or undefined.
  value = value || 0;

  return init().send(MapBuilder.createEvent(category, action, label, value).build());
};

exports.social = function social(network, action, target) {

  if (typeof network === 'object') {
    var args = network;
    network = args.network;
    action = args.action;
    target = args.target;
  }

  return init().send(MapBuilder.createSocial(network, action, target).build());
};

exports.timing = function timing(category, intervalInMilliseconds, name, label) {

  if (typeof category === 'object') {
    var args = category;
    category = args.category;
    intervalInMilliseconds = args.intervalInMilliseconds || args.interval;
    name = args.name;
    label = args.label;
  }

  return init().send(MapBuilder.createTiming(category, intervalInMilliseconds, name, label).build());
};

exports.transaction = function transaction(transactionId, affiliation, revenue, tax, shipping, currencyCode) {

  if (typeof transactionId === 'object') {
    var args = transactionId;
    transactionId = args.transactionId || args.id;
    affiliation = args.affiliation;
    revenue = args.revenue;
    tax = args.tax;
    shipping = args.shipping;
    currencyCode = args.currencyCode || args.currency;
  }

  return init().send(MapBuilder.createTransaction(transactionId, affiliation, revenue, tax, shipping, currencyCode).build());
};

exports.tracker = function tracker() {
  return init();
};

exports.logLevel = function logLevel(mode) {
  init();
  
  return GoogleAnalytics.setLogLevel(GoogleAnalytics['LOG_' + (mode || 'ERROR').toUpperCase()]);
};

function init() {

  if (!GoogleAnalytics) {
    GoogleAnalytics = require('ti.googleanalytics');
    GoogleAnalytics.setLogLevel(GoogleAnalytics.LOG_ERROR);
    tracker = GoogleAnalytics.getTracker(exports.id);
    Fields = GoogleAnalytics.getFields();
    MapBuilder = GoogleAnalytics.getMapBuilder();
  }

  return tracker;
}

exports.init = init;
