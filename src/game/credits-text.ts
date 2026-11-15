/**
 * Text of the credits page. Kept out of the scene so the story can be rewritten without
 * touching layout code, and so it is readable without opening a scene.
 */

/** Four lines: who the hero is and why the ship keeps climbing. */
export const STORY: string[] = [
  'The jump went wrong. The pilot woke up alone, in an asteroid field, ' +
    'with the instruments saying one thing only: the squad came through here.',
  'The route is marked by wrecks, and the wrecks are full of ships that do not want to let you through.',
  'The engines hold, the fuel does not. The only way to reach them is to climb, and climb fast.',
];

export type CreditLine = { label: string; value: string };

export const CREDITS: CreditLine[] = [
  { label: 'Concept, game design and direction', value: 'Andrea Tomasi' },
  { label: 'Art', value: 'Kenney — Space Shooter Redux (CC0 1.0)' },
  { label: 'Engine', value: 'Excalibur 1.0' },
  { label: 'Code', value: 'TypeScript + Vite' },
];
