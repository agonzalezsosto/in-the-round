/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import p5 from 'p5'
import AudioObject from './audio-object'
import { TEXT } from '../../constants/text'

type AudioObjectType = {
  draw: (allowWander: boolean) => void
  doubleClicked: () => void
  mouseDragged: () => void
  setState: (state: boolean) => void
  keyPressed: () => void
  getFileObject: () => p5.File
  destroy: () => void
}

const arrayObjects: Array<AudioObjectType> = []
let isLoading = false

export const handleSubmitFiles = (): void => {
  isLoading = true
  arrayObjects.forEach(audioObject => {
    const xhra = new XMLHttpRequest()
    const xhr = new XMLHttpRequest()
    const file = audioObject.getFileObject()
    xhra.responseType = 'blob'
    xhra.onload = () => {
      const recoveredBlob = xhra.response
      xhr.onload = () => {
        if (xhr.status === 200) {
          const temp = arrayObjects.pop()
          temp?.destroy()
          isLoading = false
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

const SubmissionSketch = (p: p5): void => {
  let viewInstructions = true
  let allowWander = false
  let showError = false
  let errorMessage = ''

  p.setup = () => {
    const canvasDiv = document.getElementById('submission-canvas')
    const width = canvasDiv?.offsetWidth
    const height = canvasDiv?.offsetHeight
    const canvas = p.createCanvas(width!, height!)
    canvas.parent('submission-canvas')
    canvas.drop(handleDropFile)
    p.textFont('Lato')
  }

  p.draw = () => {
    p.background(255)
    p.strokeWeight(0.5)
    p.fill(0)
    p.textAlign(p.CENTER)
    p.textSize(30)
    p.text('drop files', p.width / 2, p.height / 2)
    if (viewInstructions) {
      p.textSize(12)
      p.textAlign(p.LEFT)
      p.text(
        TEXT.DESCRIPTION_OBJECT +
          TEXT.DESCRIPTION_DELAY +
          TEXT.DESCRIPTION_REVERB +
          TEXT.DESCRIPTION_PLAYBACK +
          TEXT.DESCRIPTION_LOOP +
          TEXT.DESCRIPTION_RESET +
          TEXT.DESCRIPTION_GENERAL +
          TEXT.DESCRIPTION_WANDER +
          TEXT.DESCRIPTION_HIDE,
        5,
        15
      )
    }

    arrayObjects.forEach(audioObject => audioObject.draw(allowWander))

    if (isLoading) {
      p.fill(20, 200)
      p.rect(0, 0, p.width, p.height)
      p.fill(255, 255)
      p.stroke(255, 255)
      p.textSize(30)
      p.textAlign('center')
      p.text('loading...', p.width / 2, p.height / 2)
    }

    if (showError) {
      p.fill(20, 200)
      p.rect(0, 0, p.width, p.height)
      p.fill(255, 255)
      p.stroke(255, 255)
      p.textSize(30)
      p.textAlign('center')
      p.text(errorMessage, p.width / 2, p.height / 2)
    }
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
    console.log(file)
    if (file.type === 'audio') {
      if (file.size < 5000000) {
        arrayObjects.push(AudioObject(p, file))
      } else {
        errorMessage = 'please insert a smaller file'
        showError = true
        setTimeout(() => {
          showError = false
        }, 2000)
      }
    } else {
      errorMessage = 'please only insert audio files'
      showError = true
      setTimeout(() => {
        showError = false
      }, 2000)
    }
  }
}

export default SubmissionSketch
