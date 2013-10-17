module.exports = function(grunt) {
  grunt.task.loadNpmTasks('assemble');
  grunt.initConfig({
    assemble: {
      site: { // target name
        options: {
          data: ['src/*.yml'] // data files
        },
        files: [
          {
            src: 'src/index.hbs', // source file
            dest: 'dist/index.html' // compile to
          },
          {
            src: 'src/index.hbs', // source file
            dest: 'dist/sp/index.html' // compile to
          }
        ]
      }
    }
  });
  grunt.registerTask('default', ['assemble']);
};