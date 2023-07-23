import React, { useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';

import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

const Mapa = ({ coordinates }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 32],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'marker.png',
        scale: 0.08, // Change the scale value to adjust the marker size
      }),
    });

    const myMap = new Map({
      target: mapRef.current,
      layers: [new TileLayer({ source: new OSM() })],
      view: new View({
        center: coordinates,
        zoom: 18,
      }),
    });

    const pinFeature = new Feature({
      geometry: new Point(coordinates),
    });

    pinFeature.setStyle(iconStyle);

    const pinLayer = new VectorLayer({
      source: new VectorSource({
        features: [pinFeature],
      }),
    });

    myMap.addLayer(pinLayer);

    return () => {
      myMap.setTarget(null);
    };
  }, [coordinates]);

  return <div style={{ height: '100%', width: '100%', position: 'relative', zIndex: '1' }} ref={mapRef} />;
};

export default Mapa;
