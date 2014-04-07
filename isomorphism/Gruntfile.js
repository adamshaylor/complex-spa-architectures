module.exports = function (grunt) {


  var _ = require('lodash');


  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    watchify: {
      options: {
        debug: true
      },
      isomorphism: {
        src: './shared-modules/shirts.js',
        dest: 'public/javascripts/shirts-module.js'
      }
    }

  });


  grunt.loadNpmTasks('grunt-watchify');


  grunt.registerTask('default', ['watchify']);


};
