import React from 'react';
import commentBox from 'commentbox.io';

import qs from 'qs';

var currentCardId = '';

class CommentBox extends React.Component {
   constructor(props) {
      super(props);
      this.props = {
         currentCardId: '',
      };
      this.state = {
         currentCardId: '',
      }
   }

   componentDidMount() {


      //this.removeCommentBox = commentBox('5695436727779328-proj');

      currentCardId = this.props.currentCardId;
      //console.log(this.props.currentCardId);
      //console.log(currentCardId);

      this.removeCommentBox = commentBox('5695436727779328-proj', {
         className: 'commentbox', // the class of divs to look for
         defaultBoxId: 'commentbox', // the default ID to associate to the div
         tlcParam: 'tlc', // used for identifying links to comments on your page
         backgroundColor: null, // default transparent
         textColor: null, // default black
         subtextColor: null, // default grey
         singleSignOn: null, // enables Single Sign-On (for Professional plans only)
         /**
          * Creates a unique URL to each box on your page.
          * 
          * @param {string} boxId
          * @param {Location} pageLocation - a copy of the current window.location
          * @returns {string}
          */
         createBoxUrl(boxId, pageLocation) {

            pageLocation.search = ''; // removes query string!
            pageLocation.hash = boxId; // creates link to this specific Comment Box on your page

            var currentCardId = localStorage.getItem('currentcardIdforComments');

            //console.log(pageLocation); // returns the actual page url in: <a href="http://localhost:3000/home#commentbox">
            //console.log(currentCardId);
            //console.log(pageLocation.href);// returns only the url part: http://localhost:3000/#commentbox

            //This code is used to remove the specific URL part from all pages, so that same comment exists when accessed from / and /bookmarks
            var entireurl = pageLocation.href;
            var array = entireurl.split('/');
            //console.log(array);
            var toplevelurlonly = array[0] + '//' + array[2] + '/#commentbox';
            //console.log(toplevelurlonly); //'http://localhost:3000/bookmarks/#commentbox'; -(RETURNS)-> http://localhost:3000/#commentbox

            return toplevelurlonly + currentCardId; // return url string
         },
         /**
          * Fires once the plugin loads its comments.
          * May fire multiple times in its lifetime.
          * 
          * @param {number} count
          */
         onCommentCount(count) {

         }
      });

   }

   componentWillUnmount() {

      this.removeCommentBox();
   }

   render() {

      return (
         <div className="commentbox" />
      );
   }
}


export default CommentBox;