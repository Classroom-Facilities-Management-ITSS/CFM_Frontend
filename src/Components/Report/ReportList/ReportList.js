import "./ReportList.css";

import React, { useState, useEffect } from "react";

import { Space, Table, message, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { getReportList, removeReport } from "../../../Constant/Report";

const ReportList = () => {
  const [onReload, setOnReload] = useState(0);

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
  const apiError = () => {
    messageApi.open({
      type: "error",
      content: "Something went wrong!",
    });
  };
  const success = () => {
    messageApi.open({
      type: "success",
      content: "This report has been checked and removed!",
    });
  };

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const [reportList, setReportList] = useState(null);

  useEffect(() => {
    async function getData() {
      let list = await getReportList();
      setReportList(list);
    }
    getData();
  }, [onReload])

  const reportAttribute = [
    {
      title: "From",
      key: "owner",
      render: (record) => <div>{record.account.user.fullName ? record.account.user.fullName : "No name"}</div>,
    },
    {
      title: "Location",
      key: "location",
      render: (record) => <div>{record.classroom.address}</div>,
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
        <> {user.account.role == "ADMIN" ?
          <Space size={48}>
            <a onClick={() => onAccept(record, "accept")}>Accept</a>
            <a onClick={() => onDecline(record, "decline")}>Decline</a>
          </Space> :
          <a onClick={() => onAccept(record, "accept")}>Delete</a>}
        </>
      ),
    },
  ];

  const onAccept = (values, permission) => {
    let report = values;
    report.finish = 1;
    report.note += `\nThe admin has ${permission} this report!`;

    removeReport(values.id).then((res) => {
      if (res.status >= 200 && res.status < 300) {
        success();
        setOnReload(onReload + 1);
      } else {
        apiError();
      }
    });
  };

  const onDecline = (values, permission) => {
    let report = values;
    report.finish = 1;
    report.note += `\nThe admin has ${permission} this report!`;

    removeReport(values.id).then((res) => {
      if (res.status >= 200 && res.status < 300) {
        success();
        setOnReload(onReload + 1);
      } else {
        apiError();
      }
    });
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
