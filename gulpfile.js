var gulp 		= require('gulp')
var Promise 	= require('bluebird')
var util		= require('util')
var rename		= require('gulp-rename')
var git			= require('gulp-git')
var pkg			= require('./package.json')
var fs			= require('fs');
var path 		= require('path')
var template 	= require('gulp-template')

var readFile 	= Promise.promisify(fs.readFile);
var rimraf		= Promise.promisify(require('rimraf'));

var cfg = {
	extRepo: 	'https://github.com/moander/aspnethome',
	extBranch:	'dev',
	extDir:		'./build/ext',
};

gulp.task('default', ['build']);

gulp.task('build', ['ext_git_clone'], function () {
	return readFile(path.join(cfg.extDir, 'dnvm.sh')).then(function(extFileContent) {
		return Promise.map(Object.keys(pkg.bin), function(cmdName) {
			var tplOptions = {
				ext: extFileContent,
				cmd: cmdName,
			};
		    return new Promise(function(resolve, reject) {
				gulp.src('templates/bin.sh')
		        .on("end", resolve)
		        .on("error", reject)
				.pipe(template(tplOptions))
				.pipe(rename(pkg.bin[cmdName]))
				.pipe(gulp.dest('.', {mode: '0755'}));
		    });
		});
	});
});

gulp.task('ext_git_clone', ['clean'], function (cb) {
	var opts = {
		args: util.format('clone --branch=%s --depth=1 %s "%s"', cfg.extBranch, cfg.extRepo, cfg.extDir)	
	};
	git.exec(opts, cb);		
});

gulp.task('clean', function (cb) {	
	return Promise.all([
		rimraf('./build'),
	]);
});

