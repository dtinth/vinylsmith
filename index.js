
var fs        = require('vinyl-fs')
var lazypipe  = require('lazypipe')
var buffer    = require('vinyl-buffer')
var through2  = require('through2')
var util      = require('util')


function Source(path, base, piper) {

  return {

    compile: function(callback) {

      // receives 1 file from the stream, and calls the callback
      function emitter() {

        var emitted = false

        return through2.obj(function(vinyl, enc, cb) {
          if (emitted) {
            console.error('Oops! Your pipe should emit only one file!')
          } else {
            emitted = true
            callback(null, vinyl)
          }
          cb()
        }, function(cb) {
          if (!emitted) {
            callback(new Error('No files received from your pipe!'))
          }
          cb()
        }).on('error', function(err) {
          if (emitted) {
            return console.error(err)
          } else {
            emitted = true
            return callback(err)
          }
        })
      }

      return fs.src(path, { base: base }).pipe(piper()).pipe(buffer()).pipe(emitter())
    }
  }
}


function vinylsmith(env) {

  function VinylPlugin(_filename, _source) {
    this._filename  = _filename
    this._source    = _source
  }

  util.inherits(VinylPlugin, env.ContentPlugin)

  VinylPlugin.prototype.getFilename = function() {
    return this._filename
  }

  VinylPlugin.prototype.getView = function() {
    return function(env, locals, contents, templates, callback) {
      return this._source.compile(function(err, vinyl) {
        if (err) {
          return callback(err)
        } else {
          return callback(null, vinyl.contents)
        }
      })
    }
  }

  function createContentPlugin(piper) {

    return {

      pipe: function() {
        return createContentPlugin(piper.pipe.apply(piper, arguments))
      },
      fromFile: function(filepath, callback) {
        var source = new Source(filepath.full, env.contentsPath, piper)
        return source.compile(function(err, vinyl) {
          if (err) {
            return callback(err)
          } else {
            return callback(null, new VinylPlugin(vinyl.relative, source))
          }
        })
      },
    }
  }

  return createContentPlugin(lazypipe())
}


module.exports = vinylsmith
