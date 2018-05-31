// 配置
const config = require('./config'); 
const gulp = require('gulp');
const watch = require('gulp-watch');
const concat = require('gulp-concat');
const rename = require("gulp-rename");
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync'); // 浏览器 预览
const notify = require('gulp-notify'); // 处理报错而不终止
const changed = require('gulp-changed');
const del = require('del'); // 删除
// html处理
const htmlmin = require('gulp-htmlmin'); // html 压缩
const fileinclude = require('gulp-file-include');
// css处理
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
// js处理
const pump = require('pump');
const webpackStream = require('webpack-stream'); // es6编译
// image处理
const imagemin = require('gulp-imagemin');
// 版本控制
const runSequence = require('run-sequence');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');


// ------------------------- 开发环境 -------------------------
let env = gulp.env._[0];
console.log('首次执行环境',env);
// 默认开发
gulp.task('default',['dev']);
// 执行打包发布任务
gulp.task('pro', ['pro']);

// 清除
gulp.task('del',function (cb) {
    del([ config.clean.src ],{force: true}, cb);
});

// 处理css
gulp.task('css',function(){
    return gulp.src(config.sass.src)
    .pipe(changed(config.sass.dest))
    .pipe(rev())
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(cleanCSS({
        compatibility: 'ie8',
        format: 'keep-breaks',
        rebase :false
    }))
    .pipe( sass().on('error', notify.onError(function (error) {
        return "Message to the notifier: " + error.message;
    }) ))
    .pipe(gulp.dest(config.sass.dest))
    .pipe(rev.manifest())
    .pipe(gulp.dest(config.sass.dest+"/style/hash"))

});
// 处理脚本
gulp.task('script',function(cb){
    return gulp.src(config.es6.src)
    .pipe( changed(config.es6.dest) )
    .pipe( webpackStream(require('./webpack.config.Dev.js')) )
    .pipe( rev() )
    .pipe( gulp.dest(config.es6.dest) )
    .pipe( rev.manifest() )
    .pipe( gulp.dest(config.es6.dest+"/js/hash") )

});
// 处理html
gulp.task('html', function() {
    return gulp.src(['build/**/*.json', config.html.src])
    .pipe(changed(config.html.src))
    // 合并模板 
    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(htmlmin( { collapseWhitespace: env==='pro' ? true : false } ))
    .pipe( revCollector({
        replaceReved: true, //替换模板文件中的链接
    }) )
    .pipe( gulp.dest(config.html.dest) );
});

// 直接输出
gulp.task('images', function() {
    return gulp.src(config.images.src)
        .pipe(changed(config.images.dest))
        .pipe(imagemin())
        .pipe(gulp.dest(config.images.dest))
});
gulp.task('plugin', function() {
    return gulp.src(config.plugin.src)
        .pipe(gulp.dest(config.plugin.dest))
});
gulp.task('common', function() {
    return gulp.src(config.common.src)
        .pipe(gulp.dest(config.common.dest))
});
gulp.task('data', function() {
    return gulp.src(config.data.src)
        .pipe(gulp.dest(config.data.dest))
});

// 本地开发
gulp.task('dev', function (done) {
    condition = false;
    runSequence(
        ['css'],
        ['script'],
        ['images','html','plugin','common','data'],
        ['watch','browser-sync'],
        done);
});

// 实时预览
// browser-sync
gulp.task('browser-sync',function(){
    browserSync.init({
        server: {
            baseDir: "./",
            index: '/'
        },
        open:false,
        port: 9999
    });
})
// 监听
// watch
gulp.task('watch',function(){
    gulp.watch(config.html.src, ['html']).on("change", browserSync.reload);
    gulp.watch(config.sass.src, ['watchDevCss']).on("change", browserSync.reload);
    gulp.watch(config.es6.src, ['watchDevJs']).on("change", browserSync.reload);
});
gulp.task('watchDevCss', function (done) {
    condition = false;
    runSequence(
        ['css'],
        ['html'],
        done);
});
gulp.task('watchDevJs', function (done) {
    condition = false;
    runSequence(
        ['script'],
        ['html'],
        done);
});

