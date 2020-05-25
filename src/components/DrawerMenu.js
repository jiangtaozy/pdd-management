/*
 * Maintained by jemo from 2020.5.6 to now
 * Created by jemo on 2020.5.6 11:52:24
 * Drawer Menu
 */

import React, { useState } from 'react';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';
import Menu from '@material-ui/icons/Menu';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
//import VpnKeyIcon from '@material-ui/icons/VpnKey';
//import Assessment from '@material-ui/icons/Assessment';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  BrowserRouter  as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import Authorize from './Authorize';
import Selection from './Selection';
import SearchItem from './SearchItem';
import Order from './Order';
import PddItem from './PddItem';

const drawerWidth = 180;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function DrawerMenu(props) {

  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  }

  const handleDrawerClose = () => {
    setOpen(false);
  }

  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <HideOnScroll {...props}>
          <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open,
            })}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="打开菜单"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
              >
                <Menu />
              </IconButton>
              <Typography variant="h6" noWrap>
                小木电商系统
              </Typography>
            </Toolbar>
          </AppBar>
        </HideOnScroll>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeft />
            </IconButton>
          </div>
          <Divider />
          <List>
            {/*
            <Link to="/"
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}>
              <ListItem button>
                <ListItemIcon>
                  <Assessment />
                </ListItemIcon>
                <ListItemText primary="首页" />
              </ListItem>
            </Link>
            <Divider />
            <Link to="/product"
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}>
              <ListItem button>
                <ListItemIcon>
                  <FormatListBulletedIcon />
                </ListItemIcon>
                <ListItemText primary="商品" />
              </ListItem>
            </Link>
            */}
            <Link to="/product/search"
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}>
              <ListItem button>
                <ListItemIcon>
                  <FormatListBulletedIcon />
                </ListItemIcon>
                <ListItemText primary="商品" />
              </ListItem>
            </Link>
            <Divider />
            <Link to="/product/pdd"
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}>
              <ListItem button>
                <ListItemIcon>
                  <FormatListBulletedIcon />
                </ListItemIcon>
                <ListItemText primary="拼多多商品" />
              </ListItem>
            </Link>
            <Divider />
            <Link to="/order"
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}>
              <ListItem button>
                <ListItemIcon>
                  <FormatListBulletedIcon />
                </ListItemIcon>
                <ListItemText primary="订单" />
              </ListItem>
            </Link>
            {/*
            <Link to="/product/select"
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}>
              <ListItem button>
                <ListItemIcon>
                  <FormatListBulletedIcon />
                </ListItemIcon>
                <ListItemText primary="选品" />
              </ListItem>
            </Link>
            */}
            {/*
            <Divider />
            <Link to="/authorize"
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}>
              <ListItem button>
                <ListItemIcon>
                  <VpnKeyIcon />
                </ListItemIcon>
                <ListItemText primary="授权" />
              </ListItem>
            </Link>
            */}
          </List>
        </Drawer>
        <main className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}>
          <div className={classes.drawerHeader} />
          <Switch>
            <Route exact path="/product">
              <div>
              商品
              </div>
            </Route>
            <Route path="/product/search">
              <SearchItem />
            </Route>
            <Route path="/product/pdd">
              <PddItem />
            </Route>
            <Route path="/product/select/:id">
              <Selection />
            </Route>
            <Route path="/authorize">
              <Authorize />
            </Route>
            <Route path="/order">
              <Order />
            </Route>
            <Route path="/">
              <div>
              首页
              </div>
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  )
}

export default DrawerMenu;
