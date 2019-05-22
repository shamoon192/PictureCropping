import * as React from 'react';
import { Appbar } from 'react-native-paper';

export default class MyComponent extends React.Component {
  _goBack = () => console.log('Went back');

  _onDelete = () => console.log('Searching');



  render() {
    return (
      <Appbar.Header>
        <Appbar.BackAction
          onPress={this._goBack}
        />
        <Appbar.Content
          title="Mangel 1"
        />
        <Appbar.Action icon="search" onPress={this._onDelete} />

      </Appbar.Header>
    );
  }
}
