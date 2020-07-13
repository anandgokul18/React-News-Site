import _ from 'lodash'
import React, { Component } from 'react'
import { Search, Form, Grid, Header, Segment, Container, List } from 'semantic-ui-react'

var currentValueInsideField = '';

class SearchApp extends Component {
   constructor(props) {
      super(props);
      this.state = { results: ['null'], selectedResult: null, previousQuery: null };

      //console.log(localStorage.getItem('isThisSearchPage'));


      //Retrieving the previous search query state from Storage
      //console.log(window.location.href);
      //var entireurl = window.location.href;
      //var array = entireurl.split('?');
      //if (array[0] === 'http://localhost:3000/search') {
      var retrievedPrevQueryObject = localStorage.getItem('searchQuery');
      if (retrievedPrevQueryObject == null) {
         //console.log('Detected null');
         this.state.previousQuery = null;
      } else {
         //console.log('Detected ' + (retrievedSwitch1stateObject === 'true'));
         this.state.previousQuery = retrievedPrevQueryObject;

      }
      //} else {
      //   this.state.previousQuery = null;
      //}

   }

   handleKeyPress = (event) => {
      if (event.key === 'Enter') {
         console.log(currentValueInsideField);
         localStorage.setItem('searchQuery', currentValueInsideField);
         //this.state.previousQuery = currentValueInsideField;
         this.props.searchQueryProp(currentValueInsideField);
      }
   }


   handleSearchChange = async (event, { value }) => {

      //To handle enter key press
      currentValueInsideField = value;

      try {
         const response = await fetch(
            `https://api.cognitive.microsoft.com/bing/v7.0/suggestions?mkt=fr-FR&q=${value}`,
            {
               headers: {
                  "Ocp-Apim-Subscription-Key": "d901d64eeb334505825c20a547b760ba"
               }
            }
         );
         const data = await response.json();
         const resultsRaw = data.suggestionGroups[0].searchSuggestions;
         const results = resultsRaw.map(result => ({ title: result.displayText, url: result.url }));
         this.setState({ results });


      } catch (error) {

         console.error(`Error fetching search ${value}`);
      }
   };

   handleResultSelect = (e, { result }) => {
      this.setState({ selectedResult: result });
      this.state.selectedResult = result;
      e.preventDefault();
      localStorage.setItem('searchQuery', result.title);
      //console.log(result.title);
      //this.state.previousQuery = result.title;
      this.props.searchQueryProp(result.title);
   }

   render() {
      const { value, results } = this.state

      return (
         <Form onKeyPress={this.handleKeyPress}>
            <Search
               onResultSelect={this.handleResultSelect}
               onSearchChange={_.debounce(this.handleSearchChange, 1000, {
                  leading: true,
               })}
               results={this.state.results}
               {...this.props}
               style={{ overflow: 'visible' }}
               icon={'chevron down'}
               placeholder="Enter keyword..."
               defaultValue={this.state.previousQuery}
            /> {/*Add this for persisting search query  defaultValue={this.state.previousQuery} */}
         </Form>
      )
   }
}

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

export default SearchApp;