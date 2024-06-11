import "./ClassList.css";

import React from "react";
import { useState } from "react";
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

import data from "../../../Constant/initialData/classroom.json";

const ClassTable = (props) => {
  const classesData = [];
  if (props.schedule == undefined) {
    data
      .filter((classroom) => classroom.id != 0)
      .map((classroom) => {
        classesData.push(classroom);
      });
  } else {
    props.schedule.map((id) => {
      data
        .filter((classroom) => classroom.id == id.classroomId)
        .map((classroom) => {
          classroom.time = id.time;
          classesData.push(classroom);
        });
    });
  }

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

  const [isAddClass, setIsAddClass] = useState(false);
  const showAddClassModal = () => {
    setIsAddClass(true);
  };
  const handleCancel = () => {
    setIsAddClass(false);
  };
  const onFinishAdd = (values) => {
    let newClass = {
      address: values.address,
      status: values.status,
      note: values.note,
    };

    success();
    console.log(newClass);
    setIsAddClass(false);
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
        <ClassTable></ClassTable>
      </div>
    </Space>
  );
};

export { ClassList as ClassList, ClassTable as ClassTable };
