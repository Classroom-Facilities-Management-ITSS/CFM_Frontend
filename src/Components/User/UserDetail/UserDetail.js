import "./UserDetail.css";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Form, Flex, Input, Space, Image, Button, message } from "antd";
import { EditOutlined } from "@ant-design/icons";

import Capitalize from "../../hook/capitalize";

import { ClassTable } from "../../Class/ClassList/ClassList";

import { getAcc, renewProfile, uploadAvatar, getAvatar } from "../../../Constant/User";
import { getScheduleByEmail } from "../../../Constant/Schedule";

const UserDetail = () => {
  const params = useParams();

  const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem("user")));
  const [userData, setUserData] = useState(null);
  const [userSchedule, setUserSchedule] = useState(null);

  useEffect(() => {
    async function getData() {
      let data = await getAcc(params.accountID);
      setUserData(data);

      let schedule = await getScheduleByEmail(data.account.email);
      setUserSchedule(schedule);
    }
    getData();
  }, []);

  const [messageApi, contextHolder] = message.useMessage();
  const info = () => {
    messageApi.info("Edit successfully, wait for admin to approve!");
  };
  const apiError = () => {
    messageApi.open({
      type: "error",
      content: "API Error! Try to reconnect your API!",
    });
  };
  const noChange = () => {
    messageApi.error("Nothing change, undo your request!");
  };

  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(false);
  function handleEdit() {
    setEditMode(true);
  }
  function handleCancel() {
    form.resetFields();
    setEditMode(false);
  }
  const onFinishEdit = (values) => {
    let isChange = false;
    let newUserInfo = userData;

    if (values.name) {
      isChange = true;
      newUserInfo.firstName = values.name.split(" ")[0];
      newUserInfo.lastName = values.name.split(" ").pop();
      newUserInfo.fullName = values.name;
    }
    if (values.dob) {
      isChange = true;
      newUserInfo.dob = values.dob;
    }
    if (values.department) {
      isChange = true;
      newUserInfo.department = values.department;
    }

    if (isChange) {
      renewProfile(newUserInfo).then((res) => {
        if (res.status >= 200 && res.status < 300) {
          info();
          setEditMode(false);

          if (admin.account.role == "USER") {
            userData.department = newUserInfo.department;
            userData.firstName = newUserInfo.firstName;
            userData.lastName = newUserInfo.lastName;
            userData.fullName = newUserInfo.fullName;
            userData.dob = newUserInfo.dob;

            localStorage.setItem("user", JSON.stringify(userData, null, "\t"));
          }
        } else {
          apiError();
        }
      });
    } else {
      noChange();
    }
  };
  const [avatar, setAvatar] = useState(null);
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const response = await uploadAvatar(file);
        if (response.status === "success") {
          message.success("Upload thành công!");
          const newAvatar = await getAvatar(userData.accountID); // Giả sử response trả về thông tin avatar mới
          setAvatar(newAvatar);
        } else {
          message.error("Upload thất bại!");
        }
      } catch (error) {
        console.error("Error uploading avatar:", error);
        message.error("Đã xảy ra lỗi khi upload!");
      }
    }
  };
  useEffect(() => {
    async function fetchAvatar() {
      try {
        const avatarData = await getAvatar(params.accountID);
        setAvatar(avatarData);
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    }
    fetchAvatar();
  }, []);
    

  return (
    <div class="m-10">
      {contextHolder}
      {userData ? (
        <Space direction="vertical" size={50}>
          <Form
            form={form}
            colon={false}
            onFinish={onFinishEdit}
            autoComplete="off"
          >
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
                        <div class="text-xl">
                          {Capitalize(userData.fullName)}
                        </div>
                      )}
                    </Form.Item>

                    <Form.Item
                      name="role"
                      label={<div class="font-bold text-xl">Role:</div>}
                    >
                      <span class="text-xl">{userData.account.role}</span>
                    </Form.Item>

                    <Form.Item
                      name="dob"
                      label={<div class="font-bold text-xl">Birthday:</div>}
                    >
                      {editMode ? (
                        <Input defaultValue={userData.dob}></Input>
                      ) : (
                        <div class="text-xl">{userData.dob}</div>
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
                        <span class="text-xl">{userData.account.email}</span>
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

                    <Form.Item
                      name="department"
                      label={<div class="font-bold text-xl">Department:</div>}
                    >
                      {editMode ? (
                        <Input defaultValue={userData.department}></Input>
                      ) : (
                        <span class="text-xl">
                          {Capitalize(userData.department)}
                        </span>
                      )}
                    </Form.Item>
                  </Space>
                </Space>
              </Space>

              <div className="ml-10">
  <Image
                  src={`${process.env.REACT_APP_API_URL}?name=${avatar || userData.avatar}`}
                  width={200}
    height={200}
  />
  {editMode && (
    <div>
      <input type="file" accept="image/*" onChange={handleUpload} />
    </div>
  )}
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
            {userSchedule ? (
              <ClassTable
                schedule={userSchedule}
                pageSize={5}
                scroll={300}
              ></ClassTable>
            ) : (
              <></>
            )}
          </Space>
        </Space>
      ) : (
        <></>
      )}
    </div>
  );
};

export default UserDetail;
