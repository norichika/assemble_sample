module.exports = function(grunt) {
  grunt.task.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks("grunt-este-watch");
  grunt.loadNpmTasks("grunt-ftp-push");

  // ファイル書き出し設定
  // 除外ファイル
  var excludeDir = 'src/pages/';
  var assembleconf_files =[{
            expand: true,
            cwd: excludeDir,
            src: '**/*.hbs', // source file
            dest: 'dist/' // compile to
          }];

  // FTP設定
  var ftpSettings = {
    authKey: 'serverA',
    host: 'sample.server.com',
    dest: '/html/assemble/',
    port: 21,
    files : [ 'dest/**']
  };

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
    ftp_push: {
      options: {
        authKey: ftpSettings.authKey,
        host: ftpSettings.host,
        dest: ftpSettings.dest,
        port: ftpSettings.port
      },
      files: ftpSettings.files
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
        var pathhtml = pathget.replace('.hbs', '.html');
        var ftppath = 'dist/' + pathhtml;
        var ftpfile = [ftppath];
        console.log(ftpfile);
        grunt.config.set('assemble.site.files', conf_files);
        grunt.config.set('ftp_push.files', ftpfile);
        return ['assemble', 'ftp_push'];
      },
      css: function(filepath) {
        return 'connect';
      }
    }
  });
  // grunt.registerTask('default', ['assemble', 'connect']);
  grunt.registerTask('w', ['esteWatch']);
  grunt.registerTask('ftp', ['ftp_push']);
};