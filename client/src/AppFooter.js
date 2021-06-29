import './App.css';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
//import Link from '@material-ui/core/Link';
import CssBaseline from '@material-ui/core/CssBaseline';


const useStyles = makeStyles((theme) => ({

  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
  },
}));

export default function AppFooter() {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
    <CssBaseline/>
     <Container maxWidth="lg" className="footerCustom">
      <Typography variant="body2" color="textSecondary">
        {'Copyright © Theo Gainey'}
       {' '}
       {new Date().getFullYear()}
       {'.'}
      </Typography>
     </Container>
   </footer>
  );
}
