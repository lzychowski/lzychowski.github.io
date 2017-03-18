import gulp from 'gulp';
import util from 'gulp-util';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import header from 'gulp-header';

const file_header = (
	`/* YOLOnerds (c) ${new Date().getFullYear()} */\n`
);

const paths = {
	scripts: 'src/js/*.js',
	libs: 'src/js/vendor/*.js',
	dest: 'assets/js/'
};

gulp.task("minify-js", function(){
	return gulp.src(paths.scripts)
		.pipe(concat('scripts.min.js'))
		.pipe(uglify())
		.pipe(header(file_header, {
			parsed: true
		}))
		.pipe(gulp.dest(paths.dest));
});

gulp.task("default", ['minify-js']);