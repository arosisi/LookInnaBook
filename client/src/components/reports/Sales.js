import React from "react";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  LabelList,
  Tooltip
} from "recharts";

import { getCurrencyString } from "../../helpers";

class Sales extends React.Component {
  state = { controller: new AbortController(), fetching: false, data: [] };

  componentDidMount() {
    const { type } = this.props;
    const { controller } = this.state;
    this.setState({ fetching: true }, () => {
      fetch("http://localhost:9000/sales-reports", {
        signal: controller.signal,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type })
      })
        .then(response => response.json())
        .then(response => {
          if (response.success) {
            this.setState({
              fetching: false,
              data: Object.entries(response.report)
                .map(([name, sales]) => ({
                  name,
                  sales
                }))
                .sort(({ sales: sales1 }, { sales: sales2 }) => sales2 - sales1)
            });
          } else {
            this.setState({
              processing: false
            });
            console.log(response.errMessage);
          }
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
      <div
        style={{
          width: "90%",
          height: data.length * 50,
          margin: "40px 0 40px 10px"
        }}
      >
        <ResponsiveContainer>
          <ComposedChart layout='vertical' data={data}>
            <CartesianGrid stroke='#f5f5f5' />
            <XAxis type='number' orientation='top' />
            <YAxis
              dataKey='name'
              type='category'
              width={200}
              interval={0}
              padding={{ top: 10, bottom: 10 }}
            />
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
                    {payload[0].payload.name}:{" "}
                    {getCurrencyString(payload[0].payload.sales)}
                  </div>
                ) : null
              }
            />
            <Bar dataKey='sales' barSize={20} fill='#82ca9d'>
              <LabelList
                content={({ x, y, width, value }) => {
                  return (
                    <text x={x + width + 10} y={y + 15}>
                      {getCurrencyString(value)}
                    </text>
                  );
                }}
              />
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default Sales;
