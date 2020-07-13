import React, { Component } from 'react';

const SearchPage = ({ match, location }) => {
   return (
      <>
         <p>
            <strong>Location Props: </strong>
            {JSON.stringify(location, null, 2)}
         </p>
         <p>
            <strong>Query Param: </strong>
            {location.search}
         </p>
      </>
   );
}

export default SearchPage;