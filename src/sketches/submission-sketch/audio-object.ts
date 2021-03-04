/* eslint-disable @typescript-eslint/no-unused-vars */
import p5 from 'p5'
import 'p5/lib/addons/p5.sound'

const AudioObject = (p: p5, fileObject: p5.File) => {
  const localFile = fileObject
  const loadSound = (path: string) =>
    ((p as any) as p5.SoundFile).loadSound(path)
  let isSelected = false
  const pos = p.createVector(p.mouseX, p.mouseY)

  const mySound = loadSound(localFile.data)

  const myDelay = new p5.Delay()
  myDelay.process(mySound, 0.15, 0.8, 5000)
  myDelay.setType(1)
  myDelay.amp(0)

  const myReverb = new p5.Reverb()
  myReverb.process(mySound, 3, 2)
  myReverb.amp(0)

  const noiseSeed = p.random(1000)

  let controlMode: 'DELAY' | 'RVB' | 'AUDIO' | 'OFF' = 'OFF'

  const mouseIsOverShape = (): boolean => {
    return (
      p.mouseX > pos.x - 50 &&
      p.mouseX < pos.x + 50 &&
      p.mouseY > pos.y - 50 &&
      p.mouseY < pos.y + 50
    )
  }

  const draw = (allowWander: boolean) => {
    if (allowWander) {
      wander()
      setFXParams()
    }

    if (mySound.isPlaying()) {
      p.strokeWeight(3)
      p.stroke(200, 50, 100)
    } else {
      p.strokeWeight(1)
      p.stroke(0)
    }
    switch (controlMode) {
      case 'DELAY':
        p.fill(255, 100, 100)
        break
      case 'RVB':
        p.fill(100, 255, 100)
        break
      case 'AUDIO':
        p.fill(100, 100, 255)
        break
      case 'OFF':
      default:
        p.fill(255)
        break
    }
    p.circle(pos.x, pos.y, 100)
  }

  const doubleClicked = () => {
    if (mouseIsOverShape()) {
      if (!mySound.isPlaying()) {
        mySound.play()
      } else {
        mySound.pause()
      }
      myReverb.set(p.map(pos.x, 0, p.width, 1, 4), 2)
    }
  }

  const setState = (state: boolean) => {
    if (mouseIsOverShape()) {
      isSelected = state
    }
  }

  const mouseDragged = () => {
    if (isSelected) {
      pos.x = p.mouseX
      pos.y = p.mouseY
      setFXParams()
    }
  }

  const keyPressed = () => {
    if (mouseIsOverShape()) {
      switch (p.key) {
        case 'l':
          if (mySound.isLooping()) {
            mySound.stop()
            mySound.setLoop(false)
          } else {
            mySound.play()
            mySound.setLoop(true)
          }
          break
        case 'd':
          controlMode = 'DELAY'
          break
        case 'r':
          controlMode = 'RVB'
          break
        case 'a':
          controlMode = 'AUDIO'
          break
        case 'o':
          controlMode = 'OFF'
          mySound.setLoop(false)
          reinitParams()
          break
        default:
          break
      }
    }
  }

  const reinitParams = () => {
    myDelay.amp(0)
    myReverb.amp(0)
    mySound.rate(1)
  }

  const setFXParams = () => {
    switch (controlMode) {
      case 'DELAY':
        myDelay.feedback(p.map(pos.x, 0, p.width, 0, 0.98))
        myDelay.delayTime(p.map(pos.y, 0, p.height, 0.01, 0.5))
        myDelay.amp(1)
        break
      case 'RVB':
        myReverb.amp(p.map(pos.y, 0, p.height, 0, 1))
        break
      case 'AUDIO':
        mySound.rate(p.map(pos.x, 0, p.width, 0.1, 2))
        break
      case 'OFF':
        reinitParams()
        break
      default:
        break
    }
  }

  const wander = () => {
    pos.x += p.map(p.noise(p.frameCount / 100 + noiseSeed), 0, 1, -4, 4)
    pos.y += p.map(p.noise(p.frameCount / 100 + 10 + noiseSeed), 0, 1, -4, 4)

    if (pos.x < 0) {
      pos.x = p.width
    }

    if (pos.x > p.width) {
      pos.x = 0
    }

    if (pos.y < 0) {
      pos.y = p.height
    }

    if (pos.y > p.height) {
      pos.y = 0
    }
  }

  const getFileObject = () => {
    return localFile
  }

  const destroy = () => {
    mySound.stop()
  }

  return {
    draw,
    doubleClicked,
    mouseDragged,
    setState,
    keyPressed,
    getFileObject,
    destroy,
    mouseIsOverShape
  }
}

export default AudioObject
