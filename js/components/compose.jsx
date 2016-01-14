import React from 'react'
import SoundBubble from './bubble'
import {tagNames} from '../constants/AppConstants'

import './compose.styl'

export default class Compose extends React.Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    composedBy: React.PropTypes.string.isRequired,
    layers: React.PropTypes.arrayOf(React.PropTypes.shape({
      layerID: React.PropTypes.number.isRequired,
      volume: React.PropTypes.number.isRequired
    })).isRequired,
    tags: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    uploadHandler: React.PropTypes.func.isRequired,
    showCompose: React.PropTypes.bool
  };

  constructor (props) {
    super(props)

    const tagState = {}
    tagNames.forEach(tag => tagState[tag] = this.props.tags.indexOf(tag) > -1)

    this.state = {
      title: this.props.title,
      tagState: tagState,
      showCompose: true
    }

    this.changeTitle = this.changeTitle.bind(this)
    this.toggleTag = this.toggleTag.bind(this)
    this.uploadData = this.uploadData.bind(this)
  }

  changeTitle (event) {
    this.setState({title: event.target.value})
  }

  toggleTag (event) {
    this.state.tagState[event.target.value] = event.target.checked
    this.forceUpdate()
  }

  uploadData (event) {
    const newData = {
      title: this.state.title,
      tags: tagNames.filter(tag => this.state.tagState[tag])
    }
    if (!newData.tags.length) newData.tags.push('No tag')
    this.props.uploadHandler(newData)
  }

  handleClick () {
    this.props.showCompose = false
  }

  render () {

    const titleInputProps = {
      type: 'text',
      value: this.state.title,
      placeholder: 'Give me a name',
      maxLength: 40,
      required: true,
      onChange: this.changeTitle
    }

    const composedByProps = {
      type: 'text',
      value: this.props.composedBy,
      readOnly: true
    }

    const submitButtonProps = {
      onClick: this.uploadData
    }

    const layersChosen = this.props.layers.map((layer, idx) => {
      return <SoundBubble key={idx} size={1} {...layer} />
    })
    const tagList = []
    tagNames.map((tag, idx) => {
      const checkboxProps = {
        type: 'checkbox',
        value: tag,
        checked: this.state.tagState[tag],
        onClick: this.toggleTag
      }
      tagList.push(<label key={idx} >{tag}<input {...checkboxProps} /></label>)
    })

    return (
      <div className={this.props.showCompose ? 'Compose-Panel' : 'Compose-Panel-hidden'}>
        <h2>Great work!</h2>
        <h3>Here's your track</h3>
        <ul>{layersChosen}</ul>
        <h3>One more step</h3>
        <label>Title:<input {...titleInputProps} /></label>
        <label>Composed by:<input {...composedByProps} /></label>
        <label className='Compose-TagList'>Select tags:{tagList}</label>
        <button {...submitButtonProps} onClick={this.handleClick.bind(this)}>Add to library</button>
      </div>
    )
  }
}