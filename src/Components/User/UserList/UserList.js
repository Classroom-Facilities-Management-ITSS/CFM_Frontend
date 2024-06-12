import "./UserList.css";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Space, Table, Button, Modal, Form, Input, message } from "antd";
import {
  EditOutlined,
  UserOutlined,
  LockOutlined,
  AuditOutlined,
} from "@ant-design/icons";

import { addNewAcc, getAccList } from "../../../Constant/User";

const userAttribute = [
  {
    title: "Name",
    dataIndex: "fullName",
    key: "fullName",
    render: (text, record) => (
      <Link to={`/account/${record.accountID}`}>{text}</Link>
    ),
  },
  {
    title: "Role",
    key: "role",
    render: (record) => <div>{record.account.role}</div>,
  },
  {
    title: "Email",
    key: "email",
    render: (record) => <div>{record.account.email}</div>,
  },
  {
    title: "Active status",
    key: "active",
    render: (record) => (
      <div>{record.account.active ? "Actived" : "Unactive"}</div>
    ),
  },
];

const UserList = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: "success",
      content: "Successfully add new user!",
    });
  };
  const passConfirmError = () => {
    messageApi.open({
      type: "error",
      content: "Confirm Password must be the same as new password!",
    });
  };
  const apiError = () => {
    messageApi.open({
      type: "error",
      content: "API Error! Try to reconnect your API!",
    });
  };

  const [userList, setUserList] = useState(null);

  useEffect(() => {
    async function getList() {
      let list = await getAccList();
      setUserList(list);
    }
    try {
      getList();
    } catch (error) {
      apiError();
      console.log(error);
    }
  }, []);

  const [isAddUser, setIsAddUser] = useState(false);
  const showAddUserModal = () => {
    setIsAddUser(true);
  };
  const handleCancel = () => {
    setIsAddUser(false);
  };
  const onFinishAdd = (values) => {
    if (values.password != values.confirmPassword) {
      passConfirmError();
      return 0;
    }

    let newAccount = {
      email: values.email,
      password: values.password,
    };

    addNewAcc(newAccount).then((res) => {
      if (res.status == 200) {
        success();
        setIsAddUser(false);
      } else {
        apiError();
      }
    });
  };

  return (
    <Space direction="vertical" size={50}>
      {contextHolder}
      <Space id="header-container">
        <div class="text-2xl font-bold">Users' Information</div>
        <Button style={{ border: "none" }} onClick={showAddUserModal}>
          <EditOutlined style={{ fontSize: 20 }} />
        </Button>
      </Space>

      <div class="px-10">
        <Modal
          title="New User"
          open={isAddUser}
          onCancel={handleCancel}
          footer={null}
        >
          <Form name="addNewUser" onFinish={onFinishAdd}>
            <Form.Item
              style={{ marginTop: 25 }}
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input user's email!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input user's password!",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Please confirm user's password!",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Confirm password"
              />
            </Form.Item>

            <Form.Item
              name="firstName"
              rules={[
                {
                  required: true,
                  message: "Please input user's first name!",
                },
              ]}
            >
              <Input
                prefix={<AuditOutlined className="site-form-item-icon" />}
                placeholder="First name"
              />
            </Form.Item>

            <Form.Item
              name="lastName"
              rules={[
                {
                  required: true,
                  message: "Please input user's last name!",
                },
              ]}
            >
              <Input
                prefix={<AuditOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Last name"
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

        <Table
          scroll={{ y: 700 }}
          dataSource={userList}
          columns={userAttribute}
          pagination={{ pageSize: 20 }}
        />
      </div>
    </Space>
  );
};

export default UserList;
