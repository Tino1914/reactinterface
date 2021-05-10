

import '../css/App.css';
import AddAppointments from './AddAppointment';
import SearchAppointments from './SearchAppointments';
import ListAppointments from './ListAppointments';
import { Component } from 'react';
import { result, without } from 'lodash';

class App extends Component {

constructor() {
  super();
  this.state = {
   
    myAppointments: [],
    formDisplay: false,
    lastIndex: 0
  }
  this.deleteAppointment = this.deleteAppointment.bind(this);
  this.toggleForm = this.toggleForm.bind(this);
  this.addAppointment = this.addAppointment.bind(this);
}

toggleForm(){
  this.setState({
    formDisplay: !this.state.formDisplay
  })
}

addAppointment(apt){
  let tempApts = this.state.myAppointments;
  apt.aptId = this.state.lastIndex;
  tempApts.unshift(apt);
  this.setState({
    myAppointments: tempApts,
    lastIndex: this.state.lastIndex +1
  })
}



deleteAppointment(appointment){
  let tempApts = this.state.myAppointments;
  tempApts = without(tempApts, appointment);

  this.setState({
    myAppointments: tempApts
  })
}

componentDidMount(){
  fetch('./data.json')
  .then(response => response.json())
  .then(result =>{
    const appointments = result.map(item => {
      item.aptId = this.state.lastIndex;
      this.setState({ lastIndex: this.state.lastIndex + 1});
      return item;
    })
    this.setState({
      myAppointments: appointments
    });

  });

  
}



render(){


  return (
    <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
            
                <AddAppointments 
                formDisplay={this.state.formDisplay}
                toggleForm={this.toggleForm}
                addAppointment= {this.addAppointment}/>
                <SearchAppointments />
               <ListAppointments appointments={this.state.myAppointments}
               deleteAppointment={this.deleteAppointment}/>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
}

export default App;
