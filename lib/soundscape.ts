// lib/soundscape.ts
// Generates a soft, soothing ambient brown-noise / rain hum using Web Audio API
// No external MP3 or network required — works 100% locally and offline.

let audioCtx: AudioContext | null = null
let sourceNode: AudioBufferSourceNode | null = null
let gainNode: GainNode | null = null

export function toggleFocusSound(enable: boolean): boolean {
  if (typeof window === 'undefined') return false

  try {
    if (!enable) {
      if (gainNode && audioCtx) {
        gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.3)
        setTimeout(() => {
          try {
            sourceNode?.stop()
            sourceNode?.disconnect()
            sourceNode = null
          } catch {}
        }, 400)
      }
      return false
    }

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return false

    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioContextClass()
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume()
    }

    // Stop any existing sound
    try {
      sourceNode?.stop()
      sourceNode?.disconnect()
    } catch {}

    // Generate 5 seconds of pink/brown ambient rain noise in a loop
    const bufferSize = audioCtx.sampleRate * 5
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate)
    const data = buffer.getChannelData(0)
    let lastOut = 0.0

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      // Brown noise filter approximation for deep, cozy rain rumble
      data[i] = (lastOut + 0.02 * white) / 1.02
      lastOut = data[i]
      data[i] *= 2.5 // Boost soft brown noise
    }

    sourceNode = audioCtx.createBufferSource()
    sourceNode.buffer = buffer
    sourceNode.loop = true

    // Low-pass filter for cozy warmth like rainfall on a vintage roof
    const filter = audioCtx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(450, audioCtx.currentTime)

    gainNode = audioCtx.createGain()
    gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 1) // gentle fade-in

    sourceNode.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(audioCtx.destination)

    sourceNode.start()
    return true
  } catch (err) {
    console.warn('Audio could not start:', err)
    return false
  }
}
