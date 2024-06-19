import "./UserList.css";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Space, Table, Button, Modal, Form, Input, message, Flex } from "antd";
import {
  EditOutlined,
  UserOutlined,
  LockOutlined,
  FilterOutlined,
} from "@ant-design/icons";

import { addNewAcc, getAccList, removeAcc } from "../../../Constant/User";

const UserList = () => {
  const nav = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: "success",
      content: "Successfully add new user!",
    });
  };
  const filterFail = (field, value) => {
    messageApi.open({
      type: "error",
      content: `No user has ${value} as ${field}`,
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

  const [userList, setUserList] = useState(null);
  const [filterUser, setFilterUser] = useState([]);

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
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <a
          onClick={() => {
            handleDelete(record.accountID);
          }}
        >
          Delete
        </a>
      ),
    },
  ];

  const [isAddUser, setIsAddUser] = useState(false);
  const showAddUserModal = () => {
    setIsAddUser(true);
  };
  const handleCancel = () => {
    setIsFilter(false);
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
      if (res.status >= 200 && res.status < 300) {
        success();
        setIsAddUser(false);
      } else {
        apiError();
      }
    });
  };

  const [isFilter, setIsFilter] = useState(false);
  function onFilter() {
    setIsFilter(true);
  }
  function onFinishFilter(values) {
    let needFilter = false;
    let filterList = userList;

    if (values.name) {
      needFilter = true;
      filterList = filterList.filter((elem) =>
        elem.fullName.includes(values.name)
      );

      if (filterList.length == 0) {
        filterFail("name", values.name);
        return 0;
      }
    }
    if (values.role) {
      needFilter = true;
      filterList = filterList.filter((elem) =>
        elem.account.role.includes(values.role)
      );

      if (filterList.length == 0) {
        filterFail("role", values.role);
        return 0;
      }
    }
    if (values.email) {
      needFilter = true;
      filterList = filterList.filter((elem) =>
        elem.account.email.includes(values.email)
      );

      if (filterList.length == 0) {
        filterFail("email", values.email);
        return 0;
      }
    }
    if (values.active) {
      needFilter = true;
      filterList = filterList.filter((elem) =>
        elem.account.active.includes(values.active)
      );

      if (filterList.length == 0) {
        filterFail("active status", values.active);
        return 0;
      }
    }

    if (needFilter) {
      setIsFilter(false);
      setFilterUser(filterList);
    } else {
      setIsFilter(false);
    }
  }

  function cancelFilter() {
    setIsFilter(false);
    setFilterUser([]);
  }

  const handleDelete = (id) => {
    removeAcc(id).then((res) => {
      if (res.status >= 200 && res.status < 300) {
        deleteFinish();
        nav("/accountList");
      } else {
        deleteFail();
      }
    });
  };

  return (
    <Space direction="vertical" size={50}>
      {contextHolder}
      <Modal
        title="Filtering User"
        open={isFilter}
        onCancel={handleCancel}
        footer={null}
      >
        <Form name="filteringUser" onFinish={onFinishFilter}>
          <Form.Item name="name" style={{ marginTop: 25 }}>
            <Input placeholder="Name" />
          </Form.Item>

          <Form.Item
            name="role"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input placeholder="Role: (ex: ADMIN or USER)" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input placeholder="Email: sample@example.vmail.xyz" />
          </Form.Item>

          <Form.Item
            name="active"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input placeholder="Actived or Unactive" />
          </Form.Item>

          <Flex
            style={{ marginTop: 25, marginBottom: 25 }}
            justify="center"
            align="center"
          >
            <Space size={10}>
              <Button type="primary" htmlType="submit">
                Confirm
              </Button>
              <Button type="" onClick={cancelFilter}>
                Cancel Filtering
              </Button>
            </Space>
          </Flex>
        </Form>
      </Modal>

      <Space id="header-container">
        <div class="text-2xl font-bold">Users' Information</div>

        <Button style={{ border: "none" }} onClick={onFilter}>
          <FilterOutlined style={{ fontSize: 20 }} />
        </Button>

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
          dataSource={filterUser.length == 0 ? userList : filterUser}
          columns={userAttribute}
          pagination={{ pageSize: 20 }}
        />
      </div>
    </Space>
  );
};

export default UserList;
