import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles({
  // for all materialUI TextField
  formInput: {
    flex: 1,
    marginBottom: '20px',
    minWidth: 150,

    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#9fc654',
      borderWidth: '2px',
    },
    '& .MuiOutlinedInput-root': {
      fontFamily: 'Montserrat',
    },

    '& .MuiFormLabel-root MuiInputLabel-root .Mui-focused': {
      color: '#9fc654',
    },

    '& .MuiFormControl-root .MuiTextField-root': {
      marginBottom: '50px',
    },

    '& .MuiInputLabel-root.Mui-focused': {
      color: '#9fc654',
      fontFamily: 'Montserrat',
    },
    '& .MuiFormHelperText-root': {
      color: 'red',
    },
  },
  require: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'red',
      borderWidth: 2,
    },
  },

  narrowFormInput: {
    flex: 1,
    marginBottom: '20px',
    minWidth: 150,
    '& .MuiFormLabel-root': {
      top: '-5px',
      fontFamily: 'Montserrat',
    },

    '& .MuiOutlinedInput-root input': {
      padding: 10,
      minWidth: 150,
      fontFamily: 'Montserrat',
    },

    '& .MuiSelect-select': {
      padding: 10,
    },

    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#f15a29',
      borderWidth: '2px',
    },

    '& .MuiFormLabel-root MuiInputLabel-root .Mui-focused': {
      color: '#f15a29',
    },

    '& .MuiFormControl-root .MuiTextField-root': {
      marginBottom: '50px',
    },

    '& .MuiInputLabel-root.Mui-focused': {
      color: '#f15a29',
    },
    '& .MuiFormHelperText-root': {
      color: 'red',
    },
  },

  // for all materialUI Button
  button: {
    display: 'flex',
    color: '#fff',
    '& .MuiButton-root': {
      backgroundColor: '#f15a29',
      borderRadius: '50px',
      flex: 1,
      color: '#fff',
      fontFamily: 'Montserrat',
      fontWeight: 600,
      transition: '0.2s',
    },
    '& .MuiButton-root:hover': {
      backgroundColor: '#e75525',
    },
  },

  button_out: {
    display: 'flex',
    color: '#fff',

    '& .MuiButton-root': {
      flex: 1,
      borderRadius: '50px',
      color: '#f15a29',
      height: 39,
      fontFamily: 'Montserrat',
      fontWeight: 600,
      border: '1px solid #f15a29',
    },
    '& .MuiButton-root:hover': {
      backgroundColor: '#f15b2910',
    },
  },

  tabBtn: {
    fontSize: 10,
    padding: 5,
    '& .MuiButtonBase-root .MuiTab-root': {
      fontSize: 10,
      padding: 5,
    },
  },

  delete_btn: {
    '& .MuiButtonBase-root': {
      color: 'green',
    },
  },

  //for tabs

  tabs_container: {
    display: 'flex',
    flexDirection: 'column',
    '& .MuiTabPanel-root': {
      padding: 10,
    },
  },

  tabs: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    height: 50,

    '& .MuiTab-root': {
      color: '#f15a29',
      fontFamily: 'Montserrat',
    },
  },

  // for all materialUI appBar
  header: {
    background: '#f15a29 !important',
    paddingLeft: 15,
    display: 'flex',
    height: '55px',
    minHeight: '55px !important',
    flexDirection: 'row',
    '& .MuiToolbar-root ': {
      paddingLeft: '15px',
      flex: 1,
      height: '55px',
      justifyContent: 'space-between',
      '@media (min-width: 600px)': {
        minHeight: '55px',
      },
    },

    '& .MuiPaper-root': {
      // background: 'linear-gradient(240deg, #e94b2d, #ffab27)',
      height: 50,
      paddingLeft: '20px',
      overflow: 'hidden',
    },
    '& .MuiPaper-root .MuiList-root': {
      display: 'flex',
    },
  },

  link: {
    '& .MuiButtonBase-root': {
      fontWeight: '400',
    },
    '& .MuiList-root': {},

    '& .active_link': {
      color: '#9fc654',
      justifyContent: 'center',
    },
  },

  leftDrawer: {
    '& .MuiPaper-root': {
      width: '250px',
      //height = 100% - height of header
      height: 'calc(100% - 55px)',
      top: 55,
    },
  },

  select: {
    '& .MuiSelect-select': {
      padding: '5px',
    },
    '& .MuiFormHelperText-root': {
      marginLeft: 0,
    },
    '& .MuiFormControl-root': {
      marginLeft: 0,
    },
  },

  input: {
    '& .MuiOutlinedInput-root input': {
      padding: 5,
    },

    //for filter label
    '& .MuiInputLabel-root': {
      top: -4,
    },
  },

  table: {
    '& .MuiTableRow-root:hover': {
      // backgroundColor: '#ffab27',
      cursor: 'pointer',
    },
  },
});
