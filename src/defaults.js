const execFileSync = require('child_process').execFileSync

exports.readSync = (bundleId, key) => {
  const output = execFileSync('/usr/bin/defaults', ['read', bundleId, key], {encoding: 'utf8'})
  if (output) {
    return JSON.parse(output)
  }
}

exports.writeSync = (bundleId, key, value) => {
  const string = JSON.stringify(value)
  execFileSync('/usr/bin/defaults', ['write', bundleId, key, '-string', string], {encoding: 'utf8'})
}
