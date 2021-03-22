import React from 'react'
import Main from '../template/main'

import axios from 'axios'

const headerProps = {
    icon: 'users',
    title: ' usuários',
    subtitle: 'Cadastro de usuário'
}

const baseUrl = 'http://localhost:8080/v1/users'
const initState= {
    user: { name:'', email:'', password:''},
    list: []
}

export default class UserApi extends React.Component{

    state = { ...initState }

    /**Chamada quando o elemento for exibido na tela */
    componentWillMount() {
        axios.get(baseUrl,{           
            crossdomain: true
        })
        .then(resp => {
            this.setState({ list: resp.data })
        })        
    }


    
    clear() {
        this.setState({ user: initState.user })
    }
    save() {
        const user = this.state.user        
        const method = user.id ? 'put' : 'post'
        const url = user.id ? `${baseUrl}/${user.id}` : baseUrl
        var config = {
            headers: {crossdomain: true}
        };
        axios[method](url,user,config)
        .then(resp => {
            const list = this.getUpdatedList(resp.data)
            this.setState({ user: initState.user, list })  
            console.log(resp.data)         
        })
        .catch(error => {
            console.log(error)
        })

    }
    getUpdatedList(user){       
        const list = this.state.list.filter(u => u.id !== user.id) 
        list.unshift(user) 
        return list
    }

    updatefield(event) {
        const user = { ...this.state.user }
        user[event.target.name] = event.target.value 
        this.setState({ user })
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
                                value={this.state.user.name}
                                onChange={e => this.updatefield(e)}
                                placeholder="Digite o nome"
                                />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">E-mail</label>
                            <input type="email" className="form-control" 
                                name="email" 
                                value={this.state.user.email}
                                onChange={e => this.updatefield(e)}
                                placeholder="Digite o email"
                                />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Senha</label>
                            <input type="password" className="form-control" 
                                name="password" 
                                value={this.state.user.password}
                                onChange={e => this.updatefield(e)}
                                placeholder="Digite sua senha"
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

    remove(user){
        axios.delete(`${baseUrl}/${user.id}`)
        .then(resp => {
            const list = this.state.list.filter(u => u !== user)
            this.setState({ list })
        })
    }

    rendertable(){
        return(
            <table className="table mt-4">
               <thead>
                    <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Apagar Usuario</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderows()}
                </tbody>            
            </table>
        );
    }
    renderows(){
        
        return this.state.list.map((user,index) => {
            return (                
                <tr key={index}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>                        
                        <button className="btn btn-danger btn-group-toggle"
                        onClick={() => this.remove(user)}>
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