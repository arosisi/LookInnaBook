import React from "react";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

import { getCurrencyString } from "../../helpers";

const COLORS = ["#8884d8", "#82ca9d"];

class Balance extends React.Component {
  state = { controller: new AbortController(), fetching: false, data: [] };

  componentDidMount() {
    const { controller } = this.state;
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
            fetching: false,
            data: [
              { name: "Expenditures", value: response.expenditures },
              { name: "Sales", value: response.sales }
            ]
          });
        })
        .catch(error =>
          console.log("Unable to connect to API sales-reports.", error)
        );
    });
  }

  componentWillUnmount() {
    this.state.controller.abort();
  }

  render() {
    const { fetching, data } = this.state;
    return fetching ? (
      <Row style={{ justifyContent: "center" }}>
        <Spinner animation='border' variant='primary' />
      </Row>
    ) : (
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              dataKey='value'
              data={data}
              cx='50%'
              cy='50%'
              label={({ x, y, payload }) => (
                <text x={x} y={y}>
                  {getCurrencyString(payload.value)}
                </text>
              )}
              labelLine={false}
              innerRadius={40}
              outerRadius={80}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) =>
                active ? (
                  <div
                    style={{
                      display: "block",
                      padding: 10,
                      borderRadius: 5,
                      border: "1px solid #dcdcdc",
                      background: "white"
                    }}
                  >
                    {payload[0].name}:<br />
                    {getCurrencyString(payload[0].value)}
                  </div>
                ) : null
              }
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default Balance;
