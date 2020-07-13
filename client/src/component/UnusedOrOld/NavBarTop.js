import React, { Component } from "react";
import logo from "../logo.svg";
import "../App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

//React-BS Button, Navbar and Switch Material-UI
import { Button, Navbar, Nav, NavLink, NavDropdown, Form, FormControl } from 'react-bootstrap'
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import InputGroup from 'react-bootstrap/InputGroup'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

//Axios for Guardian and NYT
const axios = require('axios');

const BlueIOSSwitch = withStyles((theme) => ({
   root: {
      width: 52,
      height: 23,
      padding: 0,
      margin: theme.spacing(1),
   },
   switchBase: {
      padding: 1,
      '&$checked': {
         transform: 'translateX(27.5px)',
         color: theme.palette.common.white,
         '& + $track': {
            backgroundColor: '#0693E3',
            opacity: 1,
            border: 'none',
         },
      },
      '&$focusVisible $thumb': {
         color: '#52d869',
         border: '6px solid #fff',
      },
   },
   thumb: {
      width: 22,
      height: 22,
   },
   track: {
      borderRadius: 26 / 2,
      border: `1px solid ${theme.palette.grey[400]}`,
      backgroundColor: theme.palette.grey[50],
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
   },
   checked: {},
   focusVisible: {},
}))(({ classes, ...props }) => {
   return (
      <Switch
         focusVisibleClassName={classes.focusVisible}
         disableRipple
         classes={{
            root: classes.root,
            switchBase: classes.switchBase,
            thumb: classes.thumb,
            track: classes.track,
            checked: classes.checked,
         }}
         {...props}
      />
   );
});

class NavBarTop extends Component {
   constructor(props) {
      super(props);
      this.state = {
         apiResponse: "",
         switch1: true,
      };
   }

   handleSwitchChange = nr => () => {
      let switchNumber = `switch${nr}`;
      this.setState({
         [switchNumber]: !this.state[switchNumber]
      });
   }

   callAPI() {
      fetch("http://localhost:9000/testAPI")
         .then(res => res.text())
         .then(res => this.setState({ apiResponse: res }))
         .catch(err => err);
   }

   componentDidMount() {
      this.callAPI();
   }

   render() {
      return (
         <Navbar className='navbar' expand="lg" style={{ height: '55px' }}>  {/*bg="light" >*/}
            {/*<Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>*/}
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Form style={{ paddingTop: '10px', paddingRight: '20px' }}>
               <InputGroup className="input-group input-group-sm mb-3">
                  <input class="form-control form-control-sm" type="text" placeholder="Enter keyword..." />
                  <div class="input-group-append">
                     <span class="input-group-text" id="inputGroup-sizing-sm"><KeyboardArrowDownIcon style={{ fontSize: '15px' }} /></span>
                  </div>
               </InputGroup>
            </Form>
            <Navbar.Collapse id="basic-navbar-nav">
               <Nav className="mr-auto" activeKey="/home">
                  <Nav.Item><Nav.Link href="/home" style={navlink}>Home</Nav.Link></Nav.Item>
                  <Nav.Item><Nav.Link href="/world" style={navlink}>World</Nav.Link></Nav.Item>
                  <Nav.Item><Nav.Link href="/politics" style={navlink} >Politics</Nav.Link></Nav.Item>
                  <Nav.Item><Nav.Link href="/business" style={navlink} >Business</Nav.Link></Nav.Item>
                  <Nav.Item><Nav.Link href="/technology" style={navlink} >Technology</Nav.Link></Nav.Item>
                  <Nav.Item><Nav.Link href="/sports" style={navlink} >Sports</Nav.Link></Nav.Item>

                  {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown> */}

               </Nav>

               <BookmarkBorderOutlinedIcon style={{ fontSize: 30, color: "#f9f9f9" }} />

               <div style={{ paddingLeft: '15px', paddingRight: '20px', color: "#f9f9f9" }}>NYTimes </div>
               <FormGroup>
                  <FormControlLabel
                     control={<BlueIOSSwitch checked={this.state.switch1} onChange={this.handleSwitchChange(1)} name="NYTorGuardian" />}
                  />
               </FormGroup>
               <div style={{ color: "#f9f9f9" }}>Guardian </div>

            </Navbar.Collapse>
         </Navbar >
      );
   }
}

const navlink = {
   color: '#9b9b9b',
   "&:hover": {
      color: '#f9f9f9'
   },
   "&:active": {
      color: '#f9f9f9'
   }
};

export default NavBarTop;
