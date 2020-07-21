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
import ChevronRight from '@material-ui/icons/ChevronRight';
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
import AdData from './AdData';
import AdUnit from './AdUnit';
import AdUnitData from './AdUnitData';
import Stall from './Stall';
import AdUnitList from './AdUnitList';
import DashBoard from './DashBoard';
import Order1688 from './Order1688';
import AdHead from './AdHead';
import PddActivity from './PddActivity';

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
    marginRight: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
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
    justifyContent: 'flex-start',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
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
              <Typography
                variant="h6"
                noWrap
                style={{
                  flexGrow: 1,
                }}>
                <Link to="/"
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                  }}>
                    小木电商系统
                </Link>
              </Typography>
              <IconButton
                color="inherit"
                aria-label="打开菜单"
                onClick={handleDrawerOpen}
                edge="end"
                className={clsx(open && classes.hide)}
              >
                <Menu />
              </IconButton>
            </Toolbar>
          </AppBar>
        </HideOnScroll>
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
            <Route path="/order1688">
              <Order1688 />
            </Route>
            <Route path="/adData">
              <AdData />
            </Route>
            <Route path="/adPlan/:id">
              <AdUnit />
            </Route>
            <Route path="/adUnit/:id">
              <AdUnitData />
            </Route>
            <Route path="/adUnitList">
              <AdUnitList />
            </Route>
            <Route path="/stall">
              <Stall />
            </Route>
            <Route path="/adHead">
              <AdHead />
            </Route>
            <Route path="/pddActivity">
              <PddActivity />
            </Route>
            <Route path="/">
              <DashBoard />
            </Route>
          </Switch>
        </main>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="right"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronRight />
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
            <Divider />
            <Link to="/order1688"
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}>
              <ListItem button>
                <ListItemIcon>
                  <FormatListBulletedIcon />
                </ListItemIcon>
                <ListItemText primary="1688 订单" />
              </ListItem>
            </Link>
            <Divider />
            <Link to="/adData"
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}>
              <ListItem button>
                <ListItemIcon>
                  <FormatListBulletedIcon />
                </ListItemIcon>
                <ListItemText primary="推广计划" />
              </ListItem>
            </Link>
            <Link to="/adUnitList"
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}>
              <ListItem button>
                <ListItemIcon>
                  <FormatListBulletedIcon />
                </ListItemIcon>
                <ListItemText primary="推广单元" />
              </ListItem>
            </Link>
            <Link to="/pddActivity"
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}>
              <ListItem button>
                <ListItemIcon>
                  <FormatListBulletedIcon />
                </ListItemIcon>
                <ListItemText primary="优惠活动" />
              </ListItem>
            </Link>
            <Divider />
            <Link to="/stall"
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}>
              <ListItem button>
                <ListItemIcon>
                  <FormatListBulletedIcon />
                </ListItemIcon>
                <ListItemText primary="供应商" />
              </ListItem>
            </Link>
            <Link to="/adHead"
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}>
              <ListItem button>
                <ListItemIcon>
                  <FormatListBulletedIcon />
                </ListItemIcon>
                <ListItemText primary="推广团长" />
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
      </div>
    </Router>
  )
}

export default DrawerMenu;
