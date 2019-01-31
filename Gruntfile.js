module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            options: {
                livereload: 8585
            },
            css: {
                files: ['less/**/*.less'],
                tasks: ['less', 'autoprefixer', 'csso']
            },
            html: {
                files: ['debug/**/*.html']
            },
            js: {
                files: ['src/**/*.js'],
                tasks: ['uglify']
            }
        },
        less: {
            development: {
                options: {
                    paths: ["less"]
                },
                files: {
                    "dist/DGSoundScreen.css": "less/main.less"
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 9']
            },
            your_target: {
                src: 'dist/DGSoundScreen.css',
                dest: 'dist/DGSoundScreen.css'
            }
        },
        csso: {
            compress: {
                options: {
                    report: 'gzip'
                },
                files: {
                    'dist/DGSoundScreen.min.css': ['dist/DGSoundScreen.css']
                }
            }
        },
		eslint: {
			options:{
				fix: true,
				outputFile: 'eslint.log'
			},
			target: ['src/Soundscreen/src/**/*.js']
		},
        uglify: {
            options: {
                mangle: false
            },
            my_target: {
                files: {
                    'src/Soundscreen/dist/Soundscreen.min.js': ['src/Soundscreen/src/**/*.js', 'src/Soundscreen/lang/**/*.js'],
					'src/SoundscreenControl/dist/SoundscreenControl.min.js': ['src/SoundscreenControl/src/**/*.js', 'src/SoundscreenControl/lang/**/*.js'],
					'dist/DGSoundscreen.js': ['src/**/dist/*.js']
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-csso');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-eslint');

    grunt.registerTask('build', ['less', 'autoprefixer', 'csso', 'eslint', 'uglify', 'watch']);
	grunt.registerTask('default', ['uglify', 'watch']);
};
