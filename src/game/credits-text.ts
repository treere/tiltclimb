/**
 * Text of the credits page. Kept out of the scene so the story can be rewritten without
 * touching layout code, and so it is readable without opening a scene.
 */

/** Four lines: who the hero is and why the ship keeps climbing. */
export const STORY: string[] = [
  'Il salto è andato storto. Il pilota si è svegliato solo, in un campo di asteroidi, ' +
    'con la strumentazione che dice una cosa sola: la squadra è passata di qui.',
  'La rotta è segnata dai relitti, e i relitti sono pieni di navi che non vogliono farti passare.',
  'I motori reggono, il carburante no. L’unico modo per raggiungerli è salire, e salire in fretta.',
];

export type CreditLine = { label: string; value: string };

export const CREDITS: CreditLine[] = [
  { label: 'Ideazione, game design e direzione', value: 'Andrea Tomasi' },
  { label: 'Grafica', value: 'Kenney — Space Shooter Redux (CC0 1.0)' },
  { label: 'Motore', value: 'Excalibur 1.0' },
  { label: 'Codice', value: 'TypeScript + Vite' },
];
