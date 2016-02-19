# ffmpeg-gif

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

A small script that converts videos to a high quality GIF, by spawning `ffmpeg` in two passes using `palettegen` filter.

Assumes `ffmpeg` command is globally available. Tested with ffmpeg 2.6.2.

![anim.gif](./anim.gif)

> <sup>The above GIF was generated with this tool</sup>

## Install

```sh
npm install ffmpeg-gif -g
```

## Examples

```sh
# create 320w 30fps gif
ffmpeg-gif input.mov output.gif --fps=30 --scale=320:-1

# seek to 23s and make the gif 10s in length
ffmpeg-gif input.mov output.gif --seek 23 --time 10

# seek/time takes any ffmpeg duration format
ffmpeg-gif input.mov output.gif -S 00:10:00
```

## Usage

```sh
ffmpeg-gif input output [opts]

Options:

  --fps, -f    fps, default 20
  --scale, -s  resize to width:height (optional)
  --seek, -S   seek to time, default no seek
  --time, -t   total duration, default full clip
```

## License

MIT, see [LICENSE.md](http://github.com/Jam3/ffmpeg-gif/blob/master/LICENSE.md) for details.
