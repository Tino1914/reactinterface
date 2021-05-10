

import '../css/App.css';
import AddAppointments from './AddAppointment';
import SearchAppointments from './SearchAppointments';
import ListAppointments from './ListAppointments';
import { Component } from 'react';
import { findIndex, without } from 'lodash';
import { each } from 'jquery';

class App extends Component {

constructor() {
  super();
  this.state = {
   
    myAppointments: [],
    formDisplay: false,
    orderBy: 'petName',
    orderDir: 'asc',
    queryText: '',
    lastIndex: 0
  }
  this.deleteAppointment = this.deleteAppointment.bind(this);
  this.toggleForm = this.toggleForm.bind(this);
  this.addAppointment = this.addAppointment.bind(this);
  this.changeOrder = this.changeOrder.bind(this);
  this.searchApts = this.searchApts.bind(this);
  this.updateInfo = this.updateInfo.bind(this);
}

toggleForm(){
  this.setState({
    formDisplay: !this.state.formDisplay
  })
}

changeOrder(order, dir) {
  this.setState({
    orderBy: order,
    orderDir: dir
  });
}

updateInfo(name, value, id) {
  let tempApts = this.state.myAppointments;
  let aptIndex = findIndex(this.state.myAppointments, {
    aptId: id
  });
  tempApts[aptIndex][name] = value;
  this.setState({
    myAppointments: tempApts
  });
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

searchApts(query) {
  this.setState({ queryText: query });
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
  
  let order;
    let filteredApts = this.state.myAppointments;
    if (this.state.orderDir === 'asc') {
      order = 1;
    } else {
      order = -1;
    }

 filteredApts = filteredApts.sort((a, b) => {
  if (
    a[this.state.orderBy].toLowerCase() <
    b[this.state.orderBy].toLowerCase()
  ) {
    return -1 * order;
  } else {
    return 1 * order;
  }
}).filter(eachItem => {
  return (
    eachItem['petName']
      .toLowerCase()
      .includes(this.state.queryText.toLowerCase()) ||
    eachItem['ownerName']
      .toLowerCase()
      .includes(this.state.queryText.toLowerCase()) ||
    eachItem['aptNotes']
      .toLowerCase()
      .includes(this.state.queryText.toLowerCase())
  );
});



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
                <SearchAppointments
                  orderBy={this.state.orderBy}
                  orderDir={this.state.orderDir}
                  changeOrder={this.changeOrder}
                  searchApts={this.searchApts}
                />
                <div>
                <h2>You can update each appointment item by clicking over it!</h2></div>
               <ListAppointments appointments={filteredApts}
               deleteAppointment={this.deleteAppointment}
               updateInfo={this.updateInfo}/>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
}

export default App;
