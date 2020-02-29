import React from "react";
import Pagination from "react-bootstrap/Pagination";

class AppPagination extends React.Component {
  render() {
    const { pageCount, activePage, onPageChange } = this.props;
    return (
      <Pagination>
        <Pagination.First onClick={() => onPageChange(1)} />
        <Pagination.Prev
          onClick={() => {
            if (activePage > 1) {
              onPageChange(activePage - 1);
            }
          }}
        />
        {Array(pageCount)
          .fill()
          .map((_, i) => (
            <Pagination.Item
              key={i + 1}
              active={activePage === i + 1}
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
        <Pagination.Next
          onClick={() => {
            if (activePage < pageCount) {
              onPageChange(activePage + 1);
            }
          }}
        />
        <Pagination.Last onClick={() => onPageChange(pageCount)} />
      </Pagination>
    );
  }
}

export default AppPagination;
