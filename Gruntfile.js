module.exports = function(grunt) {
  grunt.task.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks("grunt-este-watch");
  grunt.loadNpmTasks("grunt-ftp-push");

  // ファイル書き出し設定
  // 除外ファイル
  var excludeDir = 'src/pages/';

  // assemble copy Option
  var assembleconf_files =[{
            expand: true,
            cwd: excludeDir,
            src: '**/*.hbs', // source file
            dest: 'dist/' // compile to
  }];

  // copy
  var copy_files =[{
            expand: true,
            cwd: excludeDir,
            src: ['**/*.css'], // source file
            dest: 'dist/' // compile to
  }];

  // FTP設定
  var ftpSettings = {
    authKey: 'serverA',
    host: '****',
    dest: '/html/assemble/',
    port: 21,
    files : ['dist/**']
  };

  grunt.initConfig({
    copy: {
      dist: {
        files: copy_files
      }
    },
    compass: {
      common_dev: {
        options: {
          outputStyle: 'compressed',
          sassDir: 'src/pages/common/sass/',
          cssDir: 'src/pages/common/css/'
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
        dirs: ['src/pages/**', 'dist/**'],
        livereload: {
          enabled: false,
          port: 35729,
          extensions: ['html', 'js', 'css']
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
        return ['assemble'];
      },
      scss: function(filepath) {
        return ['compass:common_dev'];
      },
      html: function(filepath) {
        var ftphtmlfile = [filepath];
        grunt.config.set('ftp_push.files', ftphtmlfile);
        console.log(ftphtmlfile);
        return ['ftp_push'];
      },
      css: function(filepath) {
        var distAry = filepath.split('/');
        var distDir = distAry[0];
        if(distDir === 'dist') {
          // var pathget = filepath.replace(excludeDir, '');
          var ftpcssfile = [filepath];
          grunt.config.set('ftp_push.files', ftpcssfile);
          console.log(ftpcssfile);
          return ['ftp_push'];
        } else if(distDir === 'src') {
          var pathget = filepath.replace(excludeDir, '');
          var conf_files = [{
            expand: true,
            cwd: excludeDir,
            src: pathget, // source file
            dest: 'dist/' // compile to
          }];
          grunt.config.set('copy.dist.files', conf_files);
          return ['copy'];
        }
      }
    }
  });
  // grunt.registerTask('default', ['assemble', 'connect']);
  grunt.registerTask('w', ['esteWatch']);
  grunt.registerTask('cmp', ['compass:common_dev']);
  grunt.registerTask('ftp', ['ftp_push']);
};