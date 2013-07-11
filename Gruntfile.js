/*global module:false*/
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-coffee');


  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.1.0',
      banner: '/*! Polaris: Project Freedom - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n'
    },
    min: {
      dist: {
        src: 'scripts/dist/main.js',
        dest: 'scripts/dist/main.min.js'
      }
    },
    watch: {
      scripts:{
        files: ['scripts/app.coffee', 'scripts/**/*.coffee'],
        tasks: ['coffee','concat']
      },
      styles:{
        files:['styles/*.less'],
        tasks: ['less']
      }
    },
    less: {
      dist: {
        files: {
        'styles/dist/main.css': 'styles/verbose.less'
        }
      }
    },
    coffee: {
      compile: {
        files:{
          "scripts/app.js":["scripts/app.coffee", "scripts/**/*.coffee"]
        }
      }
    },
    concat: {
      dist: {
        src: [
          'scripts/libs/lodash.js',
          'scripts/libs/store.js',
          'scripts/libs/jquery-2.0.2.min.js',
          'scripts/libs/angular.js',
          'scripts/libs/angular-resource.js',
          'scripts/libs/angular-ui-router.js',
          'scripts/libs/ui-bootstrap-0.4.0.js',
          'scripts/libs/ui-bootstrap-tpls-0.4.0.js',
          'scripts/app.js'],
        dest: 'scripts/dist/main.js'
      }
    },
    uglify: {
      dist:{
        files:{
          'js/dist/main.min.js':['js/dist/main.js']
        }
      }
    }
  });

  grunt.registerTask('reset', ['less', 'coffee', 'concat', 'watch']);
};
