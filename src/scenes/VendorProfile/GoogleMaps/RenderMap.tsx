import { Address_Components, ApiAddress, GoogleMap } from '@/api/dto/VendorResponseData';
import { apiGetCoordinate } from '@/api/mapsAPI';
import React, { Dispatch, memo, SetStateAction, useEffect } from 'react';
import PlacesAutocomplete from './AutoComplite';
import Map from './Map';
import Marker from './Marker';

interface Props {
  setAddress: Dispatch<SetStateAction<any>>;
  address: GoogleMap;
}

const RenderMap: React.FC<Props> = memo(({ setAddress, address }) => {
  const [click, setClick] = React.useState<google.maps.LatLng>(null);
  const [zoom, setZoom] = React.useState(12);

  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>(
    address?.latitude && address?.longitude
      ? {
          lat: Number(address.latitude),
          lng: Number(address.longitude),
        }
      : {
          lat: 4.834363199999999,
          lng: 7.006314499999999,
        },
  );

  useEffect(() => {
    if (!click) return;
    const coordinate = click.toUrlValue();
    apiGetCoordinate(coordinate)
      .then(response => response.json())
      .then(data => {
        const result: ApiAddress =
          data.results.find(item => item.types.includes('street_address')) ||
          data.results.find(item => item.types.includes('plus_code'));

        const localAddress: GoogleMap = {
          address_line_1: '',
          plus_code: '',
          latitude: 0,
          longitude: 0,
          city: '',
          country: '',
          district: '',
          postcode: '',
        };

        localAddress.plus_code = data.plus_code.compound_code;

        if (result.formatted_address) {
          localAddress.address_line_1 = result.formatted_address;
        }
        if (result.geometry.location.lat) {
          localAddress.latitude = result.geometry.location.lat;
        }
        if (result.geometry.location.lng) {
          localAddress.longitude = result.geometry.location.lng;
        }
        result.address_components.forEach(item => {
          if (item.types.includes('country')) {
            localAddress.country = item.long_name;
          }
          if (item.types.includes('locality')) {
            localAddress.city = item.long_name;
          }
          if (item.types.includes('postal_code')) {
            localAddress.postcode = item.long_name;
          }
          if (item.types.includes('neighborhood')) {
            localAddress.district = item.long_name;
          }
        });
        setAddress(localAddress);
      });
  }, [click]);

  const onClick = (e: google.maps.MapMouseEvent) => {
    setClick(e.latLng);
  };

  const onIdle = (m: google.maps.Map) => {
    setZoom(m.getZoom()!);
    setCenter(m.getCenter()!.toJSON());
  };

  return (
    <>
      <PlacesAutocomplete
        setCenter={setCenter}
        setClick={setClick}
        setAddress={setAddress}
        center={center}
        click={click}
      />

      <Map
        center={center}
        onClick={onClick}
        onIdle={onIdle}
        zoom={zoom}
        style={{ flexGrow: '1', height: '100%' }}
      >
        {!!click && <Marker position={click} />}
        {!click && !!address && (
          <Marker position={{ lat: Number(address.latitude), lng: Number(address.longitude) }} />
        )}
      </Map>
    </>
  );
});

export default RenderMap;
