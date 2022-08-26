import { Address_Components, ApiAddress, GoogleMap } from '@/api/dto/VendorResponseData';
import { apiGetCoordinate } from '@/api/mapsAPI';
import { Icon } from '@mui/material';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import usePlacesAutocomplete, { GeocodeResult, getGeocode } from 'use-places-autocomplete';
import styles from '../vendorProfile.module.scss';
import SearchIcon from '@mui/icons-material/Search';
interface Props {
  setAddress: Dispatch<SetStateAction<any>>;
  setClick: Dispatch<SetStateAction<any>>;
  setCenter: Dispatch<SetStateAction<any>>;
  // address: GoogleMap;
  center: google.maps.LatLngLiteral;
  click: google.maps.LatLng;
}

const PlacesAutocomplete: React.FC<Props> = ({
  setAddress,
  setClick,
  setCenter,
  click,
  center,
}) => {
  const {
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });
  const ref = useOnclickOutside(() => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  const changeAddress = (address: string) => {
    apiGetCoordinate(address)
      .then(response => response.json())
      .then(dataRes => {
        const result: ApiAddress =
          dataRes.results.find(item => item.types.includes('street_address')) ||
          dataRes.results.find(item => item.types.includes('plus_code'));
        setValue(result.formatted_address, false);
        clearSuggestions();
      });
  };

  useEffect(() => {
    if (click) {
      changeAddress(click.toUrlValue());
    }
  }, [click]);

  const handleInput = e => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  const handleSelect =
    ({ description }) =>
    () => {
      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      setValue(description, false);

      clearSuggestions();

      // Get latitude and longitude via utility functions
      getGeocode({ address: description }).then(results => {
        const result: GeocodeResult = results[0];
        const latlng = result.geometry.location;
        setClick(latlng);
        setCenter({
          lat: latlng.lat(),
          lng: latlng.lng(),
        });
      });
    };

  const renderSuggestions = () =>
    data.map(suggestion => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li className={styles.map_list_item} key={place_id} onClick={handleSelect(suggestion)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  return (
    <div style={{ position: 'relative', display: 'flex' }} ref={ref}>
      <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
        <input
          className={styles.map_input}
          value={value}
          onChange={handleInput}
          placeholder="Click on map or entry search text..."
        />
        <SearchIcon />
      </div>
      {status === 'OK' && <ul className={styles.map_list}>{renderSuggestions()}</ul>}
    </div>
  );
};

export default PlacesAutocomplete;
