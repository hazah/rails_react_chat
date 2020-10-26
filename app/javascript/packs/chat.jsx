import React, { useState } from "react";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import authReducer from "./chat-reducer";
import {
  authenticate,
  logout,
  getUser,
  authSuccess,
  getChannels,
  channelsRecieved,
  channelSelected,
  retrieveMessages,
} from "./chat-actions";
import { connect, Provider } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import {
  CssBaseline,
  Container,
  Button,
  TextField,
  Box,
  makeStyles,
  Typography,
  Card,
  CardContent,
  CardActions,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CardHeader,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const store = createStore(authReducer, applyMiddleware(thunkMiddleware));

if (!!localStorage.token) {
  getUser()
    .then((user) => {
      console.log(user);
      store.dispatch(authSuccess(user, localStorage.token));
      return getChannels();
    })
    .then((channels) => {
      console.log(channels);
      store.dispatch(channelsRecieved(channels));
    });
}

function logoutDispatcher(dispatch) {
  return {
    logout: () => dispatch(logout()),
  };
}

function logoutStateMapper(state) {
  return {
    authenticated: state.auth.authenticated,
  };
}

const Logout = connect(
  logoutStateMapper,
  logoutDispatcher
)(({ logout }) => {
  const submitHandler = (event) => {
    event.preventDefault();
    logout();
  };

  return <button onClick={submitHandler}>Logout</button>;
});

function errorStateMapper(state) {
  return {
    errors: state.auth.errors,
  };
}

const Errors = connect(errorStateMapper)(({ errors }) => {
  if (errors.length > 0) {
    return (
      <Alert severity="error">
        <ul>
          {errors.map((error, index) => (
            <li key={index}>{error.error.message}</li>
          ))}
        </ul>
      </Alert>
    );
  }

  return null;
});

function loginDispatcher(dispatch) {
  return {
    authenticate: (email, password) =>
      dispatch(authenticate({ email: email, password: password })),
  };
}

function loginStateMapper(state) {
  return {
    authenticated: state.auth.authenticated,
  };
}

const Login = connect(
  loginStateMapper,
  loginDispatcher
)(({ authenticate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (event) => {
    event.preventDefault();
    authenticate(email, password);
  };

  return (
    <Box mt={10}>
      <Errors />
      <Card>
        <form onSubmit={submitHandler}>
          <CardContent>
            <Typography variant="subtitle1" align="center" gutterBottom={true}>
              Please sign in to continue
            </Typography>
          </CardContent>
          <CardContent>
            <TextField
              type="email"
              label="email"
              fullWidth={true}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <TextField
              type="password"
              label="password"
              fullWidth={true}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </CardContent>
          <CardActions>
            <Button type="submit" color="primary">
              Sign In
            </Button>
          </CardActions>
        </form>
      </Card>
    </Box>
  );
});

function chatDispatcher(dispatch) {
  return {
    channelSelected: (channelId) => dispatch(channelSelected(channelId)),
    retrieveMessages: (channelId) => dispatch(retrieveMessages(channelId)),
  };
}

function chatStateMapper(state) {
  return {
    channels: state.chat.channels,
    currentChannel: state.chat.currentChannel,
    messages: state.chat.messages,
  };
}

const chatDrawerWidth = 240;

const chatStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100%",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: chatDrawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: chatDrawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  message: {
    marginTop: theme.spacing(3)
  },
  'message::first': {
    marginTop: 0,
  }
}));

const Chat = connect(
  chatStateMapper,
  chatDispatcher
)(
  ({
    channels,
    currentChannel,
    channelSelected,
    retrieveMessages,
    messages,
  }) => {
    const classes = chatStyles();

    const pluralize = ({ singular, plural, count, showCount, zero }) => {
      if (count === 0 && zero) {
        return zero;
      }

      let output = singular;
      if (count !== 1) {
        output = plural || `${singular}s`;
      }

      return showCount ? `${count} ${output}` : output;
    };

    let mainWindow;

    if (currentChannel) {
      mainWindow = (
        <div>
          {messages.length > 0 &&
            messages.map((message, index) => (
              <Card key={index} className={classes.message}>
                <CardHeader
                  avatar={
                    <Avatar>
                      {channels[currentChannel].users
                        .find((user) => user.id === message.user_id)
                        .email.substring(0, 2)
                        .toUpperCase()}
                    </Avatar>
                  }
                  title={message.created_at}
                  subheader={
                    channels[currentChannel].users.find(
                      (user) => user.id === message.user_id
                    ).email
                  }
                />
                <CardContent>{message.content}</CardContent>
              </Card>
            ))}
        </div>
      );
    } else {
      mainWindow = (
        <Typography paragraph>Please choose a channel on the left of the screen.</Typography>
      );
    }

    return (
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" noWrap>
              Chat Stuff
              {currentChannel
                ? ` - ${
                    channels.find((channel) => channel.id === currentChannel)
                      .name
                  }`
                : null}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={classes.drawer}
          classes={{ paper: classes.paper }}
        >
          <Toolbar />
          <div className={classes.drawerContainer}>
            <List>
              {channels.map((channel) => (
                <ListItem
                  button
                  key={channel.id}
                  selected={currentChannel === channel.id}
                  onClick={() => {
                    channelSelected(channel.id);
                    retrieveMessages(channel.id);
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      {channel.name.split(" ")[1].substring(0, 2).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={channel.name}
                    secondary={`${pluralize({
                      singular: "user",
                      count: channel.users.length,
                      showCount: true,
                    })}, <##> online`}
                  />
                </ListItem>
              ))}
            </List>
          </div>
        </Drawer>
        <Box
          component="main"
          width="100%"
          height="100%"
          className={classes.content}
        >
          <Toolbar />
          {mainWindow}
        </Box>
      </div>
    );
  }
);

function routeStateMapper(state) {
  return {
    authenticated: state.auth.authenticated,
  };
}

const PublicRoute = connect(routeStateMapper)(
  ({ children, authenticated, ...props }) => {
    function publicRoute(location) {
      if (!authenticated) {
        return children;
      }
      return <Redirect to={{ pathname: "/" }} />;
    }

    return (
      <Route {...props} render={({ location }) => publicRoute(location)} />
    );
  }
);

const PrivateRoute = connect(routeStateMapper)(
  ({ children, authenticated, ...props }) => {
    function protectedRoute(location) {
      if (authenticated) {
        return children;
      }
      return <Redirect to={{ pathname: "/login" }} />;
    }

    return (
      <Route {...props} render={({ location }) => protectedRoute(location)} />
    );
  }
);

function MainApplication() {
  return (
    <Switch>
      <PublicRoute path="/login">
        <Container maxWidth="xs" style={{ height: "100%" }}>
          <Login />
        </Container>
      </PublicRoute>
      <PrivateRoute path="/">
        <Chat />
      </PrivateRoute>
    </Switch>
  );
}

export default () => {
  return (
    <Provider store={store}>
      <CssBaseline />
      <MainApplication />
    </Provider>
  );
};
