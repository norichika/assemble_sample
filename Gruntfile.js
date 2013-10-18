module.exports = function(grunt) {
  grunt.task.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks("grunt-este-watch");
  grunt.initConfig({
    connect: {
      server: {
        options: {
          port: 9000,
          base: 'dist',
          keepalive: true
        }
      }
    },
    assemble: {
      site: { // target name
        options: {
          data: ['src/**/*.yml'], // data files
          partials: 'src/partials/**/*.hbs'
        },
        files: [
          {
            expand: true,
            cwd: 'src/pages/',
            src: '**/*.hbs', // source file
            dest: 'dist/' // compile to
          },
        ]
      }
    }
  });
  grunt.registerTask('default', ['assemble', 'connect']);
};