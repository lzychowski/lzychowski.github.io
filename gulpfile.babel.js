//var gulp = require("gulp") 
//var util = require("gulp-util");
//var uglify = require("gulp-uglify");

import gulp from 'gulp';
import util from 'gulp-util';
import uglify from 'gulp-uglify';

const file_header = (
	`## YOLOnerds (c) ${new Date().getFullYear()}`
);

const paths = {
	scripts: ['src/js/*.js'],
	libs: ['src/js/vendor/*.js'],
	dist: 'assets/js/'
};


gulp.task("default", function() {
	return util.log("Gulp is running");
});