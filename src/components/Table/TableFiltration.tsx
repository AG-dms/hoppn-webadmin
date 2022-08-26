import { HeaderColumn, Filtration } from '@/components/Table/TableContentFrame';
import useDebounce from '@/customHooks/useDebounce';
import { useStyles } from '@/styles/materialCustom';
import { FormHelperText, TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './TableStyles.module.scss';
import { useAppDispatch } from '@/customHooks/storeHooks';
interface Props {
  filtrationField: Filtration[];
  handleFiltrationColumnChange: (event: SelectChangeEvent) => void;
  handleFiltrationOperatorChange: (event: SelectChangeEvent) => void;
  handleFiltrationChangeSearch: (event) => void;
  handleFiltrationSubmitSearch: () => void;
  resetOffset: any;
  searchInputText: string;
  initOperator: string;
  showFilterValue: string;
  headerTitle?: string;
}

const TableFiltration: React.FC<Props> = ({
  filtrationField,
  handleFiltrationChangeSearch,
  handleFiltrationColumnChange,
  handleFiltrationOperatorChange,
  handleFiltrationSubmitSearch,
  initOperator,
  showFilterValue,
  resetOffset,
  searchInputText,
  headerTitle,
}) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const debouncedSearchTerm = useDebounce(searchInputText, 500);
  const [isSearching, setIsSearching] = useState(false);
  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      dispatch(resetOffset());
      handleFiltrationSubmitSearch();
      setIsSearching(false);
    } else {
      handleFiltrationSubmitSearch();
    }
  }, [debouncedSearchTerm]);

  return (
    <div className={styles.table_filtration_block}>
      <div className={styles.table_filtration_block_right}>
        <h3 style={{ marginTop: 12, marginBottom: 10, fontWeight: 600 }}>{headerTitle}</h3>
      </div>
      <div className={styles.table_filtration_block_left}>
        <div className={classes.select}>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <Select
              labelId="demo-simple-select-placeholder-label-label"
              id="demo-simple-select-placeholder-label"
              value={showFilterValue}
              displayEmpty
              onChange={handleFiltrationColumnChange}
            >
              {filtrationField.map(item => {
                return (
                  <MenuItem value={item.filterName} key={item.name}>
                    {item.name}
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText>Filter</FormHelperText>
          </FormControl>
        </div>

        <div>
          <FormControl className={classes.select} sx={{ m: 1, minWidth: 120 }}>
            <Select
              labelId="demo-simple-select-placeholder-label-label"
              id="demo-simple-select-placeholder-label"
              value={initOperator}
              onChange={handleFiltrationOperatorChange}
            >
              <MenuItem value="co">Contains</MenuItem>
              <MenuItem value="sw">Starts with</MenuItem>
              <MenuItem value="eq">Equal</MenuItem>
              <MenuItem value="gt">Greater</MenuItem>
              <MenuItem value="gte">Greater or equal</MenuItem>
              <MenuItem value="lt">Less than</MenuItem>
              <MenuItem value="lte">Less than or equal</MenuItem>
              <MenuItem value="ne">No equal</MenuItem>
            </Select>
            <FormHelperText>Operator</FormHelperText>
          </FormControl>
        </div>
        <div>
          <TextField
            className={classes.input}
            style={{ maxWidth: 160, paddingTop: 8, marginLeft: 9 }}
            id="standard-basic"
            // label="Value"
            placeholder="Value"
            value={searchInputText}
            onChange={handleFiltrationChangeSearch}
          />
        </div>
      </div>
    </div>
  );
};

export default TableFiltration;
