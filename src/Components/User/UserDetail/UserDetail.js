import "./UserDetail.css";

import React, { useState } from "react";
import { useParams } from "react-router-dom";

import {
  Form,
  Flex,
  Input,
  Space,
  Image,
  Button,
  message,
} from "antd";
import { EditOutlined } from "@ant-design/icons";

import Capitalize from "../../hook/capitalize";

import { ClassTable } from "../../Class/ClassList/ClassList";
import usersData from "../../../Constant/initialData/user.json";
import schedule from "../../../Constant/initialData/schedule.json";

const UserDetail = () => {
  const params = useParams();

  const userData = usersData.filter(
    (user) => user.accountID == params.accountID
  )[0];
  const userSchedule = schedule.filter(
    (elem) => elem.userId == params.accountID
  );

  const [messageApi, contextHolder] = message.useMessage();
  const info = () => {
    messageApi.info("Edit successfully, wait for admin to approve!");
  };

  const [editMode, setEditMode] = useState(false);
  function handleEdit() {
    setEditMode(true);
  }
  function handleCancel() {
    setEditMode(false);
  }

  return (
    <div class="m-10">
      {contextHolder}
      <Space direction="vertical" size={50}>
        <Form colon={false} onFinish={info} autoComplete="off">
          <Space size={100}>
            <Space direction="vertical" size={50}>
              <Space>
                <div class="text-2xl font-bold">User's information</div>
                <Button style={{ border: "none" }} onClick={handleEdit}>
                  <EditOutlined style={{ fontSize: 20 }} />
                </Button>
              </Space>
              <Space size={50}>
                <Space direction="vertical">
                  <Form.Item
                    name="name"
                    label={<div class="font-bold text-xl">Name:</div>}
                  >
                    {editMode ? (
                      <Input
                        defaultValue={Capitalize(userData.fullName)}
                      ></Input>
                    ) : (
                      <div class="text-xl">{Capitalize(userData.fullName)}</div>
                    )}
                  </Form.Item>

                  <Form.Item
                    name="role"
                    label={<div class="font-bold text-xl">Role:</div>}
                  >
                    {editMode ? (
                      <Input defaultValue={userData.account.role}></Input>
                    ) : (
                      <span class="text-xl">{userData.account.role}</span>
                    )}
                  </Form.Item>
                </Space>

                <Space direction="vertical">
                  <Form.Item
                    name="email"
                    label={<div class="font-bold text-xl">Email:</div>}
                  >
                    {editMode ? (
                      <Input defaultValue={userData.account.email}></Input>
                    ) : (
                      <span class="text-xl">
                        {Capitalize(userData.account.email)}
                      </span>
                    )}
                  </Form.Item>

                  <Form.Item
                    name="active"
                    label={
                      <div class="font-bold text-xl">Activate status:</div>
                    }
                  >
                    <div class="text-xl">
                      {userData.account.active
                        ? "Activated"
                        : "Need activation"}
                    </div>
                  </Form.Item>
                </Space>
              </Space>
            </Space>

            <div class="ml-10">
              <Image
                src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${userData.accountID}`}
                width={200}
                height={200}
              />
            </div>
          </Space>

          <Form.Item>
            {editMode ? (
              <Flex style={{ marginTop: 50 }} justify="center" align="center">
                <Space size={10}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                  <Button type="" htmlType="submit" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Space>
              </Flex>
            ) : (
              <></>
            )}
          </Form.Item>
        </Form>

        <Space direction="vertical" size={25}>
          <div class="text-2xl font-bold">Schedule</div>
          <ClassTable
            schedule={userSchedule}
            pageSize={5}
            scroll={300}
          ></ClassTable>
        </Space>
      </Space>
    </div>
  );
};

export default UserDetail;
