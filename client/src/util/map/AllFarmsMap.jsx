import React from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';
import * as proj from 'ol/proj';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

export default class AllFarmsMap extends React.Component {
  constructor(props) {
    super(props);

    const { locations } = props;

    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 32],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'marker.jpg',
      }),
    });

    const features = locations.map(location => {
      const posBg = proj.fromLonLat([location.lon, location.lat]);

      const pinFeature = new Feature({
        geometry: new Point(posBg),
      });

      pinFeature.setStyle(iconStyle);

      return pinFeature;
    });

    this.pinLayer = new VectorLayer({
      source: new VectorSource({
        features: features,
      }),
    });

    this.state = {
      center: proj.fromLonLat([0, 0]),
      zoom: 2,
      myMap: new Map({
        target: null,
        layers: [new TileLayer({ source: new OSM() }), this.pinLayer],
        view: new View({
          center: proj.fromLonLat([0, 0]),
          zoom: 2,
        }),
      }),
    };
  }

  componentDidMount() {
    this.state.myMap.setTarget("map-container");
  }

  componentDidUpdate(prevProps) {
    if (prevProps.locations !== this.props.locations) {
      const { locations } = this.props;
      const features = locations.map(location => {
        const posBg = proj.fromLonLat([location.lon, location.lat]);

        const pinFeature = new Feature({
          geometry: new Point(posBg),
        });

        pinFeature.setStyle(this.iconStyle);

        return pinFeature;
      });

      const vectorSource = this.pinLayer.getSource();
      vectorSource.clear();
      vectorSource.addFeatures(features);
    }
  }

  render() {
    return (
      <div style={{ height: '90vh', width: '100%', position: 'relative', zIndex: '1' }} id="map-container" className="map-container" />
    );
  }
}
