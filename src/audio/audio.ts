import type * as ex from 'excalibur';

export type MusicTrack = 'menu' | 'game';

const STORAGE_KEY = 'tiltclimb.muted';

/** Music sits well under the effects: it must be felt, not listened to. */
const MUSIC_VOLUME = 0.32;
const SFX_VOLUME = 0.7;

function readMuted(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function writeMuted(muted: boolean): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, muted ? '1' : '0');
  } catch {
    // Private mode or blocked storage: the game simply forgets the preference.
  }
}

/**
 * Audio front door: two music tracks and a table of effects, behind one switch.
 *
 * Browsers refuse to start audio before a user gesture, so nothing plays until `unlock()` is
 * called from the first pointer or key event. Requests made before that are remembered (music)
 * or dropped (effects) instead of throwing.
 */
class Audio {
  private readonly music = new Map<MusicTrack, ex.Sound>();
  private readonly effects = new Map<string, ex.Sound>();
  private currentTrack: MusicTrack | null = null;
  private pendingTrack: MusicTrack | null = null;
  private unlocked = false;
  private muted = readMuted();

  attachMusic(track: MusicTrack, sound: ex.Sound): void {
    sound.loop = true;
    sound.volume = MUSIC_VOLUME;
    this.music.set(track, sound);
  }

  attachEffects(effects: Map<string, ex.Sound>): void {
    for (const [key, sound] of effects) {
      sound.volume = SFX_VOLUME;
      this.effects.set(key, sound);
    }
  }

  get isMuted(): boolean {
    return this.muted;
  }

  get isUnlocked(): boolean {
    return this.unlocked;
  }

  /** Diagnostic snapshot for the smoke test: how many voices each effect has alive. */
  debugVoices(): Record<string, number> {
    const out: Record<string, number> = {};
    for (const [key, sound] of this.effects) {
      out[key] = sound.instances.length;
    }
    for (const [key, sound] of this.music) {
      out[`music:${key}`] = sound.instances.length;
    }
    return out;
  }

  /** Called from the first user gesture; the only thing that can start the audio context. */
  unlock(): void {
    if (this.unlocked) {
      return;
    }
    this.unlocked = true;

    if (this.muted) {
      return;
    }
    if (this.pendingTrack) {
      const track = this.pendingTrack;
      this.pendingTrack = null;
      this.playMusic(track);
    }
  }

  playMusic(track: MusicTrack): void {
    if (this.currentTrack === track) {
      return;
    }

    if (!this.unlocked) {
      this.pendingTrack = track;
      return;
    }

    this.stopMusic();
    this.currentTrack = track;

    if (this.muted) {
      return;
    }

    const sound = this.music.get(track);
    if (!sound) {
      return;
    }

    // Volume ramps inside Excalibur, so the track fades in instead of popping.
    sound.volume = 0;
    void sound.play({ loop: true });
    sound.volume = MUSIC_VOLUME;
  }

  stopMusic(): void {
    for (const sound of this.music.values()) {
      sound.stop();
    }
    this.currentTrack = null;
  }

  /** Effects are dropped before unlock and while muted; they are never queued. */
  playSfx(key: string): void {
    if (!this.unlocked || this.muted) {
      return;
    }
    const sound = this.effects.get(key);
    if (!sound) {
      return;
    }
    void sound.play();
  }

  toggleMuted(): boolean {
    this.muted = !this.muted;
    writeMuted(this.muted);

    if (this.muted) {
      this.stopMusic();
    } else if (this.unlocked && this.currentTrack) {
      // Un-muting resumes the track the scene had asked for.
      const track = this.currentTrack;
      this.stopMusic();
      this.playMusic(track);
    }

    return this.muted;
  }

  /** Called when a scene takes over: plays that scene's track if audio allows it. */
  syncMusic(track: MusicTrack): void {
    if (this.muted) {
      this.currentTrack = track;
      return;
    }
    this.playMusic(track);
  }
}

export const audio = new Audio();

// Handle for the visual/functional smoke test: lets a headless run inspect what played.
(window as unknown as { __audio?: Audio }).__audio = audio;
