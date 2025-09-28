// src/pages/Interviewer.tsx
import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { Table } from "antd";

const Interviewer: React.FC = () => {
  const candidates = useSelector(
    (state: RootState) => state.interview.candidates
  );

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Score", dataIndex: "score", key: "score" },
    { title: "Summary", dataIndex: "summary", key: "summary" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Candidate Dashboard</h2>
      <Table
        rowKey="id"
        dataSource={candidates}
        columns={columns}
        expandable={{
          expandedRowRender: (record: any) => (
            <div>
              <h4>Answers:</h4>
              <ol>
                {record.answers.map((ans: string, i: number) => (
                  <li key={i}>{ans || "⏳ No answer submitted"}</li>
                ))}
              </ol>
            </div>
          ),
        }}
      />
    </div>
  );
};

export default Interviewer;
