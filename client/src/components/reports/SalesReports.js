import React from "react";

class SalesReports extends React.Component {
  state = {
    controller: new AbortController(),
    fetching: false
  };

  componentDidMount() {
    const { context } = this.props;
    const { controller } = this.state;
    if (context.user) {
      this.setState({ fetching: true }, () => {
        fetch("http://localhost:9000/sales-reports", {
          signal: controller.signal,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: null })
        })
          .then(response => response.json())
          .then(response => {
            this.setState({
              fetching: false
            });
          })
          .catch(error =>
            console.log("Unable to connect to API sales-reports.", error)
          );
      });
    }
  }

  componentWillUnmount() {
    this.state.controller.abort();
  }

  render() {
    const { fetching } = this.state;
    return <p>Hello</p>;
  }
}

export default SalesReports;
