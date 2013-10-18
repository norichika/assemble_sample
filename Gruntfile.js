module.exports = function(grunt) {
  grunt.task.loadNpmTasks('assemble');
  grunt.initConfig({
    assemble: {
      site: { // target name
        options: {
          data: ['src/**/*.yml'] // data files
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
  grunt.registerTask('default', ['assemble']);
};