import React, { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim'; // Slim version for smaller bundle size
import type { ISourceOptions } from '@tsparticles/engine';
interface IParticles{
    id: string 
}
const ParticlesComponent: React.FC<IParticles> = (props) => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
        background: {
            color: {
              value: 'linear-gradient(to right, #ff7e5f, #feb47b)', // Deixe em branco para permitir que o gradiente seja aplicado
            },

      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: {
            enable: false,
            mode: 'repulse',
          },
          onHover: {
            enable: true,
            mode: 'grab',
          },
          resize: {
            enable: true, // Fixing the type issue here
          },
        },
        modes: {
          grab: {
            distance: 200,
            links: {
              opacity: 1,
            },
          },
          repulse: {
            distance: 400,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: '#CCCCCC',
        },
        links: {
          color: '#CCCCCC',
          distance: 300,
          enable: true,
          opacity: 0.4,
          width: 1,
        },
        move: {
          direction: 'none',
          enable: true,
          outModes: {
            default: 'bounce',
          },
          random: false,
          speed: 1,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 150,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: 'circle',
        },
        size: {
          random: true,
          value: 2,
        },
        stroke: {
          width: 3,
          color: {
            value: ['#800080', '#000000'], // Alternate border colors (blue and black)
          },
        },
      },
      detectRetina: true,
    }),
    [],
  );

  return( <Particles id={props.id} options={options} /> 
)
};

export default ParticlesComponent;
