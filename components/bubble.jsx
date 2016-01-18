import React from 'react'
import {sampleNames, sampleFileNames} from '../helpers/constants'

export default class SoundBubble extends React.Component {
  static propTypes = {
    sampleID: React.PropTypes.number.isRequired,
    volume: React.PropTypes.number.isRequired,
    size: React.PropTypes.number.isRequired,
    active: React.PropTypes.bool.isRequired,
    volumeUp: React.PropTypes.func
  };

  render () {
    const sample = sampleNames[this.props.sampleID]
    // const iconUrl = '/assets/icons/' + sampleFileNames[this.props.sampleID] + 'jpg'
    const scaleFactor = this.props.size * (1 + 0.1 * this.props.volume)

    const buttonProps = {
      style: {
        // backgroundImage: 'url(' + iconUrl + ')',
        backgroundColor: '#EF49B7',
        color: 'white',
        transform: 'scale(' + scaleFactor + ')',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        transition: 'transform 0.2s ease-out, background-color 0.2s ease-out',
        textTransform: 'capitalize',
        fontWeight: '600',
        textAlign: 'center',
        border: 'none'
      },
      value: this.props.sampleID,
      disabled: !this.props.active,
      onClick: this.props.volumeUp
    }

    return (
      <button {...buttonProps}>{sample + ': ' + this.props.volume}</button>
    )
  }
}
