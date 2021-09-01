module.exports = function (env) {
  const log = console.log

  return function () {
    log.apply(this, ['%c' + arguments[0], 'color: #bada55', ...[].slice.call(arguments, 1)])
  }
}