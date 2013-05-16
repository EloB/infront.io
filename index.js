module.exports = process.env.INFRONT_COV
  ? require('./lib-cov/infront')
  : require('./lib/infront');