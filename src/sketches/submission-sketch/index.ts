/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import p5 from 'p5'
import AudioObject from './audio-object'

type AudioObjectType = {
  draw: (allowWander: boolean) => void
  doubleClicked: () => void
  mouseDragged: () => void
  setState: (state: boolean) => void
  keyPressed: () => void
  getFileObject: () => p5.File
}

const SubmissionSketch = (p: p5): void => {
  const arrayObjects: Array<AudioObjectType> = []
  let viewInstructions = true
  let allowWander = false
  let button

  p.setup = () => {
    const canvasDiv = document.getElementById('submission-canvas')
    const width = canvasDiv?.offsetWidth
    const height = canvasDiv?.offsetHeight
    const canvas = p.createCanvas(width!, height!)
    canvas.parent('submission-canvas')
    canvas.drop(handleDropFile)
    button = p.createButton('Submit files')
    button.position(p.width - 100, 20)
    button.mousePressed(handleSubmitFiles)
  }

  p.draw = () => {
    p.background(255)
    p.strokeWeight(0.5)
    p.fill(0)
    p.textAlign(p.CENTER)
    p.text('drop files', p.width / 2, p.height / 2)
    if (viewInstructions) {
      p.textAlign(p.LEFT)
      p.text(
        'when hovering over an audio object: \n\nPress d to control delay \nPress r to control reverb \nPress a to control playback speed \nPress l to loop \nPress o to return to defaults  \n\nwhen hovering anywhere over the browser: \nPress w to let the objects wander around \nPress h to show/hide these instructions',
        5,
        15
      )
    }

    arrayObjects.forEach(audioObject => audioObject.draw(allowWander))
  }

  p.doubleClicked = () => {
    arrayObjects.forEach(audioObject => audioObject.doubleClicked())
  }

  p.mousePressed = () => {
    arrayObjects.forEach(audioObject => audioObject.setState(true))
  }

  p.mouseReleased = () => {
    arrayObjects.forEach(audioObject => audioObject.setState(false))
  }

  p.mouseDragged = () => {
    arrayObjects.forEach(audioObject => audioObject.mouseDragged())
  }

  p.keyPressed = () => {
    if (p.key === 'h') {
      viewInstructions = !viewInstructions
    }

    if (p.key === 'w') {
      allowWander = !allowWander
    }
    arrayObjects.forEach(audioObject => audioObject.keyPressed())
  }

  const handleDropFile = (file: p5.File) => {
    if (file.type === 'audio') {
      arrayObjects.push(AudioObject(p, file))
    }
  }

  const handleSubmitFiles = () => {
    arrayObjects.forEach(audioObject => {
      const xhra = new XMLHttpRequest()
      const xhr = new XMLHttpRequest()
      const file = audioObject.getFileObject()
      console.log(file)

      xhra.responseType = 'blob'
      xhra.onload = () => {
        const recoveredBlob = xhra.response
        xhr.onload = () => {
          if (xhr.status === 200) {
            const fileInfo = JSON.parse(xhr.response)
            console.log(fileInfo)
          } else {
            const errorMessage = xhr.response
            console.error(errorMessage)
          }
        }

        xhr.open('POST', 'https://content.dropboxapi.com/2/files/upload')
        xhr.setRequestHeader(
          'Authorization',
          'Bearer ' + process.env.REACT_APP_DROPBOX_KEY
        )
        xhr.setRequestHeader('Content-Type', 'application/octet-stream')
        xhr.setRequestHeader(
          'Dropbox-API-Arg',
          JSON.stringify({
            path: '/' + file.name,
            mode: 'add',
            autorename: true,
            mute: false
          })
        )

        xhr.send(recoveredBlob)
      }

      xhra.open('GET', file.data)
      xhra.send()
    })
  }
}

export default SubmissionSketch
