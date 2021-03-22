import React from 'react'
import Main from '../template/main'

import axios from 'axios'

const headerProps = {
    icon: 'money',
    title: ' dívidas',
    subtitle: 'Cadastro de dividas'
}

const baseUrl = 'http://localhost:8080/v1/debts'
const initState= {
    debt: { name:'', description:'', date:'', amount:''},
    list: []
}

export default class DebtApi extends React.Component{

    state = { ...initState }

   
    componentWillMount() {
        axios.get(baseUrl,{           
            crossdomain: true
        })
        .then(resp => {
            this.setState({ list: resp.data })
        })        
    }


   
    clear() {
        this.setState({ debt: initState.debt })
    }
    save() {
        const debt = this.state.debt        
        const method = debt.id ? 'put' : 'post'
        const url = debt.id ? `${baseUrl}/${debt.id}` : baseUrl
        var config = {
            headers: {crossdomain: true}
        };
        axios[method](url,debt,config)
        .then(resp => {
            const list = this.getUpdatedList(resp.data)
            this.setState({ debt: initState.debt, list })  
            console.log(resp.data)         
        })
        .catch(error => {
            console.log(error)
        })

    }
    getUpdatedList(debt){       
        const list = this.state.list.filter(u => u.id !== debt.id) 
        list.unshift(debt) 
        return list
    }

    updatefield(event) {
        const debt = { ...this.state.debt }
        debt[event.target.name] = event.target.value 
        this.setState({ debt })
    }
    renderForm(){
      
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label htmlFor="name">Nome</label>
                            <input type="text" className="form-control" 
                                name="name" 
                                value={this.state.debt.name}
                                onChange={e => this.updatefield(e)}
                                placeholder="Digite o nome do cliente"
                                />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Motivo</label>
                            <input type="text" className="form-control" 
                                name="description" 
                                value={this.state.debt.description}
                                onChange={e => this.updatefield(e)}
                                placeholder="Digite o motivo da divida"
                                />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Data</label>
                            <input type="text" className="form-control" 
                                name="date" 
                                value={this.state.debt.date}
                                onChange={e => this.updatefield(e)}
                                placeholder="Digite a data"
                                />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Valor</label>
                            <input type="number" className="form-control" 
                                name="amount" 
                                value={this.state.debt.amount}
                                onChange={e => this.updatefield(e)}
                                placeholder="Digite o valor da divida"
                                />
                        </div>
                    </div>
                </div>

                <hr />

                <div className="row">
                    <div className="col-12 d-flex justify-content end">
                        <button className="btn btn-primary"
                        onClick={e => this.save(e)}>Salvar</button>
                        <button className="btn btn-secondary ml-2"
                        onClick={e => this.save(e)}>Cancelar</button>
                    </div>
                </div>

            </div>
        );
    }


   
    load(debt){
        this.setState({ debt })
    }
    remove(debt){
        axios.delete(`${baseUrl}/${debt.id}`)
        .then(resp => {
            const list = this.state.list.filter(u => u !== debt)
            this.setState({ list })
        })
    }
   
    rendertable(){
        return(
            <table className="table mt-4">
               <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Motivo</th>
                        <th>Data</th>
                        <th>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderows()}
                </tbody>            
            </table>
        );
    }
    renderows(){
       
        return this.state.list.map((debt,index) => {
            return (                
                <tr key={index}>
                    <td>{debt.name}</td>
                    <td>{debt.description}</td>
                    <td>{debt.date}</td>
                    <td>R$ {debt.amount}</td>
                    <td>
                        <button className="btn btn-warning mr-2"
                        onClick={() => this.load(debt)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger"
                        onClick={() => this.remove(debt)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            );
        })
    }

    render(){        
        return(            
            <Main {...headerProps}>
                
                {this.renderForm()}
                {this.rendertable()}

            </Main>
        );
    }
}