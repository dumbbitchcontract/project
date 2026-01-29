//export function processAmount(amount: bigint) {
//  const min = 1.0;
//  const max = 100.0;
//
//  const scaled = Number(amount / BigInt(1e19));
//
//  const clampedAmount = Math.max(min, Math.min(max, scaled));
//
//  const normalized = (clampedAmount - min) / (max - min);
//
//  return normalized;
//}

export const shapeMappings = [
  {
    x: 0.13,
    y: 0.12,
    width: 0.7,
    height: 0.7
  },
  {
    x: 0.31,
    y: 0.19,
    width: 0.45,
    height: 0.45
  },
  {
    x: 0.215,
    y: 0.16,
    width: 0.6,
    height: 0.6
  },
  {
    x: 0.2,
    y: 0.1,
    width: 0.6,
    height: 0.6
  },
  {
    x: 0.25,
    y: 0.25,
    width: 0.5,
    height: 0.5
  },
  {
    x: 0.155,
    y: 0.115,
    width: 0.7,
    height: 0.7
  },
  {
    x: 0.27,
    y: 0.25,
    width: 0.45,
    height: 0.45
  }
];

export function processAmount(value: number, max = 1000000000000000000000000, ceiling = 1.5) {
  const k = 5 / max;
  return ceiling * (1 - Math.exp(-k * value));
}

export function processShape(shape: number) {
  return shapeMappings[shape];
}

export const colorMappings = {
  Red: [255, 50, 0],
  Blue: [123, 173, 203],
  Purple: [164, 131, 178],
  Orange: [255, 94, 0],
  Green: [0, 255, 0],
  Black: [110, 110, 110],
  Clear: [200, 220, 210],
  White: [250, 250, 250]
};

export function processColor(color: string) {
  return colorMappings[color];
}

export function deriveSubstanceSeed(substance: string) {
  switch (substance.toLowerCase()) {
    case 'modafinil':
      return 1;

    case 'methamphetamine':
      return 1;
    case 'amphetamine':
      return 2;
    case '2-fma':
      return 3;
    case '4-fma':
      return 4;
    case 'lisdexamfetamine':
      return 5;
    case 'dextroamphetamine':
      return 6;
    case 'caffeine':
      return 7;
    case 'cocaine':
      return 8;

    case 'mdma':
      return 1;
    case 'mda':
      return 2;
    case 'pma':
      return 3;
    case 'ethylone':
      return 4;
    case '2c-b':
      return 5;

    case 'phenazepam':
      return 1;
    case 'diazepam':
      return 2;
    case 'alprazolam':
      return 3;
    case 'lorazepam':
      return 4;
    case 'clonazepam':
      return 5;

    case 'dextropropoxyphene':
      return 1;
    case 'oxycodone':
      return 2;
    case 'heroin':
      return 3;
    case 'fentanyl':
      return 4;

    case 'delta-3-thc':
      return 1;
    case 'delta-4-thc':
      return 2;
    case 'delta-7-thc':
      return 3;
    case 'delta-8-thc':
      return 4;
    case 'delta-9-thc':
      return 5;
  }

  throw `could not parse substance: ${substance}`;
}

export function deriveSubstanceClass(substance: string): string {
  switch (substance.toLowerCase()) {
    case 'modafinil':
      return 'nootropics';

    case 'amphetamine':
    case 'methamphetamine':
    case 'caffeine':
    case '2-fma':
    case '4-fma':
    case 'cocaine':
    case 'lisdexamfetamine':
    case 'dextroamphetamine':
      return 'stimulants';

    case 'mdma':
    case 'pma':
    case 'mda':
    case '2c-b':
    case 'ethylone':
      return 'empathogens';

    case 'phenazepam':
    case 'diazepam':
    case 'alprazolam':
    case 'lorazepam':
    case 'clonazepam':
      return 'anxiolytics';

    case 'heroin':
    case 'oxycodone':
    case 'dextropropoxyphene':
    case 'fentanyl':
      return 'opioids';

    case 'delta-8-thc':
    case 'delta-9-thc':
    case 'delta-7-thc':
    case 'delta-3-thc':
    case 'delta-4-thc':
      return 'cannabinoids';
  }

  throw `could not parse substance: ${substance}`;
}

export interface Params {}

export function parseParams(payload: string): Params {
  const paramsString = atob(payload);

  const values = paramsString.split('_');

  if (values.length !== 8) throw 'unexpected payload length';

  return {
    id: Number.parseInt(values[0]),
    color: values[1],
    emblem: values[2],
    shape: Number.parseInt(values[3]) | 0,
    substance: values[4],
    amount: values[5],
    calldata: fromBase64(values[6]),
    consumed: Boolean(Number.parseInt(values[7]))
  };
}

export const hexes = Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, '0'));

export function fromBase64(s: string): string {
  const bytes = [];
  const binary = atob(s);
  for (let i = 0; i < binary.length; i++) {
    bytes.push(binary.charCodeAt(i));
  }

  let string = '';
  for (let i = 0; i < bytes.length; i++) {
    string += hexes[bytes[i]];
  }

  return `0x${string}`;
}

export function toBase64(hex: string): string {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  const bytes = [];
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes.push(parseInt(cleanHex.slice(i, i + 2), 16));
  }
  return btoa(String.fromCharCode(...bytes));
}

export function encodeParams(params: Params): string {
  const calldataB64 = toBase64(params.calldata);
  const values = [
    params.id,
    params.color,
    params.emblem,
    params.shape,
    params.substance,
    params.amount,
    calldataB64,
    params.consumed ? 1 : 0
  ];
  return btoa(values.join('_'));
}
