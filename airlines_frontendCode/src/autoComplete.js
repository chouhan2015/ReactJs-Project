import Autosuggest from "react-autosuggest";
import React from "react";
import {CONSTANTS} from './constants';


// Imagine you have a list of languages that you'd like to autosuggest.


// const languages = [
//   {
//     name: "C",
//     year: 1972
//   },
//   {
//     name: "Elm",
//     year: 2012
//   },
//   {
//     name: "CA",
//     year: 1972
//   },
//   {
//     name: "Pune",
//     year: 2012
//   }
// ];


// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = (value,callback) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

//   return inputLength === 0 ? [] : languages.filter(lang => lang.name.toLowerCase().slice(0, inputLength) === inputValue);

if(inputLength>2){
    
    fetch(CONSTANTS.url+"getplaces?place="+inputValue)
        .then((response) => {
          return response.json();
        })
        .then(data => {
            callback(data);
        }).catch(error => {
          console.log(error);
        });
} else {
    callback([]);
}

};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => <div>{suggestion.name}</div>;

export default class AutoComplete extends React.Component {
  constructor() {
    super();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: "",
      suggestions: []
    };
  }

  onChange = (event, { newValue }) => {
    this.setState(
      {
        value: newValue
      },
      () => {
        let obj = {
          target: {
            name: this.props.name,
            value: this.state.value
          }
        };
        this.props.handleChange(obj);
      }
    );
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {

    getSuggestions(value,(data)=>{
        this.setState(
                    {
                      suggestions: data
                    }
                  );
    })
    // .then(data => {
    //     this.setState(
    //         {
    //           suggestions: data
    //         }
    //       );
    //     }).catch(error => {
    //       console.log(error);
    //     });

    
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;
    console.log(this.state)

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: this.props.placeholder,
      value,
      onChange: this.onChange
    };

    // Finally, render it!
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

