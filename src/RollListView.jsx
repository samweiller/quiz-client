import React, {useState, useEffect} from 'react';
import List from '@material-ui/core/List';
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Icon from "@material-ui/core/Icon";
import FolderIcon from "@material-ui/icons/Folder"
import {DiceD4, DiceD6, DiceD8, DiceD10, DiceD20} from "mdi-material-ui"

class RollListView extends React.Component {

  getIconForType = (type) => {
    return (
      {
        d4: <DiceD4/>,
        d6: <DiceD6/>,
        d8: <DiceD8/>,
        d10: <DiceD10/>,
        d20: <DiceD20/>
      }[type]
    )
  }


  render() {
    return (
      <div className={'rollListDiv'}>
        <List>
          {this.props.rollList.slice(0).reverse().map((roll => {
            return (
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <Icon color={'primary'}>{this.getIconForType(roll.type)}</Icon>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={roll.result}
                  secondary={roll.user + ', ' + roll.type}
                />
              </ListItem>
            )
          }))}
        </List>
      </div>
    )
  }
}

export default RollListView;
