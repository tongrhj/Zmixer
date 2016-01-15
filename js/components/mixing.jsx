import React from 'react'
import SoundBubble from './bubble'
import {sampleNames, bubbleSizes} from '../constants/AppConstants'
import partition from 'lodash.partition'
import classNames from 'classnames'

import './mixing.styl'

function shuffledList (size) {
  const original = []
  const shuffled = []
  for (let i = 0; i < size; i++) original.push(i)
  for (let i = size; i > 0; i--) {
    shuffled.push(original.splice(Math.floor(Math.random() * i), 1)[0])
  }
  return shuffled
}

export default class MixingRoom extends React.Component {
  static propTypes = {
    layers: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
    volumeUp: React.PropTypes.func.isRequired,
    checkView: React.PropTypes.func.isRequired,
    style: React.PropTypes.object
  };

  constructor (props) {
    super(props)
    this.state = {
      outer: shuffledList(sampleNames.length),
      inner: shuffledList(bubbleSizes.length),
      hideMe: false
    }
    this.shuffleBubbles = this.shuffleBubbles.bind(this)
  }

  shuffleBubbles () {
    this.setState({
      outer: shuffledList(sampleNames.length),
      inner: shuffledList(bubbleSizes.length)
    })
  }

  handleClick () {
    this.setState({ hideMe: true })
    this.refs.MixingComponent.addEventListener('transitionend', () => {
      this.props.checkView('compose')
    })
  }

  render () {
    let basket = partition(this.state.outer, idx => this.props.layers[idx] > 0)
    basket = basket[0].concat(basket[1])
    basket = this.state.inner.map(idx => basket[idx])
    basket = basket.map((sampleID, idx) => {
      const bubbleProps = {
        sampleID: sampleID,
        volume: this.props.layers[sampleID],
        size: bubbleSizes[idx],
        active: true,
        volumeUp: this.props.volumeUp
      }
      return <SoundBubble key={sampleID} {...bubbleProps}/>
    })

    const mixingPanelClasses = classNames({
      'Mixing-panel': true,
      'Mixing-panel-hidden': this.state.hideMe
    })

    return (
      <div className={mixingPanelClasses} ref='MixingComponent'>
        <header className='Mixing-header' onClick={this.handleClick.bind(this)}>
          <h1>Save</h1>
        </header>
        <section className='Mixing-section'>
          <h3>Be creative</h3>
          <div className='Mixing-bubbleList'>{basket}</div>
          <button onClick={this.shuffleBubbles}>Shuffle</button>
        </section>
      </div>
    )
  }
}
