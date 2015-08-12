
vinylsmith
==========

Process your Wintersmith site with Gulp plugins.


Synopsis
--------

```coffee
vinylsmith = require 'vinylsmith'
stylus    = require 'gulp-stylus'
pleeease  = require 'gulp-pleeease'
rev       = require 'gulp-rev'

# In your custom plugin (see Usage for more details):
# Instead of writing your own ContentPlugin, use vinylsmith to generate them!
env.registerContentPlugin 'styles', '**/*.styl',
  vinylsmith(env)
    .pipe(stylus, 'include css': true)   # compile stylus
    .pipe(pleeease)                      # autoprefix, minify
    .pipe(rev)                           # asset-hashing
```


Background
----------

[Wintersmith] is a nice static site generator, very extensible through plugins.
The problem is that, as of writing, [you cannot chain plugins together](https://github.com/jnordberg/wintersmith/issues/144).

This means you can’t create plugins that do one thing, and one thing well.
Instead, you have plugins that do several things,
such as [wintersmith-autoprefixer-sass] and [wintersmith-autoprefixer-less].
Now I use Stylus and where is wintersmith-autoprefixer-stylus?
No. You only have [wintersmith-stylus].

Building web sites nowadays requires you to preprocess, compile, and postprocess your assets.
Because of different needs and use cases, the combinations are infinite.
We won’t get very far without composability. And hence, vinylsmith!

[Wintersmith]: http://wintersmith.io/
[wintersmith-autoprefixer-sass]: https://www.npmjs.com/package/wintersmith-autoprefixer-sass
[wintersmith-autoprefixer-less]: https://www.npmjs.com/package/wintersmith-autoprefixer-less
[wintersmith-stylus]: https://www.npmjs.com/package/wintersmith-stylus

Usage
-----

Install it:

```
npm install --save-dev vinylsmith
```

Create a Wintersmith plugin:

```json
  "plugins": [
    "./plugins/bemuse.coffee"
  ],
```

Use `vinylsmith` in your plugin:

```coffee
vinylsmith = require 'vinylsmith'

stylus    = require 'gulp-stylus'
pleeease  = require 'gulp-pleeease'
babel     = require 'gulp-babel'
uglify    = require 'gulp-uglify'
rev       = require 'gulp-rev'

module.exports = (env, callback) ->

  env.registerContentPlugin 'styles', '**/*.styl',
    vinylsmith(env)
      .pipe(stylus, 'include css': true)
      .pipe(pleeease)
      .pipe(rev)

  env.registerContentPlugin 'scripts', '**/*.js',
    vinylsmith(env)
      .pipe(babel, experimental: true)
      .pipe(uglify)
      .pipe(rev)

  callback()
```

__Note:__ Don't call the plugin function! vinylsmith will call it for you. See also: [lazypipe].

__Note:__ Your Gulp plugin pipeline must emit only one file! This is by design, because Wintersmith assumes 1-to-1 mapping from content files to output files.

[lazypipe]: https://www.npmjs.com/package/lazypipe


Disclaimers
-----------

- I wrote and maintain this package for use in my own projects.
- Therefore, if you find issues with this package, please don’t expect me to fix it. This package’s code is less than 100 lines, and you are encouraged to fix it. Pull requests are welcome.
- There are no tests, but it worked pretty well for my project. If you feel the need for one, feel free to write one! Again, pull requests are welcome. :smiley:
