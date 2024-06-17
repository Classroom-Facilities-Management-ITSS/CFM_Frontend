import "./ScheduleList.css";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Form,
  Modal,
  Input,
  Table,
  Space,
  Select,
  Button,
  message,
} from "antd";
import { EditOutlined, DownloadOutlined } from "@ant-design/icons";

import {
  getScheduleByEmail,
  getScheduleList,
  removeSchedule,
  renewSchedule,
} from "../../Constant/Schedule";
import { getClassList } from "../../Constant/Classrooms";

const ScheduleList = () => {
  const nav = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: "success",
      content: "Edit finish!",
    });
  };
  const apiError = () => {
    messageApi.open({
      type: "error",
      content: "Edit Fail, please try again!",
    });
  };
  const deleteFinish = () => {
    messageApi.open({
      type: "success",
      content: "Done!",
    });
  };
  const deleteFail = () => {
    messageApi.open({
      type: "error",
      content: "Error occur!",
    });
  };

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [schedule, setSchedule] = useState(null);
  const [classes, setClasses] = useState(null);

  useEffect(() => {
    async function getSchedule() {
      let list = [];
      let options = [];
      let classList = [];

      if (user.account.role == "ADMIN") {
        list = await getScheduleList();
        classList = await getClassList();

        classList.map((elem) => {
          let option = {
            value: elem.id,
            label: elem.address,
          };

          options.push(option);
        });

        setClasses(options);
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
    user.account.role == "ADMIN"
      ? {
          title: "Action",
          key: "action",
          render: (_, record) => (
            <Space size="middle">
              <a
                onClick={() => {
                  onEdit(record.id);
                }}
              >
                Edit
              </a>
              <a
                onClick={() => {
                  handleDelete(record.id);
                }}
              >
                Delete
              </a>
            </Space>
          ),
        }
      : {
          title: "Note",
          dataIndex: "note",
          key: "note",
        },
  ];

  function handleDelete(id) {
    removeSchedule(id).then((res) => {
      if (res.status >= 200 && res.status < 300) {
        deleteFinish();
        nav("/schedule");
      } else {
        deleteFail();
      }
    });
  }

  const [isEdit, setIsEdit] = useState(false);
  const [scheduleOnEdit, setScheduleOnEdit] = useState(false);
  function onEdit(id) {
    setScheduleOnEdit(schedule.filter((elem) => elem.id == id)[0]);
    setIsEdit(true);
  }
  function handleCancel() {
    setIsEdit(false);
  }
  function onFinishEdit(values) {
    let newScheduleInfo = {
      id: scheduleOnEdit.id,
      subject: values.subject,
      classroomId: values.address,      
      countStudent: values.countStudent,
      startTime: values.startTime,
      endTime: values.endTime,
    };

    renewSchedule(newScheduleInfo).then((res) => {
      if (res.status >= 200 && res.status < 300) {
        success();
        setIsEdit(false);
      } else {
        apiError();
      }
    });
  }

  return (
    <Space direction="vertical" size={50}>
      <Modal
        title="Edit Schedule"
        open={isEdit}
        onCancel={handleCancel}
        footer={null}
      >
        <Form name="editSchedule" onFinish={onFinishEdit}>
          <Form.Item
            style={{ marginTop: 25 }}
            name="subject"
            rules={[
              {
                required: true,
                message: "This section is require!",
              },
            ]}
          >
            <Input
              //prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="subject"
            />
          </Form.Item>

          <Form.Item
            style={{ marginTop: 25 }}
            name="address"
            rules={[
              {
                required: true,
                message: "This section is require!",
              },
            ]}
          >
            <Select placeholder="Address" options={classes}></Select>
          </Form.Item>

          <Form.Item
            name="countStudent"
            rules={[
              {
                required: true,
                message: "This section is require!",
              },
            ]}
          >
            <Input
              //prefix={<LockOutlined className="site-form-item-icon" />}
              //type="password"
              placeholder="Number of students"
            />
          </Form.Item>

          <Form.Item
            name="startTime"
            rules={[
              {
                required: true,
                message: "This section is require!",
              },
            ]}
          >
            <Input
              //prefix={<LockOutlined className="site-form-item-icon" />}
              //type="password"
              placeholder="startTime"
            />
          </Form.Item>

          <Form.Item
            name="endTime"
            rules={[
              {
                required: true,
                message: "This section is require!",
              },
            ]}
          >
            <Input
              //prefix={<LockOutlined className="site-form-item-icon" />}
              //type="password"
              placeholder="endTime"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="new-user-form-button"
            >
              Confirm
            </Button>
          </Form.Item>
        </Form>
      </Modal>

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
