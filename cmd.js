#!/usr/bin/env node
var spawn = require('child_process').spawn;
var rimraf = require('rimraf');
var flat = (a, b) => a.concat(b);
var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    fps: 'f',
    scale: 's',
    seek: 'S',
    time: 't',
    help: 'h'
  }
});

if (argv.help) {
  showHelp()
  process.exit()
}

var input = argv._[0];
var output = argv._[1];

var suffix = '__tmp__palette_' + Date.now() + '.png';
var tmpFileName = input + suffix;
var needsCleanup = false;

var ss = argv.start ? [ '-ss', argv.start ] : '';
var t = argv.time ? [ '-t', argv.time ] : '';
var inputFlag = [ '-i', input ];
var fps = 'fps=' + (argv.fps || 20) + '';
var scale = argv.scale ? ('scale=' + argv.scale + ':flags=lanczos') : '';
var filterStr = [ fps, scale ].filter(Boolean).join(',');
var filter1 = [ '-vf', filterStr + ',palettegen' ];
var filter2 = [ '-filter_complex', filterStr + '[x];[x][1:v]paletteuse' ];

var pass1Flags = [ '-y', ss, t, inputFlag, filter1, tmpFileName ].filter(Boolean).reduce(flat, []);
var pass2Flags = [ '-y', ss, t, inputFlag, '-i', tmpFileName, filter2, '-f', 'gif', output ].filter(Boolean).reduce(flat, []);

var proc = spawn('ffmpeg', pass1Flags, { stdio: 'inherit' });
proc.on('exit', code => {
  needsCleanup = true;
  if (code !== 0) return bail(code);
  var proc2 = spawn('ffmpeg', pass2Flags, { stdio: 'inherit' });
  proc2.on('exit', code => {
    if (code !== 0) return bail(code);
    finish();
  });
});

function bail (exitCode) {
  console.error(new Error('Exited with code ' + exitCode));
  finish();
}

function finish () {
  if (!needsCleanup) return;
  rimraf.sync(tmpFileName);
  needsCleanup = false;
}

function showHelp () {
  console.log([
    'Usage:\n',
    'ffmpeg-gif input output [opts]\n',
    'Options:\n',
    '  --fps, -f    fps, default 20',
    '  --scale, -s  resize to width:height (optional)',
    '  --seek, -S   seek to time, default no seek',
    '  --time, -t   total duration, default full clip'
  ].join('\n'));
}

process.on('exit', () => {
  finish();
});

process.on('SIGINT', (code) => {
  finish();
  process.exit(code);
});
