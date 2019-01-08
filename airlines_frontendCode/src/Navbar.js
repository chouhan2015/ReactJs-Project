import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import Button from "@material-ui/core/Button";
import { typography } from "material-ui/styles";
import FilterData from "./FilterData";
import { Link } from "react-router-dom";
import DraftsIcon from "@material-ui/icons/Drafts";
import StarIcon from "@material-ui/icons/Star";
import SendIcon from "@material-ui/icons/Send";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }
});

class Navbar extends React.Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false
    };
  }

  componentDidMount() {
    this.props.history.listen(location => {
      console.log("In componentDidMount ", location);
      console.log("state after redirect = ", this.state.loggedIn);
      console.log(sessionStorage.getItem("isLoggedIn"));
      if (sessionStorage.isLoggedIn !== "true") {
        console.log("in If part");
        if (this.state.loggedIn) this.setState({ loggedIn: false });
      } else {
        console.log("in else part = ", !this.state.loggedIn);
        if (!this.state.loggedIn) {
          console.log("jhbefdfskjhfjkevfh");
          this.setState({ loggedIn: true }, () => {
            console.log("state after redirect = ", this.state.loggedIn);
          });
        }
      }
    });
  }

  componentWillMount() {
    console.log("In componentDidMount ", sessionStorage.isLoggedIn);
    if (sessionStorage.isLoggedIn !== "true") {
      this.setState({ loggedIn: false });

      this.props.history.push("/Login");
    } else {
      this.setState({ loggedIn: true });
    }
  }

  handleClick(event) {
    sessionStorage.clear();
    window.location.href = "/";
  }

  handleRedirect(event) {
    this.props.history.push("/Home")
  }
 
  redirectBookedTicket(event) {
    this.props.history.push("/BookedFlightList")
  }

  redirectFilterTicket(event) {
    this.props.history.push("/FilterData")
  }
  
  redirectAddFlight (event){
    this.props.history.push("/addFlight")
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, theme } = this.props;
    const { open } = this.state;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="static"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: open
          })}
        >
          {this.state.loggedIn ? (
            <Toolbar disableGutters={!open}>
              
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              <typography className={classes.title} variant="h6" color="inherit" >
                Airlines Application
              </typography>
              <Button className="logout" color="inherit" onClick={event => this.handleClick(event)}>
                Logout
              </Button>
              <Button className="logout" color="inherit" onClick={event => this.handleRedirect(event)}>
                Home
              </Button>
              
            </Toolbar>
          ) : (
              <Toolbar disableGutters={!open}>
                <IconButton color="inherit" aria-label="Open drawer" className={classNames(classes.menuButton, open && classes.hide)}>
                  <MenuIcon />
                </IconButton>
              </Toolbar>
            )}
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
          <Divider />
          {/* <List>
            {["Your Tickets", "Filter Tickests"].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <a href="/BookedFlightList">Your Tickets</a> 
                <a href="/FilterData">Filter Ticket</a>

                <ListItemText primary={text} />
              </ListItem>
              
            ))}
          </List> */}
          <List>
          <ListItem button>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Your Tickets" onClick={event => this.redirectBookedTicket(event)}/>
          </ListItem>          
          <ListItem button>
            <ListItemIcon>
              <StarIcon />
            </ListItemIcon>
           <ListItemText primary="Filter Ticket" onClick={event => this.redirectFilterTicket(event)}/>
          </ListItem> 
          <ListItem button>
            <ListItemIcon>
              <StarIcon />
            </ListItemIcon>
           <ListItemText primary="Add Flight" onClick={event => this.redirectAddFlight(event)}/>
          </ListItem>          
        </List>
        </Drawer>
      </div>
    );
  }
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Navbar);
