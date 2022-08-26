import React from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

interface MapProps extends google.maps.MapOptions {
  style: { [key: string]: string };
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
}

const Map: React.FC<MapProps> = React.memo(({ onClick, onIdle, children, style, ...options }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [map, setMap] = React.useState<google.maps.Map>();

  React.useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, { streetViewControl: false }));
    }
  }, [ref, map]);

  useDeepCompareEffect(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  React.useEffect(() => {
    if (map) {
      ['click', 'idle'].forEach(eventName => google.maps.event.clearListeners(map, eventName));

      if (onClick) {
        map.addListener('click', onClick);
      }

      if (onIdle) {
        map.addListener('idle', () => onIdle(map));
      }
    }
  }, [map, onClick, onIdle]);

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <div style={{ height: 'inherit' }} ref={ref} />
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          return React.cloneElement(child, { map });
        }
      })}
    </div>
  );
});

export default Map;
