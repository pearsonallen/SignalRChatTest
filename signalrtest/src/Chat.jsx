import React, { Component } from 'react';
import { LogLevel, HubConnectionBuilder } from '@aspnet/signalr';

class Chat extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      nick: '',
      message: '',
      messages: [],
      hubConnection: null,
    };
  }

  // connection = async () => { 
  //   return new HubConnectionBuilder()
  //   .withUrl("https://cpsignalrchattest.service.signalr.net/test")
  //   .configureLogging(LogLevel.Information)
  //   .build();
  // }

  // start = async () => {
  //   try {
  //     let c = this.connection;
  //     await c.start;
  //     console.log("SignalR Connected.");
  //     debugger;
  //     this.setState({
  //       hubConnection: c
  //     });
  //   } catch (err) {
  //       console.log(err);
  //       setTimeout(this.start, 5000);
  //   }
  // }

  componentDidMount = () => {
    const nick = "chrisA";//window.prompt('Your name:', 'John');
    
    // this.start();


    const hubConnection = new HubConnectionBuilder()
    .withUrl("https://cpsignalrchattest.service.signalr.net/test")
    .configureLogging(LogLevel.Trace)
    .build();

    this.setState({ hubConnection, nick }, () => {
      this.state.hubConnection
        .start()
        .then(() => {
          
          console.log('Connection started!')
        })
        .catch(err => console.log('Error while establishing connection :('));

      this.state.hubConnection.on('sendToAll', (nick, receivedMessage) => {
        const text = `${nick}: ${receivedMessage}`;
        const messages = this.state.messages.concat([text]);
        this.setState({ messages });
      });
    });
  }

  sendMessage = async () => {
    debugger;
    await this.state.hubConnection
      .invoke('sendToAll', this.state.nick, this.state.message)
      .catch(err => console.error(err));
  
      this.setState({message: ''});      
  };
  
  render() {
    return (
      <div>
        <br />
        <input
          type="text"
          value={this.state.message}
          onChange={e => this.setState({ message: e.target.value })}
        />
  
        <button onClick={this.sendMessage}>Send</button>
  
        <div>
          {this.state.messages.map((message, index) => (
            <span style={{display: 'block'}} key={index}> {message} </span>
          ))}
        </div>
      </div>
    );
  }
}

export default Chat;