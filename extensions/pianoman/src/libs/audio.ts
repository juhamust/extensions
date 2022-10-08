import * as Afplay from "afplay";
import { environment } from "@raycast/api";
import { readFile } from "fs/promises";
import { join } from "path";
import { Key } from "./key";

let initialized = false;
let context: AudioContext;
let extension: string;

const samples = new Map<number, AudioBuffer | undefined>([
  [2, undefined],
  [3, undefined],
  [4, undefined],
  [5, undefined],
  [6, undefined],
]);

function init() {
  // Support prefixed AudioContext used in Safari and old Chrome versions.
  let audioContext = window.AudioContext || (window as any).webkitAudioContext;
  context = new audioContext();

  // Polyfill for old callback-based syntax used in Safari.
  if (context.decodeAudioData.length !== 1) {
    const originalDecodeAudioData = context.decodeAudioData.bind(context);
    context.decodeAudioData = (buffer) =>
      new Promise((resolve, reject) => originalDecodeAudioData(buffer, resolve, reject));
  }

  // determine supported extension
  let audioElm = document.createElement("audio");
  if (audioElm.canPlayType("audio/ogg")) {
    extension = "ogg";
  } else if (audioElm.canPlayType("audio/mp3")) {
    extension = "mp3";
  } else if (audioElm.canPlayType("audio/wav")) {
    extension = "wav";
  } else {
    extension = "wav";
  }

  initialized = true;
}

async function loadSample(octave: number) {
  if (samples.get(octave) === undefined) {
    const response = await readFile(
      join(environment.assetsPath, `samples_piano_F${octave}.${extension}`),
      null,
    );
    samples.set(octave, await context.decodeAudioData(response));
  }

  return samples.get(octave);
}

function playSample(sample: AudioBuffer, key: Key) {
  const source = context.createBufferSource();
  source.buffer = sample;
  source.playbackRate.value = 2 ** ((key - Key["F"]) / 12);
  source.connect(context.destination);
  source.start(0, 0, 2);
}

export async function play(key: Key, octave: number) {
  if (!initialized) {
    init();
  }

  try {
    const sample = await loadSample(octave);
    if (sample) {
      playSample(sample, key);
    }
  } catch (error) {
    console.error(error);
  }
}
