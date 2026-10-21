type WaveVariant = 'blue-dark' | 'green-dark' | 'dark-blue' | 'dark-green';

interface WaveDividerProps {
  variant: WaveVariant;
  /** Voltear la onda horizontalmente para variar el ritmo visual */
  flip?: boolean;
}

/**
 * Mapa de colores por variante.
 * bg  = color de fondo (sección superior)
 * fill = color del relleno SVG (sección inferior)
 */
const variantConfig: Record<WaveVariant, { bg: string; fill: string }> = {
  'blue-dark':  { bg: '#0a2240', fill: '#061828' },
  'green-dark': { bg: '#2E7D32', fill: '#061828' },
  'dark-blue':  { bg: '#061828', fill: '#0a2240' },
  'dark-green': { bg: '#061828', fill: '#2E7D32' },
};

export default function WaveDivider({ variant, flip = false }: WaveDividerProps) {
  const { bg, fill } = variantConfig[variant];

  return (
    <div
      style={{ background: bg, lineHeight: 0, margin: 0, padding: 0, overflow: 'hidden' }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 60"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="60"
        preserveAspectRatio="none"
        style={{
          display: 'block',
          transform: flip ? 'scaleX(-1)' : undefined,
        }}
      >
        <path
          d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
