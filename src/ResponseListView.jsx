import React, {useState, useEffect} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {Crown, CheckCircle, DotsHorizontalCircle} from "mdi-material-ui"


class ResponseListView extends React.Component {

  render() {
    console.log(this.props.isRevealed);
    console.log(this.props.uName);
    console.log(this.props.responseList);
    
    return (
      <div className={"cardDivWrapper"}>
        <div className={'cardGroupDiv'}>
            {this.props.responseList.map((response => {
              let isOwnerCard = response.user === this.props.owner
              let shouldReveal = this.props.isRevealed

              if (isOwnerCard) {
                shouldReveal = this.props.isRevealed && this.props.ownerReveal
              }

              return (
                <div className={"cardWrapper"}>
                  <Card className={"playerCard"}>
                    <CardContent>
                      <div style={{display: "flex", flexDirection: "row"}}>
                      <Typography
                        variant={"subtitle2"}
                        className={"userName"}
                      >
                        {response.user}
                      </Typography>

                      {response.response === "" ? (
                        <DotsHorizontalCircle style={{color: "#919295", marginLeft: "auto"}}/>
                      ) : (
                        <CheckCircle style={{color: "#0081A7", marginLeft: "auto"}}/>
                      )
                      }
                        {response.user === this.props.owner &&
                        <Crown style={{color: "#FFE1A8", marginLeft: "5px"}}/>
                        }
                      </div>
                      {shouldReveal &&
                        <Typography variant={"body1"} className={"cardResponse"}>{response.response}</Typography>
                      }
                    </CardContent>
                  </Card>
                </div>
              )
            }))}
        </div>
      </div>
    )
  }
}

export default ResponseListView;
