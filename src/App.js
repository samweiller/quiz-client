import React, {useState, useEffect} from 'react';
import io from "socket.io-client";
import './App.css'
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import ResponseListView from "./ResponseListView";

// const ENDPOINT = "http://localhost:3000";
//  const ENDPOINT = "https://27c8e2ba.ngrok.io";
const ENDPOINT = "https://mighty-cliffs-22449.herokuapp.com";

function App() {
  // const [response, setResponse] = useState("");
  const [name, setName] = useState("Sam")
  const [modalOpen, setModalOpen] = useState(false)
  const [currentResponse, setCurrentResponse] = useState("")
  const [submittedResponse, setSubmittedResponse] = useState("")
  const [currentQuestion, setCurrentQuestion] = useState("Waiting to Start...")
  const [nextQuestion, setNextQuestion] = useState("")
  const [isLoggedIn, setLogin] = useState(false);
  const [numUsers, setNumUsers] = useState()
  const [userList, setUserList] = useState([]);
  const [responseList, setResponseList] = useState([])
  const [isRevealed, setReveal] = useState(false);
  const [isOwnerRevealed, setOwnerReveal] = useState(false);
  const [qOwner, setQOwner] = useState("")
  const socket = io(ENDPOINT,  {transports: ['websocket']});

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleResponseChange = (event) => {
    setCurrentResponse(event.target.value);
  };

  const handleNextQuestionChange = (event) => {
    setNextQuestion(event.target.value);
  };

  const handleRevealSwitch = (event) => {
    setReveal(event.target.checked);
    doReveal(event.target.checked)
  };

  const handleOwnerRevealSwitch = (event) => {
    setOwnerReveal(event.target.checked);
    doOwnerReveal(event.target.checked)
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  }

  const handleModalClose = () => {
    setModalOpen(false);
  }

  const handleQOwnerChange = (event) => {
    setQOwner(event.target.value)

  }

  useEffect(() => {
    // Note: For some reason, this does not fire for the FIRST user. On the second
    // user's login, this triggers.
    socket.on('login', (data) => {
      console.log('on login');
      console.log(data.userList);
      setNumUsers(data.numUsers)
      setUserList(data.userList)
      setResponseList(data.serverResponses)
    })

    socket.on('user left', (data) => {
      console.log('on logout');
      setNumUsers(data.numUsers)
      setUserList(data.userList)
    })

    socket.on('response result', (data) => {
      console.log('response incoming');
      setResponseList(data.serverResponses)
      console.log(responseList)
    })

    socket.on('reveal answers', (data) => {
      console.log('revealing answers');
      setReveal(data.isRevealed)
      // console.log(rollList);
    })

    socket.on('reveal owner', (data) => {
      console.log('revealing owner answer');
      setOwnerReveal(data.isOwnerRevealed)
      // console.log(rollList);
    })

    socket.on('new question', (data) => {
      console.log('new question received');
      setQOwner(data.owner)
      console.log(data.qContent);
      setCurrentQuestion(data.qContent)
      setResponseList(data.clearedResponses)
      setCurrentResponse("")
      setSubmittedResponse("")
      setReveal(false)
      setOwnerReveal(false)
    })

    socket.on('clear content', (data) => {
      console.log('new question received');
      setQOwner("")
      setResponseList(data.clearedResponses)
      setCurrentResponse("")
      setSubmittedResponse("")
      setReveal(false)
      setOwnerReveal(false)
    })

    // debug
    // doLogin("Sam")
    // doReveal(true)

  }, [])

  const doLogin = (username) => {
    console.log(username);
    socket.emit('add user', username)
    setLogin(true)
    doResponse("")
    console.log('Login from ' + username);
  }

  const doLogout = (username) => {
    socket.emit('user leave', username);
    setLogin(false)
    setName("")
    console.log('Log out from ' + username);
  }

  const doResponse = (response) => {
    socket.emit('response', {response: response, user: name})
    setSubmittedResponse(response)
    console.log('sending response request');
  }

  const doReveal = (boolValue) => {
    socket.emit('reveal', boolValue)
    console.log('sending reveal request');
  }

  const doOwnerReveal = (boolValue) => {
    socket.emit('owner reveal', boolValue)
    console.log('sending reveal request');
  }

  const clearResponses = () => {
    socket.emit('clear responses')
    setCurrentResponse("")
    console.log('sending reveal request');
  }

  const sendQuestion = (qContent, owner) => {
    socket.emit('send question', {qContent: qContent, owner: owner})
    // clearResponses()
    // setReveal(false)
    setNextQuestion("")
    // setOwnerReveal(false)
    console.log('sending new question');
  }

  return (
    <div className="App">
          {!isLoggedIn &&
          <header className="App-header">
            <div className={'headerLeft'}>
          <React.Fragment>
            <TextField
              label={"Nickname"}
              value={name}
              onChange={handleNameChange}
              style={{paddingRight: '10px'}}
              InputLabelProps={{
                shrink: true,
              }}
              size={'small'}
            />
            <Button
              variant={"outlined"}
              color={"primary"}
              onClick={() => {
                doLogin(name)
              }}
              size={'small'}
            >
              Join
            </Button>
          </React.Fragment>
            </div>

            <div className={'headerRight'}>{numUsers} users currently logged in</div>
          </header>
          }

          {isLoggedIn &&
          <AppBar position={"static"}>
            <Toolbar>
            <Typography variant={"h6"}>Joined as {name}.</Typography>
            <Button
              variant={"outlined"}
              color={"white"}
              style={{
                marginLeft: "auto",
                color: "white"
              }}
              onClick={() => {
                doLogout(name)
              }}>
              Logout
            </Button>
            </Toolbar>
          </AppBar>
          }

      {/* ADMIN ROW */}
      {isLoggedIn &&
      <div>
          {name === "Sam" &&
        <div className={'adminRow'}>
            <Button
              variant={"outlined"}
              size={'small'}
              onClick={() => {
                handleModalOpen()
              }}>
              New Question
            </Button>
          <Dialog open={modalOpen} onClose={handleModalClose} fullWidth>
            <DialogTitle id="form-dialog-title">New Question</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                InputLabelProps={{
                  shrink: true,
                }}
                value={nextQuestion}
                onChange={handleNextQuestionChange}
                id="question"
                label="Question"
                style={{paddingBottom: "10px"}}
                fullWidth
              />
              <InputLabel shrink={true}>Question Owner</InputLabel>
              <RadioGroup name={"owner"} value={qOwner} onChange={handleQOwnerChange}>
                {userList.map((u) => {
                  return <FormControlLabel value={u} control={<Radio />} label={u} />
                })}
              </RadioGroup>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleModalClose} color="secondary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  sendQuestion(nextQuestion, qOwner)
                  handleModalClose()
                }}
                color="primary"
              >
                Send
              </Button>
            </DialogActions>
          </Dialog>
            <div className={"switchContainer"}>
              <Typography>Reveal Responses</Typography>
              <Switch
                checked={isRevealed}
                onChange={handleRevealSwitch}
                name="revealCheck"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            </div>
            <div className={"switchContainer"}>
              <Typography>Reveal Answer</Typography>
              <Switch
                checked={isOwnerRevealed}
                onChange={handleOwnerRevealSwitch}
                name="revealOwnerCheck"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            </div>
            <Button
              variant={"outlined"}
              size={'small'}
              onClick={() => {
                clearResponses()
              }}>
              Clear
            </Button>
        </div>
          }

        <Typography className={"questionText"} variant={"h3"}>
          {currentQuestion}
        </Typography>

        <div style={{display: "flex", flexDirection: "column", paddingBottom: "5px"}}>
          {(qOwner === name) &&
          <Typography variant={"body"}>
            This is your question!
          </Typography>
          }

          {(submittedResponse !== "") &&
          <Typography variant={"body"}>
            Your Response: {submittedResponse}
          </Typography>
          }
        </div>
        <form>
        <Toolbar>
          <TextField
            label={"Response"}
            value={currentResponse}
            onChange={handleResponseChange}
            style={{paddingRight: '10px', width: "60%"}}
            disabled={isRevealed}
            InputLabelProps={{
              shrink: true,
            }}
            size={'small'}
          />
          <Button
            type={"submit"}
            color={"primary"}
            variant={"outlined"}
            size={'small'}
            disabled={isRevealed}
            style={{marginLeft: "auto"}}
            onClick={(e) => {
              e.preventDefault()
              doResponse(currentResponse)
              setCurrentResponse("")
            }}
          >
            Send Answer
          </Button>
        </Toolbar>
        </form>
        {/*</div>*/}

        {/*{isRevealed &&*/}
        <ResponseListView
          responseList={responseList}
          isRevealed={isRevealed}
          ownerReveal={isOwnerRevealed}
          uName={name}
          owner={qOwner}
        />
        {/*}*/}
      </div>
      }
    </div>
  );
}

export default App;