module.exports = function (env) {
  const log = console.log

  return function () {
    log.apply(this, [env, ...arguments])
  }
}