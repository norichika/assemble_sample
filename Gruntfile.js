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
  var assembleconf_files =[{
            expand: true,
            cwd: excludeDir,
            src: '**/*.hbs', // source file
            dest: 'dist/' // compile to
  }];

  // FTP設定
  var ftpSettings = {
    authKey: 'serverA',
    host: '******',
    dest: '/html/assemble/',
    port: 21,
    files : ['dist/**']
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
    copy: {
      dist: {
        files: [
          {expand: true, cwd: excludeDir, src: ['**/*.css'], dest: 'dist/'}
        ]
      }
    },
    compass: {
      common_dev: {
        options: {
          // config: 'compass_config.rb'
          sassDir: 'src/pages/common/sass/',
          // cssDir: 'dist/common/css/'
          cssDir: 'src/pages/common/css/'
          // importPath: 'src/pages/common/_sass/_setting',
          // environment: "development"
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
        // var pathhtml = pathget.replace('.hbs', '.html');
        // var ftppath = 'dist/' + pathhtml;
        // var ftpfile = [ftppath];
        // console.log(ftpfile);
        grunt.config.set('assemble.site.files', conf_files);
        // grunt.config.set('ftp_push.files', ftpfile);
        return ['assemble'];
      },
      scss: function(filepath) {
        // var pathget = filepath.replace(excludeDir, '');
        // var pathcss = pathget.replace('.scss', '.css');
        // pathcss = pathcss.replace('sass', 'css');
        // var ftppath = 'dist/' + pathcss;
        // var ftpfile = [ftppath];
        // console.log(ftpfile);
        // grunt.config.set('ftp_push.files', ftpfile);
        return ['compass:common_dev', 'copy'];
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
        }
      }
    }
  });
  // grunt.registerTask('default', ['assemble', 'connect']);
  grunt.registerTask('w', ['esteWatch']);
  grunt.registerTask('cmp', ['compass:common_dev']);
  grunt.registerTask('ftp', ['ftp_push']);
};