# Video Annotator
A web application for annotating videos.

## Prerequisites
* Node.js - Download and Install [Node.js](http://www.nodejs.org/download/). You can also follow [this gist](https://gist.github.com/isaacs/579814) for a quick and easy way to install Node.js and npm

### Tools Prerequisites
* Yeoman - Install [Yeoman](http://yeoman.io/) with npm:

    ```
    $ npm install -g yo
    ```
    
    Yeoman comes with [Grunt](http://gruntjs.com/) (the JavaScript task runner) and [Bower](http://bower.io/) (the web package manager).

## Set up
Install dependencies:

    $ npm install && bower install

Use [Grunt](https://github.com/gruntjs/grunt-cli) to start the server:

    $ grunt serve

## Troubleshooting
During install some of you may encounter some issues, most of this issues can be solved by one of the following tips.

### Update NPM, Bower or Grunt
Sometimes you may find there is a weird error during install like npm's *Error: ENOENT*, usually updating those tools to the latest version solves the issue.

Updating NPM:
```
$ npm update -g npm
```

Updating Grunt:
```
$ npm update -g grunt-cli
```

Updating Bower:
```
$ npm update -g bower
```

### Cleaning NPM and Bower cache
NPM and Bower has a caching system for holding packages that you already installed.
Often cleaning the cache solves some troubles this system creates.

NPM Clean Cache:
```
$ npm cache clean
```

Bower Clean Cache:
```
$ bower cache clean
```

## Deployment

To generate a dist folder that can easily be deployed use:

```bash
grunt build
```

This will run jshint, concatenate and minify scripts/css, compress images, add css vendor prefixes, and finally copy all files to a tidy dist folder.

To launch the app in development mode use

```bash
grunt serve
```

To launch the app in production mode using the minified/optimized dist folder:

```bash
grunt serve:dist
```

### Livereload

`grunt serve` will watch files in `app/`, reloading the page when a change is detected.


## Help
Any questions? Open an issue or message [@tfogo](https://github.com/tfogo).

## License

??
