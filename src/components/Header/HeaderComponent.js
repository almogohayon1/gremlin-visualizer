import React from 'react';
import { connect } from 'react-redux';
import { Button, TextField } from '@material-ui/core';
import axios from 'axios';
import { ACTIONS, QUERY_ENDPOINT, COMMON_GREMLIN_ERROR } from '../../constants';
import { onFetchQuery } from '../../logics/actionHelper';

class Header extends React.Component {
  clearGraph() {
    this.props.dispatch({ type: ACTIONS.CLEAR_GRAPH });
    this.props.dispatch({ type: ACTIONS.CLEAR_QUERY_HISTORY });
  }

  sendQuery() {
    this.props.dispatch({ type: ACTIONS.SET_ERROR, payload: null });
    axios.post(
      QUERY_ENDPOINT(),
      { host: this.props.host, port: this.props.port, query: this.props.query, nodeLimit: this.props.nodeLimit },
      { headers: { 'Content-Type': 'application/json' } }
    ).then((response) => {
      onFetchQuery(response, this.props.query, this.props.nodeLabels, this.props.dispatch);
    }).catch((error) => {
      this.props.dispatch({ type: ACTIONS.SET_ERROR, payload: COMMON_GREMLIN_ERROR });
    });
  }

  onHostChanged(host) {
    this.props.dispatch({ type: ACTIONS.SET_HOST, payload: host });
  }

  onPortChanged(port) {
    this.props.dispatch({ type: ACTIONS.SET_PORT, payload: port });
  }

  onQueryChanged(query) {
    this.props.dispatch({ type: ACTIONS.SET_QUERY, payload: query });
  }

  render() {
    return (
      <div className={'header'}>
        <form noValidate autoComplete="off">
          <div id="connectionDetails" style={{ maxWidth: '600px', width: '100%', display: 'flex' }}>
            <TextField value={this.props.host} onChange={(event => this.onHostChanged(event.target.value))} id="standard-basic" label="host" style={{ width: '100%', marginRight: '16px' }}/>
            <TextField value={this.props.port} onChange={(event => this.onPortChanged(event.target.value))} id="standard-basic" label="port" style={{ width: '100px' }} />
          </div>
          <div style={{ width: '100%', marginBottom: '16px' }}>
            <TextField value={this.props.query} onChange={(event => this.onQueryChanged(event.target.value))} id="standard-basic" label="gremlin query" style={{ width: '100%' }} />
          </div>
          <Button variant="contained" color="primary" onClick={this.sendQuery.bind(this)} style={{ width: '150px', marginRight: '8px' }} >Execute</Button>
          <Button variant="outlined" color="secondary" onClick={this.clearGraph.bind(this)} style={{ width: '150px' }} >Clear Graph</Button>
        </form>

        <br />
        <div style={{ color: 'red' }}>{this.props.error}</div>
      </div>

    );
  }
}

export const HeaderComponent = connect((state) => {
  return {
    host: state.gremlin.host,
    port: state.gremlin.port,
    query: state.gremlin.query,
    error: state.gremlin.error,
    nodes: state.graph.nodes,
    edges: state.graph.edges,
    nodeLabels: state.options.nodeLabels,
    nodeLimit: state.options.nodeLimit
  };
})(Header);