import React, { Component } from 'react'
import axios from 'axios'

import { Button, Navbar, Nav, NavLink, NavDropdown, Form, FormControl } from 'react-bootstrap'
import InputGroup from 'react-bootstrap/InputGroup'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

class Search extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         name: null,
      };

      console.log(localStorage.getItem('isThisSearchPage'));


      //Retrieving the previous search query state from Storage
      var retrievedPrevQueryObject = localStorage.getItem('searchQuery');
      if (retrievedPrevQueryObject == null) {
         //console.log('Detected null');
         this.state.name = null;
      } else {
         //console.log('Detected ' + (retrievedSwitch1stateObject === 'true'));
         this.state.name = retrievedPrevQueryObject;

      }


      //if (this.props.resetSearchProp === true) {
      //   this.state.name = null;
      //}
   }

   handleChange = (e) => {
      this.setState({
         [e.target.name]: e.target.value
      })
   }

   onSubmit = (e) => {
      e.preventDefault();
      const form = {
         name: this.state.name,
      }
      {/* -----------you would send data to API to get results, I used database for ease, this also clears the form on submit----------------*/ }
      localStorage.setItem('searchQuery', this.state.name);
      let temp = this.state.name;
      this.setState({
         name: null,
      })
      this.state.name = null;
      this.props.searchQueryProp(temp);

   }

   render() {
      return (
         <div>
            <Form>
               <InputGroup className="input-group input-group-sm mb-3" style={{ paddingRight: '20px', paddingTop: '10px' }}>
                  <input
                     class="form-control form-control-sm"
                     name='name'
                     value={this.state.name}
                     onChange={e => this.handleChange(e)}
                     placeholder="Enter keyword..."
                  />

                  <div class="input-group-append">
                     <span class="input-group-text" id="inputGroup-sizing-sm" style={{ borderTopRightRadius: '4px', borderBottomRightRadius: '4px' }}><KeyboardArrowDownIcon style={{ fontSize: '15px' }} /></span>
                  </div>
                  <button onClick={(e) => this.onSubmit(e)} style={{ display: 'none' }}>SUBMIT</button>
               </InputGroup>
            </Form>
         </div>
      );
   }
}

export default Search;

