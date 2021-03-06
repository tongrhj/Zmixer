import React from 'react'
import classNames from 'classnames'
import {sampleFileNames} from '../helpers'
import {Howl} from 'howler'

const soundLibrary = Array(10).fill(null)
let lastPlayingState = false

import './player.styl'

export default class Player extends React.Component {
  static propTypes = {
    title: React.PropTypes.string,
    playing: React.PropTypes.bool,
    layers: React.PropTypes.arrayOf(React.PropTypes.number),
    togglePlay: React.PropTypes.func
  };

  constructor (props) {
    super(props)
    this.state = {
      timer: 0,
      countdown: 0
    }
    this.startCountdown = this.startCountdown.bind(this)
  }

  startCountdown () {
    if (this.state.timer) window.clearInterval(this.state.timer)
    function intervalCallback () {
      if (!this.props.playing) return
      if (this.state.countdown > 0) {
        this.setState({countdown: this.state.countdown - 1})
      } else {
        window.clearInterval(this.state.timer)
        this.props.togglePlay()
        this.setState({
          timer: 0,
          countdown: 0
        })
      }
    }
    this.setState({
      timer: window.setInterval(intervalCallback.bind(this), 1000),
      countdown: 10
    })
  }

  render () {
    this.props.layers.forEach((layer, idx) => {
      if (layer > 0) {
        if (soundLibrary[idx]) {
          soundLibrary[idx].volume(0.2 * layer)
          if (this.props.playing && !lastPlayingState) soundLibrary[idx].play()
          else if (!this.props.playing && lastPlayingState) soundLibrary[idx].pause()
        } else {
          soundLibrary[idx] = new Howl({
            urls: ['../../assets/audio/' + sampleFileNames[idx] + '.mp4'],
            loop: true,
            volume: 0.3 * layer
          })
          if (this.props.playing) soundLibrary[idx].play()
        }
      } else {
        if (soundLibrary[idx]) {
          soundLibrary[idx].unload()
          soundLibrary[idx] = null
        }
      }
    })

    lastPlayingState = this.props.playing

    const playButtonProps = {
      className: classNames('fa', {
        'fa-play': !this.props.playing,
        'fa-pause': this.props.playing
      }),
      onClick: this.props.togglePlay
    }

    const timerProps = {
      className: 'countdown-timer',
      onClick: this.startCountdown
    }

    const timerDisplay = Math.floor(this.state.countdown / 60) + ':' +
      (this.state.countdown % 60 < 10 ? '0' : '') + this.state.countdown % 60

    return (
      <section>
        <h3>{this.props.title || 'Untitled'}</h3>
        <button {...playButtonProps} />
        <h3>{this.props.title || 'Untitled'}</h3>
        <button {...timerProps} >{timerDisplay}</button>
      </section>
    )
  }
}
