import "./ScheduleList.css";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Table, Space, Button } from "antd";
import { EditOutlined, DownloadOutlined } from "@ant-design/icons";

import { getScheduleByEmail, getScheduleList } from "../../Constant/Schedule";

const ScheduleList = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    async function getSchedule() {
      let list = [];

      if (user.account.role == "ADMIN") {
        list = await getScheduleList();
      } else {
        list = await getScheduleByEmail(user.account.email);
      }

      let classes = [];
      list.map((elem) => {
        let room = {
          id: elem.id,
          subject: elem.subject,
          endTime: elem.endTime,
          startTime: elem.startTime,
          note: elem.classroom.note,
          classId: elem.classroom.id,
          address: elem.classroom.address,
          countStudent: elem.countStudent,
        };

        classes = [...classes, room];
      });

      setSchedule(classes);
    }
    getSchedule();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(schedule);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Schedule");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileName = "schedule.xlsx";
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, fileName);
  };

  const listAttribute = [
    {
      title: "Classroom",
      dataIndex: "address",
      key: "address",
      render: (text, record) => (
        <Link to={`/detail/classroom/${record.classId}`}>{text}</Link>
      ),
    },
    {
      title: "Time",
      key: "time",
      render: (record) => (
        <>
          <div>{record.startTime.split("T")[0]}</div>
          <div>From: {record.startTime.split("T")[1]}</div>
          <div>To: {record.endTime.split("T")[1]}</div>
        </>
      ),
      sorter: (a, b) => new Date(a.startTime) - new Date(b.startTime),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Num of students",
      dataIndex: "countStudent",
      key: "countStudent",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
  ];

  return (
    <Space direction="vertical" size={50}>
      <Space id="header-container">
        <div class="text-2xl font-bold">Schedule Information</div>

        <Button style={{ border: "none" }}>
          <EditOutlined style={{ fontSize: 20 }} />
        </Button>

        <Button
          type="default"
          icon={<DownloadOutlined />}
          onClick={exportToExcel}
          style={{
            color: "#000",
            fontWeight: "bold",
            borderRadius: "5px",
            backgroundColor: "#f0f0f0",
          }}
        >
          Export to Excel
        </Button>
      </Space>

      <div class="px-10">
        {schedule ? (
          <Table
            scroll={{ y: 600 }}
            dataSource={schedule}
            columns={listAttribute}
            pagination={{ pageSize: 23 }}
          />
        ) : (
          <></>
        )}
      </div>
    </Space>
  );
};

export default ScheduleList;
