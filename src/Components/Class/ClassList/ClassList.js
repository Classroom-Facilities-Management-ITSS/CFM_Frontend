import "./ClassList.css";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  Form,
  Modal,
  Input,
  Table,
  Space,
  Button,
  Select,
  message,
} from "antd";
import { EditOutlined, BankOutlined } from "@ant-design/icons";

import { getScheduleByEmail } from "../../../Constant/Schedule";
import { addNewClass, getClassList } from "../../../Constant/Classrooms";

const ClassTable = (props) => {
  const [classesData, setClassesData] = useState(null);

  useEffect(() => {
    async function getClassess() {
      let list = await getClassList();
      setClassesData(list);
    }

    if (props.schedule == undefined) {
      getClassess();
    } else {
      let classes = [];
      props.schedule.map((elem) => {
        let room = {
          id: elem.classroomId,
          address: elem.classroom.address,
          lastUsed: elem.classroom.lastUsed,
          status: elem.classroom.status,
          note: elem.classroom.note,
          facilityAmount: elem.classroom.facilityAmount,
        };
        classes = [...classes, room]
      });
      setClassesData(classes);
    }
  }, []);

  const listAttribute = [
    {
      title: "Classroom",
      dataIndex: "address",
      key: "address",
      render: (text, record) => (
        <Link to={`/detail/classroom/${record.id}`}>{text}</Link>
      ),
    },
    props.schedule
      ? {
          title: "Time",
          key: "time",
          render: (record) => <div>{record.time}</div>,
        }
      : {
          title: "Last Used",
          dataIndex: "lastUsed",
          key: "lastUsed",
        },
    {
      title: "Num of devices",
      dataIndex: "facilityAmount",
      key: "facilityAmount",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
  ];

  return (
    <Table
      scroll={{ y: props.scroll ? props.scroll : 600 }}
      columns={listAttribute}
      dataSource={classesData}
      pagination={{ pageSize: props.pageSize ? props.pageSize : 23 }}
    />
  );
};

const ClassList = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: "success",
      content: "Successfully add new class!",
    });
  };
  const forbidden = () => {
    messageApi.open({
      type: "error",
      content: "Only admin can add classroom!",
    });
  };
  const apiError = () => {
    messageApi.open({
      type: "error",
      content: "Something when wrong please try again later!",
    });
  };

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    async function getSchedule() {
      let schedule = await getScheduleByEmail(user.account.email);
      setSchedule(schedule);
    }
    getSchedule();
  }, []);

  const [isAddClass, setIsAddClass] = useState(false);
  const showAddClassModal = () => {
    if (user.account.role == "ADMIN") {
      setIsAddClass(true);
    } else {
      forbidden();
    }
  };
  const handleCancel = () => {
    setIsAddClass(false);
  };
  const onFinishAdd = (values) => {
    let now = new Date();
    now = now.toISOString();

    let newClass = {
      address: values.address,
      status: values.status,
      lastUsed: now,
      maxSize: 0,
      note: "",
    };
    
    setIsAddClass(false);
    addNewClass(newClass).then((res) => {
      if (res.status == 200) {
        success();
      } else {
        apiError();
      }
    });
  };

  return (
    <Space direction="vertical" size={50}>
      {contextHolder}
      <Space id="header-container">
        <div class="text-2xl font-bold">Classrooms Information</div>
        <Button style={{ border: "none" }} onClick={showAddClassModal}>
          <EditOutlined style={{ fontSize: 20 }} />
        </Button>
      </Space>

      <div class="px-10">
        <Modal
          title="New Classroom"
          open={isAddClass}
          onCancel={handleCancel}
          footer={null}
        >
          <Form name="addNewClass" onFinish={onFinishAdd}>
            <Form.Item
              style={{ marginTop: 25 }}
              name="address"
              rules={[
                {
                  required: true,
                  message: "Please input class's address!",
                },
              ]}
            >
              <Input
                prefix={<BankOutlined className="site-form-item-icon" />}
                placeholder="Address"
              />
            </Form.Item>

            <Form.Item
              name="status"
              rules={[
                {
                  required: true,
                  message: "Please input class's status!",
                },
              ]}
            >
              <Select
                placeholder="status"
                options={[
                  {
                    value: "open",
                    label: "Open",
                  },
                  {
                    value: "close",
                    label: "Close",
                  },
                  {
                    value: "fixing",
                    label: "Fixing",
                  },
                ]}
              ></Select>
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
        {user.account.role == "ADMIN" ? <ClassTable></ClassTable> : <ClassTable schedule={schedule}></ClassTable>}
      </div>
    </Space>
  );
};

export { ClassList as ClassList, ClassTable as ClassTable };
