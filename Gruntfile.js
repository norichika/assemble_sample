module.exports = function(grunt) {
  grunt.task.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks("grunt-este-watch");

  // ファイル書き出し設定
  // 除外ファイル
  var excludeDir = 'src/pages/'
  var assembleconf_files =[{
            expand: true,
            cwd: excludeDir,
            src: '**/*.hbs', // source file
            dest: 'dist/' // compile to
          }];
  grunt.initConfig({
    connect: {
      server: {
        options: {
          port: 9000,
          base: 'dist'
          // keepalive: true
        }
      }
    },
    assemble: {
      site: { // target name
        options: {
          data: ['src/**/*.yml'], // data files
          partials: 'src/partials/**/*.hbs'
        },
        files: assembleconf_files
      }
    },
    esteWatch: {
      options: {
        dirs: ['src/pages/**'],
        livereload: {
          enabled: false
        }
      },
      hbs: function(filepath) {
        var pathget = filepath.replace(excludeDir, '');
        var conf_files = [{
            expand: true,
            cwd: excludeDir,
            src: pathget, // source file
            dest: 'dist/' // compile to
        }];
        grunt.config.set('assemble.site.files', conf_files);
        return 'assemble';
      },
      css: function(filepath) {
        return 'connect';
      }
    }
  });
  // grunt.registerTask('default', ['assemble', 'connect']);
  grunt.registerTask('w', ['esteWatch']);
};