import React from 'react'
import Player from './player'
import Compose from './compose'
import Library from './library'
import MixingRoom from './mixing'

import './main.styl'

const collection = [
  {
    trackID: 1,
    title: 'Space Oddity',
    composedBy: 'David Bowie',
    layers: [0, 3, 3, 3, 0, 0, 0, 0, 0, 0],
    tags: ['New Age'],
    timesPlayed: 10
  }, {
    trackID: 2,
    title: 'Hello',
    composedBy: 'yongjun21',
    layers: [0, 2, 0, 3, 0, 4, 0, 0, 0, 0],
    tags: ['Nature', 'Sea'],
    timesPlayed: 99
  }, {
    trackID: 3,
    title: 'Happy Birthday',
    composedBy: 'Jared Tong',
    layers: [0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    tags: ['Urban', 'White noise'],
    timesPlayed: 99
  }
]

export default class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userID: 'Jared Tong',
      currentTrackID: -1,
      layers: Array(10).fill(0),
      library: collection,
      currentView: 'mixing'
    }
    this.volumeUpLayer = this.volumeUpLayer.bind(this)
    this.loadTrack = this.loadTrack.bind(this)
    this.uploadHandler = this.uploadHandler.bind(this)
  }

  volumeUpLayer (event) {
    const selectedSampleID = +event.target.value
    if (this.state.layers[selectedSampleID] === 4) {
      this.state.layers[selectedSampleID] = 0
      this.playSound('close')
    } else if (this.state.layers[selectedSampleID === 0]) {
      this.state.layers[selectedSampleID]++
      this.playSound('open')
    } else {
      this.state.layers[selectedSampleID]++
      this.playSound('volume')
    }
    this.forceUpdate()
  }

  playSound (type) {
    const isSafari = (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1)
    if (!isSafari) {
      let audio
      if (type === 'open') {
        audio = new Audio('./assets/ui-sounds/open-bubble.mp3')
      } else if (type === 'volume') {
        audio = new Audio('./assets/ui-sounds/single-bubble.mp3')
      } else if (type === 'close') {
        audio = new Audio('./assets/ui-sounds/close-bubble.mp3')
      }
      audio.play()
    }
  }

  loadTrack (event) {
    const selectedTrackID = +event.target.value
    const selectedTrack = this.state.library.find(track => {
      return track.trackID === selectedTrackID
    })
    selectedTrack.timesPlayed++
    this.setState({
      currentTrackID: selectedTrackID,
      layers: Array.from(selectedTrack.layers)
    })
    this.refs.compose.importState(selectedTrack.title, selectedTrack.tags)
    this.refs.player.togglePlay()
  }

  uploadHandler (newData) {
    let maxID = -1
    this.state.library.forEach(track => maxID = Math.max(maxID, track.trackID))
    const newTrack = {
      trackID: maxID + 1,
      composedBy: this.state.userID,
      title: newData.title,
      layers: this.state.layers,
      tags: newData.tags,
      timesPlayed: 0
    }

    this.state.library.push(newTrack)
    this.setState({currentTrackID: newTrack.trackID})
  }

  handleViewChange (newView) {
    this.setState({currentView: newView})
  }

  render () {
    const currentTrack = this.state.library.find(track => {
      return track.trackID === this.state.currentTrackID
    }) || {title: '', tags: []}

    const playerProps = {
      ref: 'player',
      title: currentTrack.title,
      layers: this.state.layers
    }

    const composeProps = {
      ref: 'compose',
      title: currentTrack.title,
      composedBy: this.state.userID,
      layers: this.state.layers,
      tags: currentTrack.tags,
      uploadHandler: this.uploadHandler,
      checkView: this.handleViewChange.bind(this)
    }

    const libraryProps = {
      userID: this.state.userID,
      collection: this.state.library,
      loadTrack: this.loadTrack,
      checkView: this.handleViewChange.bind(this)
    }

    const mixingRoomProps = {
      layers: this.state.layers,
      volumeUp: this.volumeUpLayer,
      checkView: this.handleViewChange.bind(this),
      style: {}
    }

    let viewToShow
    if (this.state.currentView === 'mixing') {
      viewToShow = <MixingRoom {...mixingRoomProps} />
    } else if (this.state.currentView === 'compose') {
      viewToShow = <Compose {...composeProps} />
    } else if (this.state.currentView === 'library') {
      viewToShow = <Library {...libraryProps} />
    }
    return (
      <div className='MobileContainer'>
        <Player {...playerProps} />
        {viewToShow}
      </div>
    )
  }
}
