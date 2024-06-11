import "./ReportList.css";

import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Space, Table, message, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

import usersData from "../../../Constant/initialData/user.json";
import reportData from "../../../Constant/initialData/report.json";
import classesData from "../../../Constant/initialData/classroom.json";

const ReportList = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const accept = () => {
    messageApi.open({
      type: "success",
      content: "Report accepted!",
    });
  };
  const decline = () => {
    messageApi.open({
      type: "error",
      content: "Report has been declined!",
    });
  };

  let reportList = [];
  reportData.map((report) => {
    let owner = usersData.filter((user) => user.accountID == report.userID)[0];
    report.owner = owner.lastName;

    let location = classesData.filter((room) => room.id == report.classID)[0];
    report.location = location.address;

    reportList.push(report);
  });

  const reportAttribute = [
    {
      title: "From",
      key: "owner",
      render: (record) => <div>{record.owner}</div>,
    },
    {
      title: "Location",
      key: "location",
      render: (record) => <div>{record.location}</div>,
    },
    {
      title: "Note",
      key: "note",
      render: (record) => <div>{record.note}</div>,
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Space size={48}>
          <a onClick={() => onAccept(record, "accept")}>Accept</a>
          <a onClick={() => onDecline(record, "decline")}>Decline</a>
        </Space>
      ),
    },
  ];

  const onAccept = (values, permission) => {
    let report = values;
    report.finish = 1;
    report.note += `\nThe admin has ${permission} this report!`;

    accept();
    //post api to update report.
  };

  const onDecline = (values, permission) => {
    let report = values;
    report.finish = 1;
    report.note += `\nThe admin has ${permission} this report!`;

    decline();
    //post api to update report.
  };

  return (
    <Space direction="vertical" size={50}>
      {contextHolder}
      <Space id="header-container">
        <div class="text-2xl font-bold">Report List</div>
        <Button style={{ border: "none" }}>
          <EditOutlined style={{ fontSize: 20 }} />
        </Button>
      </Space>

      <div class="px-10">
        <Table
          scroll={{ y: 700 }}
          dataSource={reportList}
          columns={reportAttribute}
          pagination={{ pageSize: 20 }}
        ></Table>
      </div>
    </Space>
  );
};

export default ReportList;
