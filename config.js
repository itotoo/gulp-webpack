
const gulp = require('gulp');
let base = gulp.env._[0] !== 'pro' ? './build' : './build_PRO';


module.exports = {
    clean:{
        src:['./build_PRO/js', './build_PRO/style'],
    },
    html: {
        src:'./develop/app/**/*.html',
        dest: base+"/"
    },
    sass:{
        src :'./develop/app/**/*.scss',
        dest: base+"/",       //- 保存位置
    },
    es6:{
        src :'./develop/app/**/*.js',
        dest: base+"/",       //- 保存位置
    },
    images:{
        src :'./develop/app/**/images/**/*',
        dest: base+"/",
    },
    plugin:{
        src :'./develop/app/**/plugin/**/*',
        dest: base+"/",
    },
    common:{
        src :'./develop/app/**/common/**/*',
        dest: base+"/",
    },
    data:{
        src :'./develop/app/**/data/**/*',
        dest: base+"/",
    }
}