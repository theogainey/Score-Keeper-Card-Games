import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppsIcon from '@material-ui/icons/Apps';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  homePageSection: {
    marginTop: theme.spacing(16),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function HomePage() {
  const classes = useStyles();
  function goToGame(){
    fetch('/api/resetgamedata',{method: 'post'}).then( window.open("/oh-hell","_self"));

  }

  return (
    <Container className={classes.homePageSection} component="main" maxWidth="xs">
      <CssBaseline />
      <Paper  variant="outlined">
        <Container component="section" maxWidth="xs" className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AppsIcon />
        </Avatar>
        <Typography component="h2" variant="h2">
          Game List
        </Typography>
        <form className={classes.form} noValidate>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={goToGame.bind(this)}
            className={classes.submit}
          >
            Oh Hell
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Rule Book
          </Button>
        </form>
        </Container>
      </Paper>
    </Container>
  );
}
